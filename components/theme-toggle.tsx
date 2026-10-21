"use client";

import { useTheme } from "next-themes";

/** The original's footer theme switch: a pill with a swatch that flips paper and ink. */
export function ThemeToggle() {
	const { resolvedTheme, setTheme } = useTheme();

	return (
		<button
			type="button"
			onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
			className="inline-flex cursor-pointer items-center rounded-full border border-border p-2 transition-colors hover:bg-muted"
		>
			<span aria-hidden className="size-5 rounded-full border border-border bg-background" />
			{/* CSS-driven label keeps server and client markup identical (no hydration flash). */}
			<span className="mx-2 text-nav font-semibold dark:hidden">Light Mode</span>
			<span className="mx-2 hidden text-nav font-semibold dark:inline">Dark Mode</span>
		</button>
	);
}
