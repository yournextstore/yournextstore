"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

/** Sun/moon switch between the rack at night (dark) and panel silver on the bench (light). */
export function ThemeToggle() {
	const { resolvedTheme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);
	useEffect(() => setMounted(true), []);
	const dark = mounted ? resolvedTheme !== "light" : true;

	return (
		<button
			type="button"
			onClick={() => setTheme(dark ? "light" : "dark")}
			aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
			className="inline-grid h-[34px] w-[34px] shrink-0 cursor-pointer place-items-center rounded-[9px] border border-line text-dim transition-[color,border-color,transform] duration-200 ease-[cubic-bezier(.34,1.56,.42,1)] hover:border-signal hover:text-ink active:scale-90"
		>
			{dark ? (
				<svg
					viewBox="0 0 24 24"
					width="17"
					height="17"
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
			) : (
				<svg
					viewBox="0 0 24 24"
					width="17"
					height="17"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.7"
					aria-hidden="true"
				>
					<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" />
				</svg>
			)}
		</button>
	);
}
