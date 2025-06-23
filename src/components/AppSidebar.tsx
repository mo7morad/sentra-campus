import { NavLink, useLocation } from "react-router-dom";
import {
  BarChart,
  Users,
  BookOpen,
  MessageSquare,
  LogOut,
  User,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const navigation = [
  { title: "Dashboard", url: "/dashboard", icon: BarChart },
  { title: "Lecturer Performance", url: "/lecturer-performance", icon: Users },
  { title: "Course Evaluation", url: "/course-evaluation", icon: BookOpen },
  { title: "Feedback Management", url: "/feedback-management", icon: MessageSquare },
  { title: "Reports & Analytics", url: "/reports", icon: BarChart },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const currentPath = location.pathname;
  const isCollapsed = state === "collapsed";

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of the system.",
    });
    navigate('/login');
  };

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    `w-full justify-start transition-colors ${
      isActive 
        ? "bg-sidebar-accent text-sidebar-primary font-medium" 
        : "text-sidebar-foreground hover:bg-sidebar-accent/50"
    }`;

  return (
    <Sidebar className={isCollapsed ? "w-14" : "w-64"} collapsible="icon">
      <SidebarContent className="bg-sidebar">
        {/* Header */}
        <div className="p-3 sm:p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-sidebar-primary rounded-lg flex items-center justify-center flex-shrink-0">
              <BarChart className="w-3 h-3 sm:w-4 sm:h-4 text-sidebar-primary-foreground" />
            </div>
            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                <h2 className="text-xs sm:text-sm font-semibold text-sidebar-foreground truncate">
                  Campus MIS
                </h2>
                <p className="text-xs text-sidebar-foreground/60 truncate">
                  Feedback Analytics
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <SidebarGroup className="px-2 py-2 sm:py-4 flex-1">
          <SidebarGroupLabel className="text-sidebar-foreground/60 text-xs uppercase tracking-wider mb-2">
            {!isCollapsed ? "Main Navigation" : ""}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end 
                      className={getNavCls}
                    >
                      <item.icon className="w-4 h-4 flex-shrink-0" />
                      {!isCollapsed && (
                        <span className="truncate text-sm">{item.title}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* User Section */}
        <div className="mt-auto p-3 sm:p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-sidebar-accent rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-3 h-3 sm:w-4 sm:h-4 text-sidebar-foreground" />
            </div>
            {!isCollapsed && user && (
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-sidebar-foreground truncate">
                  {user.first_name} {user.last_name}
                </p>
                <p className="text-xs text-sidebar-foreground/60 truncate">
                  System Administrator
                </p>
              </div>
            )}
            <div className="flex items-center gap-1 sm:gap-2">
              <ThemeToggle />
              {!isCollapsed && (
                <button 
                  onClick={handleLogout}
                  className="p-1 hover:bg-sidebar-accent rounded transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-3 h-3 sm:w-4 sm:h-4 text-sidebar-foreground/60" />
                </button>
              )}
            </div>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
