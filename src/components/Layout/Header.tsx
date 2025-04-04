
import { Bell, Menu, Moon, Settings, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

const Header = () => {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const isMobile = useIsMobile();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
    // In a real app, we'd actually change the theme here
  };

  return (
    <header className="border-b sticky top-0 z-40 bg-background">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2 md:gap-4">
          {isMobile && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[250px]">
                <nav className="flex flex-col gap-4 mt-8">
                  <NavLink
                    to="/"
                    className={({ isActive }) => 
                      `px-3 py-2 rounded-md text-sm font-medium ${
                        isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                      }`
                    }
                  >
                    Dashboard
                  </NavLink>
                  <NavLink
                    to="/models"
                    className={({ isActive }) => 
                      `px-3 py-2 rounded-md text-sm font-medium ${
                        isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                      }`
                    }
                  >
                    Models
                  </NavLink>
                  <NavLink
                    to="#"
                    className="px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-muted"
                    onClick={(e) => e.preventDefault()}
                  >
                    Backtesting
                  </NavLink>
                  <NavLink
                    to="#"
                    className="px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-muted"
                    onClick={(e) => e.preventDefault()}
                  >
                    Portfolio
                  </NavLink>
                </nav>
              </SheetContent>
            </Sheet>
          )}

          <NavLink to="/" className="flex items-center gap-2">
            <div className="font-bold text-primary text-lg">
              <span className="inline-block">
                <span className="text-foreground">AutoTrade</span>
                <span className="text-primary">Alchemist</span>
              </span>
            </div>
          </NavLink>

          {!isMobile && (
            <nav className="hidden md:flex items-center gap-1 md:gap-2">
              <NavLink
                to="/"
                className={({ isActive }) => 
                  `px-3 py-2 rounded-md text-sm font-medium ${
                    isActive ? "bg-muted/80" : "hover:bg-muted/50"
                  }`
                }
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/models"
                className={({ isActive }) => 
                  `px-3 py-2 rounded-md text-sm font-medium ${
                    isActive ? "bg-muted/80" : "hover:bg-muted/50"
                  }`
                }
              >
                Models
              </NavLink>
              <NavLink
                to="#"
                className="px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-muted/50"
                onClick={(e) => e.preventDefault()}
              >
                Backtesting
              </NavLink>
              <NavLink
                to="#"
                className="px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-muted/50"
                onClick={(e) => e.preventDefault()}
              >
                Portfolio
              </NavLink>
            </nav>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
          
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" alt="User" />
                  <AvatarFallback className="bg-primary/10 text-primary">TA</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
