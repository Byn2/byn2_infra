"use client"

import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex items-center space-x-2 rounded-md bg-gray-100 p-1 dark:bg-gray-800">
      <Button
        variant={theme === "light" ? "default" : "ghost"}
        size="sm"
        className={`${theme === "light" ? "bg-white text-gray-800" : "text-gray-400"} rounded-md px-3 text-xs`}
        onClick={() => setTheme("light")}
      >
        Light
      </Button>
      <Button
        variant={theme === "dark" ? "default" : "ghost"}
        size="sm"
        className={`${theme === "dark" ? "bg-gray-700 text-white" : "text-gray-400"} rounded-md px-3 text-xs`}
        onClick={() => setTheme("dark")}
      >
        Dark
      </Button>
    </div>
  )
}
