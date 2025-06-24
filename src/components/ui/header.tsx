
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { ThemeToggle } from '@/components/ThemeToggle';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of the system.",
    });
    navigate('/login');
  };

  if (!user) return null;

  return (
    <header className="bg-background border-b border-border px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
      <div className="flex items-center justify-between">
        {/* Mobile menu trigger and title */}
        <div className="flex items-center gap-2 sm:gap-3">
          <SidebarTrigger className="md:hidden" />
          <div className="hidden sm:block">
            <h1 className="text-lg sm:text-xl font-semibold text-foreground">Campus MIS</h1>
            <p className="text-xs sm:text-sm text-muted-foreground">Management Information System</p>
          </div>
          <div className="sm:hidden">
            <h1 className="text-base font-semibold text-foreground">Campus MIS</h1>
          </div>
        </div>

        {/* User info and actions */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          <div className="hidden sm:flex items-center space-x-2">
            <User className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-foreground">
              {user.first_name} {user.last_name}
            </span>
          </div>
          
          {/* Mobile user initial */}
          <div className="sm:hidden flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-medium">
            {user.first_name?.[0]}{user.last_name?.[0]}
          </div>
          
          {/* Theme Toggle */}
          <ThemeToggle />
          
          {/* Logout Button */}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLogout}
            className="text-xs sm:text-sm"
          >
            <LogOut className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
