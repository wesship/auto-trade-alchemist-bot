
import * as React from "react";
import { useSidebar } from "./context";
import { SidebarBase, SidebarBaseProps } from "./sidebar-base";
import { SidebarMobile } from "./sidebar-mobile";

export const Sidebar = React.forwardRef<
  HTMLDivElement,
  SidebarBaseProps
>(
  (
    {
      side = "left",
      variant = "sidebar",
      collapsible = "offcanvas",
      className,
      children,
      ...props
    },
    ref
  ) => {
    const { isMobile } = useSidebar();

    if (isMobile) {
      return (
        <SidebarMobile side={side} {...props}>
          {children}
        </SidebarMobile>
      );
    }

    return (
      <SidebarBase
        ref={ref}
        side={side}
        variant={variant}
        collapsible={collapsible}
        className={className}
        {...props}
      >
        {children}
      </SidebarBase>
    );
  }
);
Sidebar.displayName = "Sidebar";
