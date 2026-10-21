"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

/** One-click light/dark switch, as in the original header (sun in light, moon in dark). */
export function ThemeToggle() {
	const { resolvedTheme, setTheme } = useTheme();

	return (
		<button
			type="button"
			aria-label="Toggle theme"
			onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
			className="inline-flex size-10 items-center justify-center rounded-full text-ink transition-colors hover:text-pine"
		>
			{/* CSS-driven swap keeps server and client markup identical (no hydration flash). */}
			<Sun className="size-5 dark:hidden" strokeWidth={1.75} />
			<Moon className="hidden size-5 dark:block" strokeWidth={1.75} />
		</button>
	);
}
