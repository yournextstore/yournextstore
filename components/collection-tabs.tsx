"use client";

import { type ReactNode, useState } from "react";
import { LISTING_GRID } from "@/components/product-grid-skeleton";
import { cn } from "@/lib/utils";

export type TabItem = { key: string; tabs: string[]; node: ReactNode };

/**
 * The original's in-page filter: uppercase tabs over the grid, the active one underlined in coral.
 * The cards are rendered on the server; switching a tab only changes which of them show.
 */
export function CollectionTabs({
	tabs,
	items,
	limit,
}: {
	tabs: { id: string; label: string }[];
	items: TabItem[];
	limit: number;
}) {
	const [active, setActive] = useState(tabs[0]?.id ?? "all");
	const visible = items.filter((item) => item.tabs.includes(active)).slice(0, limit);

	return (
		<>
			<div className="mb-8 mt-12 flex flex-wrap gap-x-6 gap-y-3 border-b border-line pb-4">
				{tabs.map((tab) => (
					<button
						key={tab.id}
						type="button"
						aria-pressed={tab.id === active}
						onClick={() => setActive(tab.id)}
						className={cn(
							"caps -mb-px border-b-2 pb-1 text-[0.73rem] transition-colors",
							tab.id === active
								? "border-coral text-ink"
								: "border-transparent text-muted-foreground hover:text-ink",
						)}
					>
						{tab.label}
					</button>
				))}
			</div>
			<div className={LISTING_GRID}>
				{visible.map((item) => (
					<div key={item.key}>{item.node}</div>
				))}
			</div>
			{visible.length === 0 && (
				<p className="mt-4 text-[0.9rem] text-muted-foreground">Nothing here just yet.</p>
			)}
		</>
	);
}
