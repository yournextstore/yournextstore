"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ThemeToggle() {
	const { setTheme } = useTheme();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				render={
					<button
						type="button"
						className="p-2 hover:text-accent transition-colors"
						aria-label="Change theme"
					/>
				}
			>
				{/* CSS-driven swap keeps server and client markup identical (no hydration flash). */}
				<Sun className="w-[18px] h-[18px] dark:hidden" strokeWidth={1.25} />
				<Moon className="hidden w-[18px] h-[18px] dark:block" strokeWidth={1.25} />
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
