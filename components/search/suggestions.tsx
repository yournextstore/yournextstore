"use client";

import { Search } from "lucide-react";
import type { ReactNode } from "react";
import { HighlightedText } from "@/components/search/highlighted-text";
import type { Controller, SuggestionOption } from "@/components/search/use-search-controller";
import { useStoreConfig } from "@/components/store-config-provider";
import { formatMoney } from "@/lib/money";
import { listingPrice } from "@/lib/pricing";
import type { SearchSuggestion } from "@/lib/search-suggest";
import { YNSMedia } from "@/lib/yns-media";

type Kind = Exclude<SuggestionOption["kind"], "seeAll">;

/** Group titles: completions while typing, the most popular in an empty box. */
const GROUP_TITLES: Record<Kind, { typed: string; empty: string }> = {
	query: { typed: "Suggestions", empty: "Popular searches" },
	category: { typed: "Categories", empty: "Categories" },
	brand: { typed: "Brands", empty: "Brands" },
	product: { typed: "Products", empty: "Popular products" },
};
const GROUP_ORDER: Kind[] = ["query", "category", "brand", "product"];

/**
 * For the platform kit's search analytics: a product is an item, anything else a suggestion with
 * its kind and the query text or the category's or brand's id.
 */
const optionMarks = (option: SuggestionOption) => {
	switch (option.kind) {
		case "product":
			return { "data-yns-item": option.product.id, "data-yns-position": option.position };
		case "query":
			return { "data-yns-suggestion": "query", "data-yns-value": option.query };
		case "category":
			return { "data-yns-suggestion": "category", "data-yns-value": option.category.id };
		case "brand":
			return { "data-yns-suggestion": "brand", "data-yns-value": option.brand.id };
		case "seeAll":
			return {};
	}
};

function ProductPrice({ product }: { product: SearchSuggestion }) {
	const { currency, locale, taxBehavior } = useStoreConfig();
	const listing = listingPrice(product.variants, taxBehavior);
	if (!listing) return null;
	return (
		<span className="flex flex-none flex-col items-end text-sm tabular-nums">
			<span className="text-foreground">
				{listing.from ? "From " : ""}
				{formatMoney({ amount: listing.amount, currency, locale })}
			</span>
			{listing.compareAt !== null ? (
				<span className="text-xs text-muted-foreground line-through">
					{formatMoney({ amount: listing.compareAt, currency, locale })}
				</span>
			) : null}
		</span>
	);
}

function OptionContent({ option, query }: { option: SuggestionOption; query: string }) {
	switch (option.kind) {
		case "query":
			return (
				<>
					<Search className="h-4 w-4 flex-none text-muted-foreground" strokeWidth={1.75} aria-hidden />
					<HighlightedText text={option.query} query={query} className="truncate text-base text-foreground" />
				</>
			);
		case "category":
			return (
				<HighlightedText
					text={option.category.name}
					query={query}
					className="truncate text-base text-foreground"
				/>
			);
		case "brand":
			return (
				<HighlightedText
					text={option.brand.name}
					query={query}
					className="truncate text-base text-foreground"
				/>
			);
		case "product":
			return (
				<>
					<span className="relative h-10 w-10 flex-none overflow-hidden bg-secondary">
						{option.product.image ? (
							<YNSMedia
								src={option.product.image}
								alt={option.product.name}
								fill
								sizes="40px"
								className="object-cover"
							/>
						) : null}
					</span>
					<span className="flex min-w-0 flex-1 flex-col">
						<HighlightedText
							text={option.product.name}
							query={query}
							className="truncate text-base font-medium text-foreground"
						/>
						{option.product.summary ? (
							<span className="truncate text-xs text-muted-foreground">{option.product.summary}</span>
						) : null}
					</span>
					<ProductPrice product={option.product} />
				</>
			);
		case "seeAll":
			return (
				<span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
					See all results for{" "}
					<span className="font-medium normal-case tracking-normal text-foreground">{query}</span>
				</span>
			);
	}
}

export function Suggestions({
	listboxId,
	open,
	c,
	onPick,
}: {
	listboxId: string;
	open: boolean;
	c: Controller;
	onPick: (option: SuggestionOption) => void;
}) {
	const { options, hasFetched, hasResults, highlight, setHighlight, isFetching, trimmed, suggestions } = c;
	const showSkeleton = open && !hasFetched && isFetching;
	const showEmpty = open && hasFetched && !isFetching && !hasResults && trimmed !== "";
	// For the platform kit's search analytics: marked only once the answer for this query is on screen, so a
	// half-typed query or a stale list is never recorded as a search. The empty box is no search.
	const listMarks =
		open && hasFetched && !isFetching && trimmed
			? {
					"data-yns-list": "autocomplete",
					"data-yns-query": trimmed,
					"data-yns-results": suggestions.products.length,
				}
			: {};

	const optionButton = (option: SuggestionOption, children: ReactNode, className: string) => {
		const index = options.indexOf(option);
		const isActive = index === highlight;
		return (
			<button
				key={option.key}
				type="button"
				role="option"
				id={`${listboxId}-${option.key}`}
				aria-selected={isActive}
				{...optionMarks(option)}
				onMouseEnter={() => setHighlight(index)}
				onClick={() => onPick(option)}
				className={`flex w-full items-center gap-3 text-left transition-opacity ${className} ${
					isActive ? "opacity-100" : "opacity-80 hover:opacity-100"
				}`}
			>
				{children}
			</button>
		);
	};

	return (
		<div
			id={listboxId}
			role="listbox"
			aria-label="Search suggestions"
			className="flex max-h-[28rem] flex-col overflow-y-auto"
			{...listMarks}
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

			{GROUP_ORDER.map((kind) => {
				const group = options.filter((option) => option.kind === kind);
				if (group.length === 0) return null;
				const title = trimmed ? GROUP_TITLES[kind].typed : GROUP_TITLES[kind].empty;
				return (
					// biome-ignore lint/a11y/useSemanticElements: a group of options inside a listbox, not a form's fieldset
					<div
						key={kind}
						role="group"
						aria-labelledby={`${listboxId}-${kind}-title`}
						className="border-b border-border py-2"
					>
						<div
							id={`${listboxId}-${kind}-title`}
							className="pb-1 text-xs uppercase tracking-[0.18em] text-muted-foreground"
						>
							{title}
						</div>
						{group.map((option) =>
							optionButton(
								option,
								<OptionContent option={option} query={trimmed} />,
								option.kind === "product" ? "gap-4 py-2" : "py-1.5",
							),
						)}
					</div>
				);
			})}

			{showEmpty ? (
				<div className="flex flex-col gap-2 border-b border-border py-6">
					<span className="text-base font-medium text-foreground">Nothing for &ldquo;{trimmed}&rdquo;</span>
					<span className="text-xs text-muted-foreground">Try a shorter or different word.</span>
				</div>
			) : null}

			{options
				.filter((option) => option.kind === "seeAll")
				.map((option) =>
					optionButton(
						option,
						<>
							<OptionContent option={option} query={trimmed} />
							<span aria-hidden className="ms-auto text-foreground">
								→
							</span>
						</>,
						"justify-between py-3",
					),
				)}
		</div>
	);
}
