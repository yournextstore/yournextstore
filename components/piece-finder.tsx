"use client";

import Link from "next/link";
import { useState } from "react";

type Choice = { id: string; label: string };
type Band = Choice & { priceMin?: string; priceMax?: string };

/**
 * The original's booking card (guests · day · seating chips), retold as a catalogue finder: pick a
 * shelf and a budget, and the button opens that page of the ledger.
 */
export function PieceFinder({ shelves, bands }: { shelves: Choice[]; bands: Band[] }) {
	const anyShelf = { id: "", label: "Any shelf" };
	const anyBudget: Band = { id: "", label: "Any budget" };
	const [shelf, setShelf] = useState<Choice>(anyShelf);
	const [band, setBand] = useState<Band>(anyBudget);

	const params = new URLSearchParams();
	if (shelf.id) params.set("category", shelf.id);
	if (band.priceMin) params.set("priceMin", band.priceMin);
	if (band.priceMax) params.set("priceMax", band.priceMax);
	const href = params.size > 0 ? `/products?${params.toString()}` : "/products";

	const rows: {
		key: string;
		label: string;
		options: Choice[];
		current: string;
		pick: (c: Choice) => void;
	}[] = [
		{ key: "shelf", label: "Shelf", options: [anyShelf, ...shelves], current: shelf.id, pick: setShelf },
		{
			key: "budget",
			label: "Budget",
			options: [anyBudget, ...bands],
			current: band.id,
			pick: (choice) => setBand(bands.find((b) => b.id === choice.id) ?? anyBudget),
		},
	];

	return (
		<div className="reveal mx-auto max-w-[720px] rounded-[4px] border border-line bg-panel p-[clamp(24px,3.6vw,40px)]">
			{rows.map((row) => (
				<div
					key={row.key}
					className="grid gap-2.5 border-b border-line-2 py-4 sm:grid-cols-[120px_1fr] sm:items-center"
				>
					<p id={`finder-${row.key}`} className="ledger text-[0.64rem] tracking-[0.2em] text-faint">
						{row.label}
					</p>
					<ul aria-labelledby={`finder-${row.key}`} className="flex flex-wrap gap-2.5">
						{row.options.map((option) => (
							<li key={option.id || "any"}>
								<button
									type="button"
									className="chip"
									aria-pressed={row.current === option.id}
									onClick={() => row.pick(option)}
								>
									{option.label}
								</button>
							</li>
						))}
					</ul>
				</div>
			))}
			<div className="flex flex-wrap items-center justify-between gap-4 pt-[22px]">
				<p className="serif text-[1.25rem] text-cream italic" aria-live="polite">
					{shelf.label} · {band.label.toLowerCase()}
				</p>
				<Link href={href} className="btn btn-primary">
					Open the ledger
				</Link>
			</div>
		</div>
	);
}
