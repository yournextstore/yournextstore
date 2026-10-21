"use client";

import { Contrast } from "lucide-react";
import { useTheme } from "next-themes";

/** The original's one-tap switch between the paper and the ink themes. */
export function ThemeToggle() {
	const { resolvedTheme, setTheme } = useTheme();

	return (
		<button
			type="button"
			aria-label="Theme"
			onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
			className="grid size-11 place-items-center rounded-full transition-colors hover:bg-secondary"
		>
			<Contrast aria-hidden="true" className="size-5" strokeWidth={2} />
		</button>
	);
}
