
import React, { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider
} from "@/components/ui/sidebar";
import Header from "./Header";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  BarChart3,
  Brain,
  FileText,
  Settings,
  TrendingUp,
  Flag,
  ChartBar,
  FileExport,
  BookmarkCheck,
  ListTodo,
  Code,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
  { name: "Models", href: "/models", icon: Brain },
  { name: "Forecast", href: "/forecast", icon: TrendingUp },
  { name: "AI Comparison", href: "/ai-model-comparison", icon: ChartBar },
  { name: "Strategy Library", href: "/strategy-library", icon: BookmarkCheck },
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
    <SidebarProvider defaultOpen={!isMobile} open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <div className="flex h-full min-h-screen w-full bg-background">
        <Sidebar aria-label="Sidebar" className="border-r bg-card">
          <SidebarHeader className="flex items-center py-4 px-6">
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
          </SidebarHeader>
          <SidebarContent className="py-2">
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={
                      item.href === "/dashboard"
                        ? location.pathname === item.href
                        : location.pathname.startsWith(item.href)
                    }
                    tooltip={item.name}
                    className="group px-3 mb-1 mx-1.5"
                  >
                    <Link to={item.href}>
                      <item.icon className="h-4 w-4 mr-4 group-hover:text-primary" />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Settings" className="group px-3 mb-1 mx-1.5">
                  <Link to="/settings">
                    <Settings className="h-4 w-4 mr-4 group-hover:text-primary" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
          <Header />
          <main className="flex-1 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
