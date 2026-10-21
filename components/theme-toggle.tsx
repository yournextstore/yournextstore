"use client";

import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

/** One button between the two moods: the dark greenhouse (default) and the light sage theme. */
export function ThemeToggle({ withLabel = false, className }: { withLabel?: boolean; className?: string }) {
	const { resolvedTheme, setTheme } = useTheme();

	return (
		<button
			type="button"
			onClick={() => setTheme(resolvedTheme === "light" ? "dark" : "light")}
			aria-label={withLabel ? undefined : "Toggle theme"}
			className={cn(
				withLabel
					? "flex items-center gap-2 text-[16px] text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
					: "rounded-md p-2 transition hover:bg-current/10",
				className,
			)}
		>
			{/* CSS-driven swap keeps server and client markup identical (no hydration flash). */}
			<svg
				aria-hidden
				className="hidden dark:block"
				width={withLabel ? 15 : 17}
				height={withLabel ? 15 : 17}
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.8"
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
			</svg>
			<svg
				aria-hidden
				className="dark:hidden"
				width={withLabel ? 15 : 17}
				height={withLabel ? 15 : 17}
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.8"
				strokeLinecap="round"
			>
				<circle cx="12" cy="12" r="4.5" />
				<path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8" />
			</svg>
			{withLabel && "Theme"}
		</button>
	);
}
