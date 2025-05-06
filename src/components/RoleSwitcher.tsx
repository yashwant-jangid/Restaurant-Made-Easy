
import React from 'react';
import { useUserRole, UserRole } from '@/context/UserRoleContext';
import { Button } from '@/components/ui/button';
import { Shield, User } from 'lucide-react';

const RoleSwitcher: React.FC = () => {
  const { role, setRole } = useUserRole();
  
  const toggleRole = () => {
    const newRole: UserRole = role === 'admin' ? 'customer' : 'admin';
    setRole(newRole);
  };
  
  return (
    <Button 
      variant="outline" 
      size="sm"
      onClick={toggleRole}
      className="flex items-center gap-1.5"
    >
      {role === 'admin' ? (
        <>
          <Shield className="h-4 w-4" />
          <span className="hidden sm:inline">Admin Mode</span>
        </>
      ) : (
        <>
          <User className="h-4 w-4" />
          <span className="hidden sm:inline">Customer Mode</span>
        </>
      )}
    </Button>
  );
};

export default RoleSwitcher;
