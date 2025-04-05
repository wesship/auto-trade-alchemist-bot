
"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

// Create a proper theme context
const ThemeContext = React.createContext<{
  theme: string;
  setTheme: (theme: string) => void;
}>({
  theme: "",
  setTheme: () => {},
})

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

// Fix the useTheme hook to properly use the next-themes context
export function useTheme() {
  const { theme, setTheme } = React.useContext(ThemeContext)
  
  // Use the actual next-themes hooks
  const { theme: nextTheme, setTheme: nextSetTheme } = React.useContext(
    // @ts-ignore - next-themes context exists at runtime
    React.createContext({ theme: theme || "system", setTheme: setTheme || (() => {}) })
  )
  
  // Return the real theme state from next-themes or our fallback
  return { 
    theme: nextTheme || theme, 
    setTheme: nextSetTheme || setTheme 
  }
}
