
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
  Star
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';

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
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTables, setActiveTables] = useState<ActiveTable[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch orders
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (ordersError) {
          throw new Error(`Failed to fetch orders: ${ordersError.message}`);
        }
        
        // Fetch active tables
        const { data: tablesData, error: tablesError } = await supabase
          .from('active_tables')
          .select('*')
          .order('table_number', { ascending: true });
        
        if (tablesError) {
          throw new Error(`Failed to fetch active tables: ${tablesError.message}`);
        }
        
        // Type cast the data to ensure it conforms to our interfaces
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
  
  // Set up real-time subscriptions
  useEffect(() => {
    // Subscribe to order changes
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
    
    // Subscribe to active tables changes
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
  
  // Automatically update order status based on time
  useEffect(() => {
    // Auto-update function for progressing orders
    const autoUpdateOrderStatus = async () => {
      // Find pending orders older than 2 minutes and update to preparing
      const pendingOrders = orders.filter(order => 
        order.status === 'pending' && 
        (new Date().getTime() - new Date(order.created_at).getTime()) > 120000
      );
      
      for (const order of pendingOrders) {
        await handleUpdateStatus(order.id, 'preparing');
      }
      
      // Find preparing orders older than 5 minutes and update to ready
      const preparingOrders = orders.filter(order => 
        order.status === 'preparing' && 
        (new Date().getTime() - new Date(order.created_at).getTime()) > 300000
      );
      
      for (const order of preparingOrders) {
        await handleUpdateStatus(order.id, 'ready');
      }
    };
    
    // Run auto-update every minute
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
      
      // Update UI immediately (will be overwritten by real-time update)
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      
      // If order is completed, mark table as available
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
  
  // Calculate metrics for the dashboard
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total), 0);
  const averagePreparationTime = orders.length > 0 ? 
    Math.round(
      orders.reduce((sum, order) => sum + order.estimated_time, 0) / Math.max(1, totalOrders)
    ) : 0;
  
  // Count active tables
  const activatedTables = activeTables.filter(table => table.status === 'occupied').length;
  const totalTables = activeTables.length;
  
  // Most popular items (top 3)
  const popularItems = menuItems
    .filter(item => item.popular)
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
          <h1 className="text-4xl font-bold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">Restaurant Dashboard</h1>
          <p className="text-muted-foreground text-lg">Manage orders and view restaurant analytics</p>
        </div>
        <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-all">
          <Bell className="mr-2 h-4 w-4" />
          New Order Notifications
        </Button>
      </div>
      
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
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid grid-cols-4 p-4">
                <TabsTrigger value="all" className="font-medium">All</TabsTrigger>
                <TabsTrigger value="pending" className="font-medium">Pending</TabsTrigger>
                <TabsTrigger value="preparing" className="font-medium">Preparing</TabsTrigger>
                <TabsTrigger value="ready" className="font-medium">Ready</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-0">
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Table</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-4">
                            No orders available
                          </TableCell>
                        </TableRow>
                      ) : (
                        orders.map(order => (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium">#{order.order_number}</TableCell>
                            <TableCell>{order.table_number}</TableCell>
                            <TableCell>{getStatusBadge(order.status)}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3 text-muted-foreground" />
                                <span>{order.estimated_time} min</span>
                              </div>
                            </TableCell>
                            <TableCell>₹{Number(order.total).toFixed(2)}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                {order.status === 'pending' && (
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => handleUpdateStatus(order.id, 'preparing')}
                                  >
                                    <ChefHat className="h-3 w-3 mr-1" />
                                    Start
                                  </Button>
                                )}
                                {order.status === 'preparing' && (
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => handleUpdateStatus(order.id, 'ready')}
                                  >
                                    <Check className="h-3 w-3 mr-1" />
                                    Ready
                                  </Button>
                                )}
                                {order.status === 'ready' && (
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => handleUpdateStatus(order.id, 'completed')}
                                  >
                                    <Check className="h-3 w-3 mr-1" />
                                    Complete
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              
              {['pending', 'preparing', 'ready'].map(statusFilter => (
                <TabsContent key={statusFilter} value={statusFilter} className="mt-0">
                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order ID</TableHead>
                          <TableHead>Table</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Time</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders.filter(order => order.status === statusFilter).length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-4">
                              No {statusFilter} orders
                            </TableCell>
                          </TableRow>
                        ) : (
                          orders
                            .filter(order => order.status === statusFilter)
                            .map(order => (
                              <TableRow key={order.id}>
                                <TableCell className="font-medium">#{order.order_number}</TableCell>
                                <TableCell>{order.table_number}</TableCell>
                                <TableCell>{getStatusBadge(order.status)}</TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3 text-muted-foreground" />
                                    <span>{order.estimated_time} min</span>
                                  </div>
                                </TableCell>
                                <TableCell>₹{Number(order.total).toFixed(2)}</TableCell>
                                <TableCell>
                                  <div className="flex gap-2">
                                    {order.status === 'pending' && (
                                      <Button 
                                        size="sm" 
                                        variant="outline"
                                        onClick={() => handleUpdateStatus(order.id, 'preparing')}
                                      >
                                        <ChefHat className="h-3 w-3 mr-1" />
                                        Start
                                      </Button>
                                    )}
                                    {order.status === 'preparing' && (
                                      <Button 
                                        size="sm" 
                                        variant="outline"
                                        onClick={() => handleUpdateStatus(order.id, 'ready')}
                                      >
                                        <Check className="h-3 w-3 mr-1" />
                                        Ready
                                      </Button>
                                    )}
                                    {order.status === 'ready' && (
                                      <Button 
                                        size="sm" 
                                        variant="outline"
                                        onClick={() => handleUpdateStatus(order.id, 'completed')}
                                      >
                                        <Check className="h-3 w-3 mr-1" />
                                        Complete
                                      </Button>
                                    )}
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
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
    </div>
  );
};

export default Dashboard;
