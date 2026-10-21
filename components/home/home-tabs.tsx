"use client";

import { type ReactNode, useId, useState } from "react";
import { cn } from "@/lib/utils";

/** The original's segmented "For Buyers / For Sellers" switch, recast as two shop views. */
export function HomeTabs({
	tabs,
	label = "Shop views",
	align = "center",
}: {
	tabs: { label: string; content: ReactNode }[];
	label?: string;
	align?: "center" | "start";
}) {
	const [active, setActive] = useState(0);
	const id = useId();

	return (
		<div>
			<div className={align === "center" ? "mt-2 mb-8 flex items-center justify-center" : "overflow-auto"}>
				<div
					role="tablist"
					aria-label={label}
					className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground"
				>
					{tabs.map((tab, i) => (
						<button
							key={tab.label}
							type="button"
							role="tab"
							id={`${id}-tab-${i}`}
							aria-selected={active === i}
							aria-controls={`${id}-panel-${i}`}
							tabIndex={active === i ? 0 : -1}
							onClick={() => setActive(i)}
							onKeyDown={(e) => {
								if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
									const next = (i + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length;
									setActive(next);
									document.getElementById(`${id}-tab-${next}`)?.focus();
								}
							}}
							className={cn(
								"inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
								active === i && "bg-background text-foreground shadow-sm",
							)}
						>
							{tab.label}
						</button>
					))}
				</div>
			</div>
			{tabs.map((tab, i) => (
				<div
					key={tab.label}
					role="tabpanel"
					id={`${id}-panel-${i}`}
					aria-labelledby={`${id}-tab-${i}`}
					hidden={active !== i}
					className={align === "start" ? "pt-4" : undefined}
				>
					{tab.content}
				</div>
			))}
		</div>
	);
}
