
import React, { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Cart from '@/components/Cart';
import { User, Menu as MenuIcon, Home, BarChart3, MessageSquare, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const showCart = !isActive('/status') && !isActive('/') && !isActive('/feedback');
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-40 w-full backdrop-blur-lg bg-background/90 border-b shadow-sm">
        <div className="container flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-purple-600" />
            <span className="font-bold text-xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Restaurant Made Easy
            </span>
          </Link>
          
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center space-x-1">
              <Link to="/menu">
                <Button variant={isActive('/menu') ? "default" : "ghost"} size="sm" className="font-medium">
                  Menu
                </Button>
              </Link>
              <Link to="/status">
                <Button variant={isActive('/status') ? "default" : "ghost"} size="sm" className="font-medium">
                  Track Order
                </Button>
              </Link>
              <Link to="/feedback">
                <Button variant={isActive('/feedback') ? "default" : "ghost"} size="sm" className="font-medium">
                  Feedback
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant={isActive('/dashboard') ? "default" : "ghost"} size="sm" className="font-medium">
                  Dashboard
                </Button>
              </Link>
            </div>
            
            {showCart && <Cart />}
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <MenuIcon className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[250px] sm:w-[300px]">
                <div className="py-4 grid gap-2">
                  <Link to="/">
                    <Button variant="ghost" className="w-full justify-start" size="lg">
                      <Home className="mr-2 h-5 w-5" />
                      Home
                    </Button>
                  </Link>
                  <Link to="/menu">
                    <Button variant="ghost" className="w-full justify-start" size="lg">
                      <MenuIcon className="mr-2 h-5 w-5" />
                      Menu
                    </Button>
                  </Link>
                  <Link to="/status">
                    <Button variant="ghost" className="w-full justify-start" size="lg">
                      <User className="mr-2 h-5 w-5" />
                      Track Order
                    </Button>
                  </Link>
                  <Link to="/feedback">
                    <Button variant="ghost" className="w-full justify-start" size="lg">
                      <MessageSquare className="mr-2 h-5 w-5" />
                      Feedback
                    </Button>
                  </Link>
                  <Link to="/dashboard">
                    <Button variant="ghost" className="w-full justify-start" size="lg">
                      <BarChart3 className="mr-2 h-5 w-5" />
                      Dashboard
                    </Button>
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        {children}
      </main>
      
      <footer className="border-t py-6 md:py-0 bg-gradient-to-r from-slate-50 to-slate-100">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 md:h-16">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Restaurant Made Easy. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link to="#" className="hover:underline hover:text-indigo-600 transition-colors">Privacy</Link>
            <Link to="#" className="hover:underline hover:text-indigo-600 transition-colors">Terms</Link>
            <Link to="/feedback" className="hover:underline hover:text-indigo-600 transition-colors">Feedback</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
