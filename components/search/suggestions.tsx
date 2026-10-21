"use client";

import { HighlightedText } from "@/components/search/highlighted-text";
import type { Controller } from "@/components/search/use-search-controller";
import { YNSMedia } from "@/lib/yns-media";

export function Suggestions({
	listboxId,
	open,
	c,
	onPick,
	onSeeAll,
}: {
	listboxId: string;
	open: boolean;
	c: Controller;
	onPick: (slug: string) => void;
	onSeeAll: () => void;
}) {
	const { suggestions, hasFetched, hasResults, highlight, setHighlight, isFetching, trimmed, seeAllIndex } =
		c;
	const showSkeleton = open && !hasFetched && isFetching;
	const showEmpty = open && hasFetched && !isFetching && !hasResults;

	return (
		<div
			id={listboxId}
			role="listbox"
			aria-label="Search suggestions"
			className="flex max-h-96 flex-col overflow-y-auto"
		>
			{showSkeleton
				? [0, 1, 2].map((i) => (
						<div key={`sk-${i}`} className="flex items-center gap-3 px-3 py-2">
							<span className="h-10 w-10 flex-none animate-pulse rounded bg-secondary motion-reduce:animate-none" />
							<span className="flex flex-1 flex-col gap-2">
								<span className="block h-3 w-2/3 animate-pulse bg-secondary motion-reduce:animate-none" />
								<span className="block h-2.5 w-1/2 animate-pulse bg-secondary/60 motion-reduce:animate-none" />
							</span>
						</div>
					))
				: null}

			{suggestions.map((item, idx) => {
				const isActive = idx === highlight;
				return (
					<button
						key={item.id}
						type="button"
						role="option"
						id={`${listboxId}-${item.id}`}
						aria-selected={isActive}
						onMouseEnter={() => setHighlight(idx)}
						onClick={() => onPick(item.slug)}
						className={`flex items-center gap-3 rounded-md px-3 py-2 text-left transition-colors ${
							isActive ? "bg-muted" : "hover:bg-muted"
						}`}
					>
						<span className="relative h-10 w-10 flex-none overflow-hidden rounded bg-secondary">
							{item.image ? (
								<YNSMedia src={item.image} alt={item.name} fill sizes="40px" className="object-cover" />
							) : null}
						</span>
						<span className="flex min-w-0 flex-1 flex-col">
							<HighlightedText text={item.name} query={trimmed} className="truncate text-sm text-ink" />
							{item.summary ? (
								<span className="truncate text-xs text-muted-foreground">{item.summary}</span>
							) : null}
						</span>
					</button>
				);
			})}

			{showEmpty ? (
				<div className="flex flex-col gap-1 px-3 py-6 text-center">
					<span className="text-base font-medium text-foreground">Nothing for &ldquo;{trimmed}&rdquo;</span>
					<span className="text-xs text-muted-foreground">Try a shorter or different word.</span>
				</div>
			) : null}

			{seeAllIndex >= 0 && hasResults ? (
				<button
					type="button"
					role="option"
					id={`${listboxId}-see-all`}
					aria-selected={highlight === seeAllIndex}
					onMouseEnter={() => setHighlight(seeAllIndex)}
					onClick={onSeeAll}
					className={`mt-1 border-t border-border py-3 text-center text-sm text-ink transition-colors ${
						highlight === seeAllIndex ? "bg-muted" : "hover:bg-muted"
					}`}
				>
					View all results for &ldquo;{trimmed}&rdquo;
				</button>
			) : null}
		</div>
	);
}
