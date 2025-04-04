
import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  BarChart3,
  Brain,
  FileText,
  Home,
  Settings,
  Shield
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import Header from './Header';
import useMobile from '@/hooks/use-mobile';

const Sidebar = () => {
  const location = useLocation();
  const isMobile = useMobile();
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  }, [isMobile]);

  const items = [
    {
      name: 'Dashboard',
      href: '/',
      icon: Home
    },
    {
      name: 'AI Models',
      href: '/models',
      icon: Brain
    },
    {
      name: 'Logs',
      href: '/logs',
      icon: FileText
    },
    {
      name: 'Feature Flags',
      href: '/feature-flags',
      icon: Settings
    }
  ];

  return (
    <div
      className={cn(
        'fixed min-h-screen inset-y-0 left-0 z-40 flex w-64 flex-col border-r bg-background transition-transform duration-300 ease-in-out',
        isMobile && !isOpen && '-translate-x-full'
      )}
    >
      <div className="h-16 flex items-center px-6 border-b">
        <Link to="/" className="flex items-center space-x-2">
          <Shield className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold">AI Trader</span>
        </Link>
      </div>
      <ScrollArea className="flex-1 py-4">
        <nav className="space-y-1 px-3">
          {items.map((item) => (
            <Button
              key={item.href}
              variant={location.pathname === item.href ? 'secondary' : 'ghost'}
              className={cn(
                'w-full justify-start',
                location.pathname === item.href
                  ? 'bg-secondary text-secondary-foreground font-medium'
                  : 'hover:bg-secondary/20'
              )}
              asChild
            >
              <Link to={item.href} className="flex items-center">
                <item.icon className="mr-2 h-5 w-5" />
                {item.name}
              </Link>
            </Button>
          ))}
        </nav>
      </ScrollArea>
    </div>
  );
};

const MainLayout = () => {
  const isMobile = useMobile();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isMobile]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header
        sidebarOpen={sidebarOpen}
        onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      <Sidebar />
      <div
        className={cn(
          'flex flex-1 flex-col transition-all duration-300 ease-in-out',
          sidebarOpen ? 'lg:pl-64' : 'lg:pl-0'
        )}
      >
        <main className="flex-1 pt-16">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
