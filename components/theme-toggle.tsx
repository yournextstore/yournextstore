"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
	const { resolvedTheme, setTheme } = useTheme();

	return (
		<button
			type="button"
			className="chip-btn"
			aria-label="Toggle theme"
			onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
		>
			{/* CSS-driven swap keeps server and client markup identical (no hydration flash). */}
			<Moon className="size-7 text-(--icon-blue) dark:hidden" strokeWidth={1.75} aria-hidden="true" />
			<Sun className="hidden size-7 text-yellow-400 dark:block" strokeWidth={1.75} aria-hidden="true" />
		</button>
	);
}
