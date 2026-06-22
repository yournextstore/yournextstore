"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
	const [isDark, setIsDark] = useState(false);

	useEffect(() => {
		const isDarkMode = document.documentElement.classList.contains("dark");
		setIsDark(isDarkMode);
	}, []);

	const toggleTheme = () => {
		const newIsDark = !isDark;
		setIsDark(newIsDark);
		document.documentElement.classList.toggle("dark", newIsDark);
		localStorage.setItem("theme", newIsDark ? "dark" : "light");
	};

	return (
		<button
			type="button"
			onClick={toggleTheme}
			className="w-10 h-10 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full flex items-center justify-center shadow-glow transition-transform hover:scale-105"
			aria-label="Toggle theme"
		>
			{isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
		</button>
	);
}
