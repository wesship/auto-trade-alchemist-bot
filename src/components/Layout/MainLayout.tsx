
import React, { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { Sidebar } from "@/components/ui/sidebar";
import Header from "./Header";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  BarChart3,
  Brain,
  FileText,
  Settings,
  TrendingUp,
  Flag,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
  { name: "Models", href: "/models", icon: Brain },
  { name: "Forecast", href: "/forecast", icon: TrendingUp },
  { name: "Logs", href: "/logs", icon: FileText },
  { name: "Feature Flags", href: "/feature-flags", icon: Flag },
];

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();

  const getCurrentPageName = () => {
    const currentRoute = navigation.find((item) =>
      location.pathname.startsWith(item.href)
    );
    
    if (location.pathname.startsWith("/models/")) {
      return "Model Details";
    }
    
    return currentRoute?.name || "Page";
  };

  return (
    <div className="flex h-full min-h-screen bg-background">
      <Sidebar
        defaultCollapsed={isMobile}
        aria-label="Sidebar"
        className="border-r bg-card"
        isOpen={sidebarOpen}
        onOpenChange={setSidebarOpen}
      >
        <Sidebar.Header className="flex items-center py-4 px-6">
          <Link to="/dashboard">
            <div className="flex items-center">
              <div className="relative size-10 flex items-center justify-center rounded-full bg-primary/10">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div className="ml-3">
                <h1 className="text-lg font-semibold">AI Trading</h1>
                <p className="text-xs text-muted-foreground">
                  Algorithmic Platform
                </p>
              </div>
            </div>
          </Link>
        </Sidebar.Header>
        <Sidebar.Main className="py-2">
          {navigation.map((item) => (
            <Sidebar.NavLink
              key={item.name}
              as={Link}
              to={item.href}
              active={
                item.href === "/dashboard"
                  ? location.pathname === item.href
                  : location.pathname.startsWith(item.href)
              }
              className="group px-3 mb-1 mx-1.5"
            >
              <item.icon className="h-4 w-4 mr-4 group-hover:text-primary" />
              {item.name}
            </Sidebar.NavLink>
          ))}
        </Sidebar.Main>
        <Sidebar.Footer>
          <Sidebar.NavLink
            as={Link}
            to="/settings"
            icon={Settings}
            className="group px-3 mb-1 mx-1.5"
          >
            <Settings className="h-4 w-4 mr-4 group-hover:text-primary" />
            Settings
          </Sidebar.NavLink>
        </Sidebar.Footer>
      </Sidebar>
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <Header 
          sidebarOpen={sidebarOpen} 
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)} 
        />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
