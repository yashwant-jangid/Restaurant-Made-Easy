import React, { useState, useEffect } from 'react';
import { menuItems } from '@/lib/data';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Check, 
  Clock, 
  ChefHat,
  Bell,
  BarChart3,
  Users,
  CreditCard,
  Utensils,
  TrendingUp,
  Sparkles,
  Star,
  User,
  ShoppingCart
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { useUserRole } from '@/context/UserRoleContext';
import RoleSwitcher from '@/components/RoleSwitcher';
import { useNavigate } from 'react-router-dom';
import OrdersDisplay from '@/components/OrdersDisplay';

interface Order {
  id: string;
  order_number: string;
  table_number: number;
  status: 'pending' | 'preparing' | 'ready' | 'completed';
  total: number;
  estimated_time: number;
  created_at: string;
}

interface ActiveTable {
  id: number;
  table_number: number;
  status: 'available' | 'occupied';
  updated_at: string;
}

const Dashboard = () => {
  const { isAdmin } = useUserRole();
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTables, setActiveTables] = useState<ActiveTable[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (ordersError) {
          throw new Error(`Failed to fetch orders: ${ordersError.message}`);
        }
        
        const { data: tablesData, error: tablesError } = await supabase
          .from('active_tables')
          .select('*')
          .order('table_number', { ascending: true });
        
        if (tablesError) {
          throw new Error(`Failed to fetch active tables: ${tablesError.message}`);
        }
        
        setOrders((ordersData as Order[]) || []);
        setActiveTables((tablesData as ActiveTable[]) || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load dashboard data');
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  useEffect(() => {
    const ordersChannel = supabase
      .channel('orders-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setOrders(prev => [(payload.new as Order), ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setOrders(prev => 
              prev.map(order => 
                order.id === payload.new.id ? (payload.new as Order) : order
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setOrders(prev => 
              prev.filter(order => order.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();
    
    const tablesChannel = supabase
      .channel('tables-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'active_tables'
        },
        (payload) => {
          setActiveTables(prev => 
            prev.map(table => 
              table.id === payload.new.id ? (payload.new as ActiveTable) : table
            )
          );
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(ordersChannel);
      supabase.removeChannel(tablesChannel);
    };
  }, []);
  
  useEffect(() => {
    const autoUpdateOrderStatus = async () => {
      const pendingOrders = orders.filter(order => 
        order.status === 'pending' && 
        (new Date().getTime() - new Date(order.created_at).getTime()) > 120000
      );
      
      for (const order of pendingOrders) {
        await handleUpdateStatus(order.id, 'preparing');
      }
      
      const preparingOrders = orders.filter(order => 
        order.status === 'preparing' && 
        (new Date().getTime() - new Date(order.created_at).getTime()) > 300000
      );
      
      for (const order of preparingOrders) {
        await handleUpdateStatus(order.id, 'ready');
      }
    };
    
    const interval = setInterval(autoUpdateOrderStatus, 60000);
    
    return () => clearInterval(interval);
  }, [orders]);
  
  const handleUpdateStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);
      
      if (error) {
        throw new Error(`Failed to update order status: ${error.message}`);
      }
      
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      
      if (newStatus === 'completed') {
        const order = orders.find(o => o.id === orderId);
        if (order) {
          await supabase
            .from('active_tables')
            .update({ status: 'available' })
            .eq('table_number', order.table_number);
        }
      }
      
      toast.success(`Order #${orders.find(o => o.id === orderId)?.order_number} status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };
  
  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">Pending</Badge>;
      case 'preparing':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Preparing</Badge>;
      case 'ready':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Ready</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">Completed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total), 0);
  const averagePreparationTime = orders.length > 0 ? 
    Math.round(
      orders.reduce((sum, order) => sum + order.estimated_time, 0) / Math.max(1, totalOrders)
    ) : 0;
  
  const activatedTables = activeTables.filter(table => table.status === 'occupied').length;
  const totalTables = activeTables.length;
  
  const popularItems = menuItems
    .filter(item => item.popular)
    .slice(0, 3);
    
  // Get the user's orders (most recent first)
  const myOrders = orders
    .filter(order => order.status !== 'completed')
    .slice(0, 3);
  
  if (loading) {
    return (
      <div className="container py-8 flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading dashboard data...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
            {isAdmin ? "Restaurant Dashboard" : "Customer Dashboard"}
          </h1>
          <p className="text-muted-foreground text-lg">
            {isAdmin 
              ? "Manage orders and view restaurant analytics" 
              : "View your orders and popular menu items"}
          </p>
        </div>
        <div className="flex gap-2">
          <RoleSwitcher />
          {isAdmin && (
            <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-all">
              <Bell className="mr-2 h-4 w-4" />
              New Order Notifications
            </Button>
          )}
          {!isAdmin && (
            <Button 
              onClick={() => navigate('/menu')}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-all"
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Order Now
            </Button>
          )}
        </div>
      </div>
      
      {isAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="animate-slide-up border-l-4 border-indigo-500 shadow-md hover:shadow-lg transition-all" style={{ animationDelay: '0.1s' }}>
            <CardHeader className="pb-2">
              <CardDescription className="text-indigo-600 font-medium">Total Orders</CardDescription>
              <CardTitle className="text-4xl flex items-end gap-2 font-bold">
                {totalOrders}
                <span className="text-sm text-muted-foreground font-normal">today</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-muted-foreground text-sm flex items-center">
                <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
                <span>+12% from yesterday</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="animate-slide-up border-l-4 border-purple-500 shadow-md hover:shadow-lg transition-all" style={{ animationDelay: '0.2s' }}>
            <CardHeader className="pb-2">
              <CardDescription className="text-purple-600 font-medium">Revenue</CardDescription>
              <CardTitle className="text-4xl flex items-end gap-2 font-bold">
                ₹{totalRevenue.toFixed(2)}
                <span className="text-sm text-muted-foreground font-normal">today</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-muted-foreground text-sm flex items-center">
                <CreditCard className="h-4 w-4 mr-1 text-green-500" />
                <span>Average order: ₹{totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : '0.00'}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="animate-slide-up border-l-4 border-blue-500 shadow-md hover:shadow-lg transition-all" style={{ animationDelay: '0.3s' }}>
            <CardHeader className="pb-2">
              <CardDescription className="text-blue-600 font-medium">Avg. Preparation Time</CardDescription>
              <CardTitle className="text-4xl flex items-end gap-2 font-bold">
                {averagePreparationTime}
                <span className="text-sm text-muted-foreground font-normal">minutes</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-muted-foreground text-sm flex items-center">
                <Clock className="h-4 w-4 mr-1 text-amber-500" />
                <span>-2 min from yesterday</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="animate-slide-up border-l-4 border-teal-500 shadow-md hover:shadow-lg transition-all" style={{ animationDelay: '0.4s' }}>
            <CardHeader className="pb-2">
              <CardDescription className="text-teal-600 font-medium">Active Tables</CardDescription>
              <CardTitle className="text-4xl flex items-end gap-2 font-bold">
                {activatedTables}
                <span className="text-sm text-muted-foreground font-normal">/ {totalTables} total</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-muted-foreground text-sm flex items-center">
                <Users className="h-4 w-4 mr-1 text-green-500" />
                <span>{Math.round((activatedTables / totalTables) * 100)}% capacity</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {!isAdmin && (
        <div className="mb-8">
          <Card className="animate-slide-up shadow-md hover:shadow-lg transition-all" style={{ animationDelay: '0.1s' }}>
            <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b">
              <CardTitle className="text-2xl font-bold flex items-center">
                <User className="h-5 w-5 mr-2 text-blue-500" />
                My Orders
              </CardTitle>
              <CardDescription>
                View and track your recent orders
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <OrdersDisplay orders={myOrders} isAdmin={false} />
            </CardContent>
          </Card>
        </div>
      )}
      
      {isAdmin ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="col-span-1 lg:col-span-2 shadow-md hover:shadow-lg transition-all">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b">
              <CardTitle className="text-2xl font-bold flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-amber-500" />
                Active Orders
              </CardTitle>
              <CardDescription>
                Manage and track customer orders in real-time
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <OrdersDisplay orders={orders} isAdmin={true} />
            </CardContent>
          </Card>
          
          <Card className="shadow-md hover:shadow-lg transition-all">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b">
              <CardTitle className="text-2xl font-bold flex items-center">
                <Star className="h-5 w-5 mr-2 text-amber-500" />
                Popular Items
              </CardTitle>
              <CardDescription>
                Most ordered dishes this week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 pt-2">
                {popularItems.map(item => (
                  <div key={item.id} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-lg transition-colors">
                    <div className="w-16 h-16 rounded-md overflow-hidden shrink-0 border shadow-sm">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{item.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Utensils className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{item.category}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{item.preparationTime} min prep time</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₹{item.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="mb-8">
          <Card className="shadow-md hover:shadow-lg transition-all">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b">
              <CardTitle className="text-2xl font-bold flex items-center">
                <Star className="h-5 w-5 mr-2 text-amber-500" />
                Popular Items
              </CardTitle>
              <CardDescription>
                Try our most popular dishes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 pt-2">
                {popularItems.map(item => (
                  <div key={item.id} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-lg transition-colors">
                    <div className="w-16 h-16 rounded-md overflow-hidden shrink-0 border shadow-sm">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{item.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Utensils className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{item.category}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Star className="h-3 w-3 text-amber-500" />
                        <span className="text-xs text-muted-foreground">Highly rated</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₹{item.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
