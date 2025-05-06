import React from 'react';
import { useNavigate } from 'react-router-dom';
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
  Clock,
  ArrowRight,
  ShoppingCart
} from "lucide-react";

interface Order {
  id: string;
  order_number: string;
  table_number: number;
  status: 'pending' | 'preparing' | 'ready' | 'completed';
  total: number;
  estimated_time: number;
  created_at: string;
}

interface OrdersDisplayProps {
  orders: Order[];
  isAdmin?: boolean;
}

const OrdersDisplay: React.FC<OrdersDisplayProps> = ({ orders, isAdmin = false }) => {
  const navigate = useNavigate();
  
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
  
  if (orders.length === 0) {
    return (
      <div className="p-6 text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-3">
          <ShoppingCart className="h-8 w-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-medium mb-2">No orders found</h3>
        <p className="text-muted-foreground mb-4">There are no active orders at the moment.</p>
        <Button onClick={() => navigate('/menu')}>
          Order Now <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    );
  }
  
  if (isAdmin) {
    return (
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map(order => (
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
                  </TableRow>
                ))}
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
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.filter(order => order.status === statusFilter).length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4">
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
                        </TableRow>
                      ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    );
  } else {
    // Customer view - simpler list of their orders
    return (
      <div className="divide-y">
        {orders.map(order => (
          <div key={order.id} className="p-4 hover:bg-slate-50 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-medium">Order #{order.order_number}</h4>
                <div className="text-sm text-muted-foreground">
                  Table {order.table_number} • {new Date(order.created_at).toLocaleDateString()}
                </div>
              </div>
              <div>
                {getStatusBadge(order.status)}
              </div>
            </div>
            <div className="flex justify-between items-center mt-3">
              <div className="flex items-center text-sm">
                <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                <span>{order.estimated_time} min</span>
              </div>
              <div>
                <Button variant="outline" size="sm" onClick={() => navigate(`/status?id=${order.id}`)}>
                  Track Order
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
};

export default OrdersDisplay;
