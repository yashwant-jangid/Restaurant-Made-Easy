
import React, { createContext, useContext, useState, useEffect } from 'react';

// Define possible user roles
export type UserRole = 'admin' | 'customer';

interface UserRoleContextType {
  role: UserRole;
  isAdmin: boolean;
  setRole: (role: UserRole) => void;
  logout: () => void;
}

// Create the context with default values
const UserRoleContext = createContext<UserRoleContextType>({
  role: 'customer',
  isAdmin: false,
  setRole: () => {},
  logout: () => {}
});

export const UserRoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initial role state (from localStorage if available)
  const [role, setRoleState] = useState<UserRole>(() => {
    const savedRole = localStorage.getItem('userRole');
    return (savedRole === 'admin' ? 'admin' : 'customer') as UserRole;
  });

  // Persist role changes to localStorage
  useEffect(() => {
    localStorage.setItem('userRole', role);
  }, [role]);

  // Calculate derived state
  const isAdmin = role === 'admin';
  
  // Set role with validation
  const setRole = (newRole: UserRole) => {
    if (newRole === 'admin' || newRole === 'customer') {
      setRoleState(newRole);
    }
  };
  
  // Logout function - resets to customer role
  const logout = () => {
    setRoleState('customer');
  };

  return (
    <UserRoleContext.Provider value={{ 
      role, 
      isAdmin,
      setRole,
      logout
    }}>
      {children}
    </UserRoleContext.Provider>
  );
};

// Hook for using the UserRole context
export const useUserRole = () => useContext(UserRoleContext);

export default UserRoleContext;
