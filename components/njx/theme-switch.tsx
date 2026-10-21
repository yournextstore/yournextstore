"use client";

import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "@/components/njx/icons";
import { cn } from "@/lib/utils";

/** One-click light/dark switch, as in the original header and menu drawer. */
export function ThemeSwitch({ className, size = 19 }: { className?: string; size?: number }) {
	const { resolvedTheme, setTheme } = useTheme();

	return (
		<button
			type="button"
			onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
			className={cn("rounded-md p-2.5 text-muted-foreground hover:bg-tile hover:text-ink", className)}
			aria-label="Toggle theme"
		>
			{/* CSS-driven swap keeps server and client markup identical. */}
			<MoonIcon size={size} className="dark:hidden" />
			<SunIcon size={size} className="hidden dark:block" />
		</button>
	);
}
