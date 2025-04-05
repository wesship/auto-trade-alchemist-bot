
import * as React from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useSidebar } from "./context";

export interface SidebarMobileProps extends React.ComponentProps<"div"> {
  side?: "left" | "right";
  children: React.ReactNode;
}

export const SidebarMobile = React.forwardRef<HTMLDivElement, SidebarMobileProps>(
  (
    {
      side = "left",
      children,
      ...props
    },
    ref
  ) => {
    const { openMobile, setOpenMobile } = useSidebar();

    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
        <SheetContent
          data-sidebar="sidebar"
          data-mobile="true"
          className="w-[--sidebar-width] bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden"
          style={
            {
              "--sidebar-width": "18rem",
            } as React.CSSProperties
          }
          side={side}
        >
          <div className="flex h-full w-full flex-col">{children}</div>
        </SheetContent>
      </Sheet>
    );
  }
);
SidebarMobile.displayName = "SidebarMobile";
