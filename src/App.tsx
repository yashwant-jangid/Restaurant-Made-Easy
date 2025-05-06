
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import Index from '@/pages/Index';
import Menu from '@/pages/Menu';
import NotFound from '@/pages/NotFound';
import Status from '@/pages/Status';
import Dashboard from '@/pages/Dashboard';
import Feedback from '@/pages/Feedback';
import AdminLogin from '@/pages/AdminLogin';
import { CartProvider } from '@/context/CartContext';
import { Toaster } from '@/components/ui/sonner';
import { UserRoleProvider } from '@/context/UserRoleContext';
import { useUserRole } from '@/context/UserRoleContext';

// Protected route component to ensure only admins can access certain pages
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin } = useUserRole();
  
  if (!isAdmin) {
    return <Navigate to="/admin-login" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <CartProvider>
      <UserRoleProvider>
        <Router>
          <Routes>
            <Route path="/" element={<MainLayout><Outlet /></MainLayout>}>
              <Route index element={<Index />} />
              <Route path="menu" element={<Menu />} />
              <Route path="status" element={<Status />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="feedback" element={<Feedback />} />
              <Route path="admin-login" element={<AdminLogin />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Router>
        <Toaster richColors position="top-center" />
      </UserRoleProvider>
    </CartProvider>
  );
}

export default App;
