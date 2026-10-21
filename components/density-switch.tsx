"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Grid density (3 / 4 columns): one ink capsule slides between the two pills. The choice
 * lives on <html> so the grid, a server component, follows it with CSS.
 */
export function DensitySwitch() {
	const [density, setDensity] = useState<3 | 4>(4);
	const choose = (value: 3 | 4) => {
		setDensity(value);
		document.documentElement.dataset.density = String(value);
	};

	return (
		<div className="relative hidden h-10 grid-cols-2 rounded-full border border-line p-[3px] lg:grid">
			<span
				aria-hidden="true"
				className={cn(
					"absolute inset-y-[3px] left-[3px] w-[calc(50%-3px)] rounded-full bg-foreground transition-transform duration-[220ms] ease-in-out motion-reduce:transition-none",
					density === 4 && "translate-x-full",
				)}
			/>
			{([3, 4] as const).map((value) => (
				<button
					key={value}
					type="button"
					aria-pressed={density === value}
					aria-label={`${value} columns`}
					onClick={() => choose(value)}
					className={cn(
						"relative z-10 w-10 rounded-full text-[13px] font-semibold transition-colors duration-[220ms]",
						density === value ? "text-background" : "text-foreground",
					)}
				>
					{value}
				</button>
			))}
		</div>
	);
}
