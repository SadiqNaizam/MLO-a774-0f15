import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'; // Assuming simple list, not complex dropdowns for sidebar
import { cn } from '@/lib/utils'; // For conditional classes
import { Home, ShoppingCart, Package, Users, Settings, ChevronLeft, ChevronRight, BarChart3 } from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { href: '/dashboard', label: 'Overview', icon: Home },
  { href: '/dashboard/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/dashboard/products', label: 'Products', icon: Package },
  { href: '/dashboard/customers', label: 'Customers', icon: Users },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 }, // Example
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

interface DashboardSidebarProps {
  isInitiallyCollapsed?: boolean;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ isInitiallyCollapsed = false }) => {
  const [isCollapsed, setIsCollapsed] = useState(isInitiallyCollapsed);
  const location = useLocation();
  console.log("Rendering DashboardSidebar, collapsed:", isCollapsed);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    console.log("Sidebar toggled, new state collapsed:", !isCollapsed);
  };

  return (
    <aside
      className={cn(
        'hidden border-r bg-background sm:flex sm:flex-col transition-all duration-300 ease-in-out',
        isCollapsed ? 'sm:w-20' : 'sm:w-64'
      )}
    >
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link to="/dashboard" className="flex items-center gap-2 font-semibold">
          <Package className="h-6 w-6 text-primary" /> {/* Replace with actual logo */}
          {!isCollapsed && <span className="">Admin Panel</span>}
        </Link>
        {/* Optional: Notification badge for mobile not relevant here as it's a desktop sidebar */}
      </div>
      <div className="flex-1">
        <nav className={cn('grid items-start gap-1 px-2 text-sm font-medium lg:px-4 py-4', isCollapsed && "justify-center")}>
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted',
                location.pathname === item.href && 'bg-muted text-primary',
                isCollapsed && 'justify-center'
              )}
              title={isCollapsed ? item.label : undefined} // Show tooltip when collapsed
            >
              <item.icon className="h-5 w-5" />
              {!isCollapsed && item.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="mt-auto p-4 border-t">
        <Button variant="outline" size={isCollapsed ? "icon" : "default"} onClick={toggleSidebar} className="w-full">
          {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          {!isCollapsed && <span className="ml-2">Collapse</span>}
          <span className="sr-only">{isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}</span>
        </Button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;