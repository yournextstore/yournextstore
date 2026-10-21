"use client";

import { Children, type ReactNode, useState } from "react";
import { chipClass, chipRowClass, sortSelectClass, toolbarClass } from "@/components/njx/catalog-styles";

export type CatalogItem = { id: string; name: string; price: number; tag: string | null };

const SORTS = [
	{ value: "featured", label: "Featured" },
	{ value: "price-asc", label: "Price: low to high" },
	{ value: "price-desc", label: "Price: high to low" },
	{ value: "title", label: "Name A–Z" },
] as const;

type Sort = (typeof SORTS)[number]["value"];

/**
 * The original's collection catalogue: tag chips and a sort select over a static grid,
 * filtered and reordered in the browser without a request. Cards render on the server
 * and arrive as children in `items` order.
 */
export function CatalogGrid({
	items,
	children,
	emptyText = "No products match this filter.",
}: {
	items: CatalogItem[];
	children: ReactNode;
	emptyText?: string;
}) {
	const [tag, setTag] = useState("");
	const [sort, setSort] = useState<Sort>("featured");
	const cards = Children.toArray(children);
	const tags = [...new Set(items.flatMap((item) => (item.tag ? [item.tag] : [])))].sort((a, b) =>
		a.localeCompare(b),
	);

	const order = items
		.map((item, index) => ({ item, index }))
		.sort((a, b) => {
			if (sort === "price-asc") return a.item.price - b.item.price;
			if (sort === "price-desc") return b.item.price - a.item.price;
			if (sort === "title") return a.item.name.localeCompare(b.item.name);
			return a.index - b.index;
		});
	const visible = order.filter(({ item }) => !tag || item.tag === tag);

	return (
		<div>
			<div className={toolbarClass}>
				{tags.length > 1 ? (
					<fieldset className={chipRowClass}>
						<legend className="sr-only">Filter by category</legend>
						<button type="button" aria-pressed={tag === ""} onClick={() => setTag("")} className={chipClass}>
							All
						</button>
						{tags.map((t) => (
							<button
								key={t}
								type="button"
								aria-pressed={tag === t}
								onClick={() => setTag(t)}
								className={chipClass}
							>
								{t}
							</button>
						))}
					</fieldset>
				) : (
					<p className="text-[13px] text-muted-foreground">
						{items.length} {items.length === 1 ? "product" : "products"}
					</p>
				)}
				<label className="flex items-center gap-2 text-[13px] text-muted-foreground">
					Sort
					<select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className={sortSelectClass}>
						{SORTS.map((option) => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
					</select>
				</label>
			</div>

			<div className="grid grid-cols-2 gap-x-3 gap-y-5 sm:gap-x-5 md:grid-cols-4">
				{visible.map(({ item, index }) => (
					<div key={item.id} className="min-w-0">
						{cards[index]}
					</div>
				))}
			</div>
			{visible.length === 0 ? (
				<p className="py-10 text-center text-muted-foreground sm:py-16">{emptyText}</p>
			) : null}
		</div>
	);
}
