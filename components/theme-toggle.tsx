"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

/** One tap between light and dark, as on the original. */
export function ThemeToggle({ className }: { className?: string }) {
	const { resolvedTheme, setTheme } = useTheme();

	return (
		<button
			type="button"
			onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
			aria-label="Toggle dark mode"
			className={cn(
				"flex h-9 w-9 items-center justify-center text-foreground transition-colors hover:text-muted-foreground",
				className,
			)}
		>
			{/* CSS-driven swap keeps server and client markup identical (no hydration flash). */}
			<Moon className="h-[18px] w-[18px] dark:hidden" strokeWidth={1.5} aria-hidden="true" />
			<Sun className="hidden h-[18px] w-[18px] dark:block" strokeWidth={1.5} aria-hidden="true" />
		</button>
	);
}
