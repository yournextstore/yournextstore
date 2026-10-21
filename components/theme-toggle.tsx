"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

/** The original's one-click light/dark switch: an outline icon button. */
export function ThemeToggle() {
	const { resolvedTheme, setTheme } = useTheme();

	return (
		<Button
			variant="outline"
			size="icon"
			aria-label="Toggle dark mode"
			onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
		>
			{/* CSS-driven swap keeps server and client markup identical (no hydration flash). */}
			<MoonIcon className="h-4 dark:hidden" aria-hidden />
			<SunIcon className="hidden h-4 dark:block" aria-hidden />
		</Button>
	);
}
