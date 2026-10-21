"use client";

import { type ReactNode, useId, useState } from "react";
import { cn } from "@/lib/utils";

/** GoCart's Description / Reviews tabs: underlined active tab on a hairline. */
export function ProductTabs({ tabs }: { tabs: { label: string; content: ReactNode }[] }) {
	const [active, setActive] = useState(0);
	const id = useId();

	return (
		<div className="text-sm text-slate-600">
			<div
				role="tablist"
				aria-label="Product information"
				className="mb-6 flex max-w-2xl border-b border-slate-200"
			>
				{tabs.map((tab, index) => (
					<button
						key={tab.label}
						type="button"
						role="tab"
						id={`${id}-tab-${index}`}
						aria-selected={index === active}
						aria-controls={`${id}-panel-${index}`}
						onClick={() => setActive(index)}
						className={cn(
							"-mb-px px-3 py-2 font-medium transition",
							index === active
								? "border-b-[1.5px] border-slate-800 font-semibold text-slate-800"
								: "text-slate-500",
						)}
					>
						{tab.label}
					</button>
				))}
			</div>
			{tabs.map((tab, index) => (
				<div
					key={tab.label}
					role="tabpanel"
					id={`${id}-panel-${index}`}
					aria-labelledby={`${id}-tab-${index}`}
					hidden={index !== active}
				>
					{tab.content}
				</div>
			))}
		</div>
	);
}
