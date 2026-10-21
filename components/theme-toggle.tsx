"use client";

import { useTheme } from "next-themes";

/** The original's single sun/moon button: light (bone) is the default, one press flips to graphite. */
export function ThemeToggle() {
	const { resolvedTheme, setTheme } = useTheme();

	return (
		<button
			type="button"
			className="hs-icon-btn"
			aria-label="Toggle dark mode"
			title="Toggle light / dark"
			onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
		>
			{/* CSS-driven swap keeps server and client markup identical (no hydration flash). */}
			<svg
				viewBox="0 0 24 24"
				className="hidden size-[17px] dark:block"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.7"
				aria-hidden="true"
			>
				<circle cx="12" cy="12" r="4.5" />
				<path
					strokeLinecap="round"
					d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1"
				/>
			</svg>
			<svg
				viewBox="0 0 24 24"
				className="size-[17px] dark:hidden"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.7"
				aria-hidden="true"
			>
				<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" />
			</svg>
		</button>
	);
}
