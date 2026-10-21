"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

/** One-click light/dark switch, like the original's sun button. */
export function ThemeToggle({ className }: { className?: string }) {
	const { resolvedTheme, setTheme } = useTheme();

	return (
		<button
			type="button"
			onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
			className={cn(
				"inline-flex size-10 items-center justify-center rounded-md transition-colors hover:bg-accent",
				className,
			)}
			aria-label="Toggle dark mode"
		>
			{/* CSS-driven swap keeps server and client markup identical (no hydration flash). */}
			<SunIcon className="size-4 dark:hidden" />
			<MoonIcon className="hidden size-4 dark:block" />
		</button>
	);
}
