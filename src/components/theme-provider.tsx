
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

  React.useEffect(() => {
    setMounted(true)
  }, [])

  return { 
    theme: mounted ? theme : "dark", 
    setTheme 
  }
}
