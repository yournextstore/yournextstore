"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
	const { resolvedTheme, setTheme } = useTheme();

	return (
		<button
			type="button"
			onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
			aria-label="Toggle dark mode"
			className="inline-flex size-10 items-center justify-center rounded-lg text-foreground/80 transition-colors hover:bg-secondary"
		>
			{/* CSS-driven swap keeps server and client markup identical (no hydration flash). */}
			<Moon className="size-5 dark:hidden" strokeWidth={1.75} aria-hidden />
			<Sun className="hidden size-5 dark:block" strokeWidth={1.75} aria-hidden />
		</button>
	);
}
