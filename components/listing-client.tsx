"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Density = "large" | "compact";

/**
 * The original's two-button grid switch (one big square / four small squares). The choice
 * lives on <html data-grid>, so it survives soft navigation between listings without any
 * server read; CSS in globals.css re-columns `.listing-grid`.
 */
export function GridToggle() {
	const [density, setDensity] = useState<Density>("large");

	useEffect(() => {
		setDensity(document.documentElement.dataset.grid === "compact" ? "compact" : "large");
	}, []);

	const choose = (next: Density) => {
		setDensity(next);
		document.documentElement.dataset.grid = next;
	};

	const button = (active: boolean) =>
		cn(
			"flex h-full w-12 items-center justify-center transition-colors",
			active ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground",
		);

	return (
		<fieldset className="m-0 flex h-12 overflow-hidden rounded-xs border border-input p-0">
			<legend className="sr-only">Grid layout</legend>
			<button
				type="button"
				aria-pressed={density === "large"}
				onClick={() => choose("large")}
				className={button(density === "large")}
			>
				<span className="sr-only">Large cards</span>
				<svg aria-hidden="true" viewBox="0 0 20 20" className="h-5 w-5 fill-current">
					<rect x="2" y="2" width="16" height="16" rx="1.5" />
				</svg>
			</button>
			<button
				type="button"
				aria-pressed={density === "compact"}
				onClick={() => choose("compact")}
				className={cn(button(density === "compact"), "border-l border-input")}
			>
				<span className="sr-only">Small cards</span>
				<svg aria-hidden="true" viewBox="0 0 20 20" className="h-5 w-5 fill-current">
					<rect x="2" y="2" width="7" height="7" rx="1" />
					<rect x="11" y="2" width="7" height="7" rx="1" />
					<rect x="2" y="11" width="7" height="7" rx="1" />
					<rect x="11" y="11" width="7" height="7" rx="1" />
				</svg>
			</button>
		</fieldset>
	);
}
