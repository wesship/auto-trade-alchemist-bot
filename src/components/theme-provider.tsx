
"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

export function useTheme() {
  const [mounted, setMounted] = React.useState(false)
  const { theme, setTheme } = React.useContext(
    // @ts-ignore - next-themes context exists at runtime
    React.createContext({ theme: "dark", setTheme: (theme: string) => {} })
  )

  // We need to use useEffect to ensure the component is mounted
  // before we try to access the theme
  React.useEffect(() => {
    setMounted(true)
    
    // Apply dark class to html element when using dark theme
    const htmlElement = document.documentElement;
    if (theme === 'dark') {
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
    }
  }, [theme]);

  return { 
    theme: mounted ? theme : "dark", 
    setTheme 
  }
}
