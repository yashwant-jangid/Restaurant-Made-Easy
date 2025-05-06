
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import Index from '@/pages/Index';
import Menu from '@/pages/Menu';
import NotFound from '@/pages/NotFound';
import Status from '@/pages/Status';
import Dashboard from '@/pages/Dashboard';
import Feedback from '@/pages/Feedback';
import { CartProvider } from '@/context/CartContext';
import { Toaster } from '@/components/ui/sonner';
import { UserRoleProvider } from '@/context/UserRoleContext';

function App() {
  return (
    <CartProvider>
      <UserRoleProvider>
        <Router>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Index />} />
              <Route path="menu" element={<Menu />} />
              <Route path="status" element={<Status />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="feedback" element={<Feedback />} />
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
