"use client";

import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

/** The original's sun/moon square: one press flips kraft ↔ ink-blue. Icons swap in CSS, so no hydration flash. */
export function ThemeButton({ className }: { className?: string }) {
	const { resolvedTheme, setTheme } = useTheme();

	return (
		<button
			type="button"
			className={cn("icon-btn", className)}
			aria-label="Toggle dark mode"
			title="Toggle light / dark"
			onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
		>
			<svg
				viewBox="0 0 24 24"
				aria-hidden="true"
				className="hidden size-[17px] dark:block"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.7"
			>
				<circle cx="12" cy="12" r="4.5" />
				<path
					strokeLinecap="round"
					d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1"
				/>
			</svg>
			<svg
				viewBox="0 0 24 24"
				aria-hidden="true"
				className="size-[17px] dark:hidden"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.7"
			>
				<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" />
			</svg>
		</button>
	);
}
