"use client";

import { useTheme } from "next-themes";
import { flushSync } from "react-dom";

/**
 * One control, in the navigation only: flips between the cool light ground and the night
 * ground. The switch is instant; transitions are off while the colours swap.
 */
export function ThemeToggle() {
	const { resolvedTheme, setTheme } = useTheme();

	return (
		<button
			type="button"
			aria-label="Switch light or dark theme"
			onClick={() => {
				document.documentElement.classList.add("theme-switching");
				flushSync(() => setTheme(resolvedTheme === "dark" ? "light" : "dark"));
				requestAnimationFrame(() => document.documentElement.classList.remove("theme-switching"));
			}}
			className="press grid size-11 place-items-center rounded-full text-foreground transition-colors hover:bg-wash"
		>
			<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
				<circle cx="12" cy="12" r="8" strokeWidth="1.8" />
				<path d="M12 4a8 8 0 0 1 0 16Z" fill="currentColor" />
			</svg>
		</button>
	);
}
