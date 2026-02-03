"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return null;
	}

	return (
		<button
			type="button"
			onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
			className="fixed bottom-4 right-4 z-50 bg-foreground text-background p-3 rounded-full shadow-lg hover:scale-110 transition-transform"
			aria-label="Toggle theme"
		>
			<Moon className="h-5 w-5 block dark:hidden" />
			<Sun className="h-5 w-5 hidden dark:block" />
		</button>
	);
}
