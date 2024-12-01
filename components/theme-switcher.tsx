'use client'

import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const ICON_SIZE = 16; // Adjust icon size as needed

  return (
    <div className="flex items-center">
      <Button
        variant="ghost"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        aria-label="Toggle theme"
      >
        {theme === "light" ? (
          <Moon size={ICON_SIZE} className="text-muted-foreground" />
        ) : (
          <Sun size={ICON_SIZE} className="text-muted-foreground" />
        )}
      </Button>
    </div>
  );
};

export { ThemeSwitcher };
