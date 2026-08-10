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
						<div key={`sk-${i}`} className="flex items-center gap-4 border-b border-border py-3">
							<span className="h-10 w-10 flex-none animate-pulse bg-secondary motion-reduce:animate-none" />
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
						className={`flex items-center gap-4 border-b border-border py-3 text-left transition-opacity ${
							isActive ? "opacity-100" : "opacity-80 hover:opacity-100"
						}`}
					>
						<span className="relative h-10 w-10 flex-none overflow-hidden bg-secondary">
							{item.image ? (
								<YNSMedia src={item.image} alt={item.name} fill sizes="40px" className="object-cover" />
							) : null}
						</span>
						<span className="flex min-w-0 flex-1 flex-col">
							<HighlightedText
								text={item.name}
								query={trimmed}
								className="truncate text-base font-medium text-foreground"
							/>
							{item.summary ? (
								<span className="truncate text-xs text-muted-foreground">{item.summary}</span>
							) : null}
						</span>
						<span
							aria-hidden
							className={`text-foreground transition-opacity ${isActive ? "opacity-100" : "opacity-0"}`}
						>
							→
						</span>
					</button>
				);
			})}

			{showEmpty ? (
				<div className="flex flex-col gap-2 border-b border-border py-6">
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
					className={`flex items-center justify-between py-3 text-left transition-opacity ${
						highlight === seeAllIndex ? "opacity-100" : "opacity-80 hover:opacity-100"
					}`}
				>
					<span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
						See all results for{" "}
						<span className="font-medium normal-case tracking-normal text-foreground">{trimmed}</span>
					</span>
					<span aria-hidden className="text-foreground">
						→
					</span>
				</button>
			) : null}
		</div>
	);
}
