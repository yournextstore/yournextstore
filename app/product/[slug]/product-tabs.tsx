"use client";

import { type ReactNode, useId, useState } from "react";
import { cn } from "@/lib/utils";

/** The pill tab bar under the product (About / Reviews); one tab renders as a plain section. */
export function ProductTabs({ tabs }: { tabs: { id: string; label: string; content: ReactNode }[] }) {
	const [active, setActive] = useState(tabs[0]?.id);
	const baseId = useId();

	return (
		<div>
			<div
				role="tablist"
				aria-label="Product information"
				className="mx-auto flex max-w-[56rem] rounded-full bg-tile p-0.5"
			>
				{tabs.map((tab) => (
					<button
						key={tab.id}
						type="button"
						role="tab"
						id={`${baseId}-tab-${tab.id}`}
						aria-selected={active === tab.id}
						aria-controls={`${baseId}-panel-${tab.id}`}
						onClick={() => setActive(tab.id)}
						className={cn(
							"h-14 flex-1 rounded-full text-sm/6 uppercase transition-colors",
							active === tab.id
								? "bg-primary text-primary-foreground"
								: "text-foreground hover:bg-background",
						)}
					>
						{tab.label}
					</button>
				))}
			</div>
			{tabs.map((tab) => (
				<div
					key={tab.id}
					role="tabpanel"
					id={`${baseId}-panel-${tab.id}`}
					aria-labelledby={`${baseId}-tab-${tab.id}`}
					hidden={active !== tab.id}
					className="mt-12 lg:mt-16"
				>
					{tab.content}
				</div>
			))}
		</div>
	);
}
