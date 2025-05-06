
import React from 'react';
import { useUserRole, UserRole } from '@/context/UserRoleContext';
import { Button } from '@/components/ui/button';
import { Shield, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const RoleSwitcher: React.FC = () => {
  const { role, setRole, isAdmin } = useUserRole();
  
  const toggleRole = () => {
    // If currently admin, switch to customer
    if (isAdmin) {
      setRole('customer');
    }
    // If currently customer, we don't automatically switch to admin
    // User needs to go through login page
  };
  
  return (
    <>
      {isAdmin ? (
        <Button 
          variant="outline" 
          size="sm"
          onClick={toggleRole}
          className="flex items-center gap-1.5"
        >
          <Shield className="h-4 w-4" />
          <span className="hidden sm:inline">Switch to Customer Mode</span>
        </Button>
      ) : (
        <Button 
          variant="outline" 
          size="sm"
          asChild
          className="flex items-center gap-1.5"
        >
          <Link to="/admin-login">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Admin Login</span>
          </Link>
        </Button>
      )}
    </>
  );
};

export default RoleSwitcher;
