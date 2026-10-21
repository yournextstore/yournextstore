"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

/** One click flips light/dark, as in the original; icons swap in CSS so server and client markup match. */
export function ThemeButton({ className, withLabel = false }: { className?: string; withLabel?: boolean }) {
	const { resolvedTheme, setTheme } = useTheme();

	return (
		<button
			type="button"
			onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
			className={className}
			aria-label={withLabel ? undefined : "Toggle theme"}
		>
			<MoonIcon
				aria-hidden
				className={cn("dark:hidden", withLabel ? "size-[15px]" : "size-[19px]")}
				strokeWidth={1.8}
			/>
			<SunIcon
				aria-hidden
				className={cn("hidden dark:block", withLabel ? "size-[15px]" : "size-[19px]")}
				strokeWidth={1.8}
			/>
			{withLabel ? "Theme" : null}
		</button>
	);
}
