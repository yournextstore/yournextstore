"use client";

import { type ReactNode, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type ProductTab = { id: string; label: string; content: ReactNode };

/**
 * The original's full-width tab row ("Product Details · Rating & Reviews · FAQs"). Every panel is
 * server-rendered and only hidden, so its text stays in the HTML for search engines.
 */
export function ProductTabs({ tabs }: { tabs: ProductTab[] }) {
	const [active, setActive] = useState(tabs[0]?.id ?? "");
	const baseId = useId();
	const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

	if (tabs.length === 0) return null;

	const focusTab = (index: number) => {
		const next = tabs[(index + tabs.length) % tabs.length];
		if (!next) return;
		setActive(next.id);
		tabRefs.current[(index + tabs.length) % tabs.length]?.focus();
	};

	return (
		<div>
			<div
				role="tablist"
				aria-label="Product information"
				className="no-scrollbar mb-6 flex overflow-x-auto sm:mb-8"
			>
				{tabs.map((tab, index) => {
					const selected = tab.id === active;
					return (
						<button
							key={tab.id}
							ref={(node) => {
								tabRefs.current[index] = node;
							}}
							type="button"
							role="tab"
							id={`${baseId}-tab-${tab.id}`}
							aria-selected={selected}
							aria-controls={`${baseId}-panel-${tab.id}`}
							tabIndex={selected ? 0 : -1}
							onClick={() => setActive(tab.id)}
							onKeyDown={(e) => {
								if (e.key === "ArrowRight") focusTab(index + 1);
								if (e.key === "ArrowLeft") focusTab(index - 1);
							}}
							className={cn(
								"flex-1 p-5 text-sm whitespace-nowrap transition-colors sm:p-6 sm:text-base",
								selected
									? "border-b-2 border-black font-medium text-black"
									: "border-b border-black/10 text-muted-foreground hover:text-black",
							)}
						>
							{tab.label}
						</button>
					);
				})}
			</div>
			{tabs.map((tab) => (
				<div
					key={tab.id}
					role="tabpanel"
					id={`${baseId}-panel-${tab.id}`}
					aria-labelledby={`${baseId}-tab-${tab.id}`}
					hidden={tab.id !== active}
					className="mb-12 sm:mb-16"
				>
					{tab.content}
				</div>
			))}
		</div>
	);
}
