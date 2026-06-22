"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
	const { resolvedTheme, setTheme } = useTheme();

	return (
		<button
			type="button"
			onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
			className="w-10 h-10 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full flex items-center justify-center shadow-glow transition-transform hover:scale-105"
			aria-label="Change theme"
		>
			{/* CSS-driven swap keeps server and client markup identical (no hydration flash). */}
			<Sun className="w-5 h-5 dark:hidden" />
			<Moon className="w-5 h-5 hidden dark:block" />
		</button>
	);
}
