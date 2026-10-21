"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

/** The original's sun/moon pill. Active state is CSS-driven (`dark:`) so server and client markup match. */
export function ThemeToggle({ className = "" }: { className?: string }) {
	const { setTheme } = useTheme();
	const base = "flex size-7 items-center justify-center rounded-full transition-colors";

	return (
		<fieldset className={`flex items-center gap-0.5 rounded-full bg-secondary p-0.5 ${className}`}>
			<legend className="sr-only">Colour theme</legend>
			<button
				type="button"
				aria-label="Light theme"
				onClick={() => setTheme("light")}
				className={`${base} bg-[var(--footer)] text-[var(--footer-foreground)] dark:bg-transparent dark:text-muted-foreground dark:hover:text-foreground`}
			>
				<Sun className="size-4" />
			</button>
			<button
				type="button"
				aria-label="Dark theme"
				onClick={() => setTheme("dark")}
				className={`${base} text-muted-foreground hover:text-foreground dark:bg-primary dark:text-primary-foreground`}
			>
				<Moon className="size-4" />
			</button>
		</fieldset>
	);
}
