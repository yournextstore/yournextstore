"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";

/**
 * The original's pill switch: a knob that slides between light and dark. The knob position and
 * icon come from the `.dark` class (CSS), so server and client markup match before hydration.
 */
export function ThemeToggle() {
	const { resolvedTheme, setTheme } = useTheme();

	return (
		<button
			type="button"
			onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
			aria-label="Toggle dark mode"
			className="relative inline-flex h-6 shrink-0 items-center"
		>
			<span aria-hidden className="block h-4 w-9 rounded-full bg-border lg:w-11" />
			<span className="absolute top-0.5 left-0 flex size-5 items-center justify-center rounded-full bg-ink text-background shadow transition-transform dark:translate-x-4 lg:dark:translate-x-6">
				<SunIcon aria-hidden className="size-3 dark:hidden" strokeWidth={2.5} />
				<MoonIcon aria-hidden className="hidden size-3 dark:block" strokeWidth={2.5} />
			</span>
		</button>
	);
}
