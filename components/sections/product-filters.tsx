"use client";

import type { APIProductFiltersResult } from "commerce-kit";
import { FunnelIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { type ReactNode, startTransition, useOptimistic, useState } from "react";
import { useStoreConfig } from "@/components/store-config-provider";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { formatMoney } from "@/lib/money";
import { cn } from "@/lib/utils";
import { encodeVts, parseVts } from "@/lib/vts";

// Search params owned by the filters, cleared by "Clear all".
const FILTER_KEYS = ["category", "collection", "brand", "priceMin", "priceMax", "vts"] as const;

// Max entries shown per filter group before collapsing the rest behind "Show more".
const VISIBLE_ENTRY_LIMIT = 10;

/** Renders a list of filter entries, truncated to `limit` with a "Show more"/"Show less" toggle. */
function CollapsibleList<T>({
	items,
	className,
	renderItem,
	limit = VISIBLE_ENTRY_LIMIT,
}: {
	items: T[];
	className?: string;
	renderItem: (item: T) => ReactNode;
	limit?: number;
}) {
	const [expanded, setExpanded] = useState(false);
	const visible = expanded ? items : items.slice(0, limit);
	const hasMore = items.length > limit;

	return (
		<>
			<ul className={className}>{visible.map(renderItem)}</ul>
			{hasMore && (
				<button
					type="button"
					onClick={() => setExpanded((prev) => !prev)}
					className="mt-2 px-2 text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
				>
					{expanded ? "Show less" : "Show more"}
				</button>
			)}
		</>
	);
}

type FilterControlsProps = {
	facets: APIProductFiltersResult;
	showCategories?: boolean;
	showCollections?: boolean;
};

function FilterControls({ facets, showCategories = true, showCollections = true }: FilterControlsProps) {
	const { currency, locale } = useStoreConfig();
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const selectedVts = parseVts(searchParams.get("vts"));
	const [optimisticVts, setOptimisticVts] = useOptimistic(selectedVts);

	// KNOWN LIMITATION: the filters endpoint reports price bounds — and matches
	// priceMin/priceMax — in NET minor units, with no gross twin. On a tax-inclusive
	// store the slider therefore reads slightly below the prices shown on the cards.
	// Grossing them up here would desync the slider from the query the API actually
	// runs, so the bounds stay net until the endpoint exposes gross bounds of its own.
	const { min: priceFloor, max: priceCeil } = facets.priceBounds;
	const priceMinParam = searchParams.get("priceMin");
	const priceMaxParam = searchParams.get("priceMax");
	const [priceRange, setPriceRange] = useState<[number, number]>([
		priceMinParam ? Number(priceMinParam) : priceFloor,
		priceMaxParam ? Number(priceMaxParam) : priceCeil,
	]);

	const commit = (mutate: (params: URLSearchParams) => void) => {
		const params = new URLSearchParams(searchParams.toString());
		mutate(params);
		// Any filter change can shrink the result set — return to the first page.
		params.delete("page");
		startTransition(() => {
			router.push(params.size ? `${pathname}?${params}` : pathname, { scroll: false });
		});
	};

	const setSingle = (key: string, value: string) => {
		commit((params) => {
			if (params.get(key) === value) {
				params.delete(key);
			} else {
				params.set(key, value);
			}
		});
	};

	const toggleVariantValue = (label: string, value: string, checked: boolean) => {
		const current = optimisticVts[label] ?? [];
		const next = checked ? [...new Set([...current, value])] : current.filter((v) => v !== value);
		const nextRecord = { ...optimisticVts, [label]: next };
		startTransition(() => {
			setOptimisticVts(nextRecord);
			const encoded = encodeVts(nextRecord);
			commit((params) => {
				if (encoded) {
					params.set("vts", encoded);
				} else {
					params.delete("vts");
				}
			});
		});
	};

	const clearAll = () => {
		setPriceRange([priceFloor, priceCeil]);
		commit((params) => {
			for (const key of FILTER_KEYS) {
				params.delete(key);
			}
		});
	};

	const hasActiveFilters = FILTER_KEYS.some((key) => searchParams.has(key));
	const hasPrice = priceCeil > priceFloor;

	const listButton = (active: boolean) =>
		cn(
			"flex w-full items-center justify-between py-1.5 text-left text-sm transition-colors hover:text-ink",
			active ? "font-semibold text-ink" : "text-soft-text",
		);

	return (
		<div className="space-y-9">
			{hasActiveFilters && (
				<button
					type="button"
					onClick={clearAll}
					className="text-sm font-semibold text-ink underline underline-offset-4 hover:opacity-70"
				>
					Clear all filters
				</button>
			)}

			{hasPrice && (
				<FilterGroup title="Select Price Range">
					<div className="flex justify-between pb-3 text-xs text-soft-text">
						<span>{formatMoney({ amount: priceRange[0], currency, locale })}</span>
						<span>{formatMoney({ amount: priceRange[1], currency, locale })}</span>
					</div>
					<div className="px-1">
						<Slider
							value={priceRange}
							min={priceFloor}
							max={priceCeil}
							step={1}
							minStepsBetweenThumbs={1}
							aria-label="Price range"
							onValueChange={(value) => setPriceRange(value as [number, number])}
							onValueCommit={([min = priceFloor, max = priceCeil]) =>
								commit((params) => {
									if (min <= priceFloor) {
										params.delete("priceMin");
									} else {
										params.set("priceMin", String(min));
									}
									if (max >= priceCeil) {
										params.delete("priceMax");
									} else {
										params.set("priceMax", String(max));
									}
								})
							}
						/>
					</div>
				</FilterGroup>
			)}

			{showCategories && facets.categories.length > 0 && (
				<FilterGroup title="Product Categories">
					<CollapsibleList
						items={facets.categories}
						renderItem={(category) => (
							<li key={category.slug}>
								<button
									type="button"
									onClick={() => setSingle("category", category.slug)}
									className={listButton(searchParams.get("category") === category.slug)}
								>
									{category.name}
								</button>
							</li>
						)}
					/>
				</FilterGroup>
			)}

			{showCollections && facets.collections.length > 0 && (
				<FilterGroup title="Collections">
					<CollapsibleList
						items={facets.collections}
						renderItem={(collection) => (
							<li key={collection.slug}>
								<button
									type="button"
									onClick={() => setSingle("collection", collection.slug)}
									className={listButton(searchParams.get("collection") === collection.slug)}
								>
									{collection.name}
								</button>
							</li>
						)}
					/>
				</FilterGroup>
			)}

			{facets.brands.length > 0 && (
				<FilterGroup title="Brands">
					<CollapsibleList
						items={facets.brands}
						renderItem={(brand) => {
							const id = `brand-${brand.slug}`;
							return (
								<li key={brand.slug} className="flex items-center justify-between gap-2 py-1.5">
									<label htmlFor={id} className="cursor-pointer text-sm text-soft-text">
										{brand.name}
									</label>
									<Checkbox
										id={id}
										checked={searchParams.get("brand") === brand.slug}
										onCheckedChange={() => setSingle("brand", brand.slug)}
									/>
								</li>
							);
						}}
					/>
				</FilterGroup>
			)}

			{facets.variantTypes.map((vt) => {
				const selectedValues = optimisticVts[vt.label] ?? [];
				return (
					<FilterGroup key={vt.label} title={vt.label}>
						<CollapsibleList
							items={vt.values}
							limit={18}
							className="flex flex-wrap gap-2"
							renderItem={(value) => {
								const checked = selectedValues.includes(value);
								return (
									<li key={value}>
										<button
											type="button"
											aria-pressed={checked}
											onClick={() => toggleVariantValue(vt.label, value, !checked)}
											className={cn(
												"rounded-md border px-2 py-1 text-sm transition-colors",
												checked
													? "border-ink bg-ink text-background"
													: "border-border text-soft-text hover:border-ink hover:text-ink",
											)}
										>
											{value}
										</button>
									</li>
								);
							}}
						/>
					</FilterGroup>
				);
			})}
		</div>
	);
}

/** The original's open filter blocks: a bold heading over a hairline, then the options. */
function FilterGroup({ title, children }: { title: string; children: ReactNode }) {
	return (
		<section>
			<h2 className="mb-4 border-b border-border pb-2 text-lg font-bold text-ink">{title}</h2>
			{children}
		</section>
	);
}

/** Desktop sidebar filters (hidden on small screens — use `ProductFiltersMobile` there). */
export function ProductFilters({ className, ...props }: FilterControlsProps & { className?: string }) {
	return (
		<aside className={cn("hidden lg:block", className)}>
			<FilterControls {...props} />
		</aside>
	);
}

/** Mobile filters trigger + slide-over sheet (hidden on large screens). */
export function ProductFiltersMobile(props: FilterControlsProps) {
	const searchParams = useSearchParams();
	const activeCount = FILTER_KEYS.filter((key) => searchParams.has(key)).length;

	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button variant="ghost" size="sm" className="gap-1.5 text-base font-semibold text-ink lg:hidden">
					<FunnelIcon className="size-4" />
					Filter
					{activeCount > 0 && (
						<span className="ml-1 rounded-full bg-primary px-1.5 text-xs text-primary-foreground">
							{activeCount}
						</span>
					)}
				</Button>
			</SheetTrigger>
			<SheetContent side="left" className="w-[85vw] max-w-sm overflow-y-auto">
				<SheetHeader>
					<SheetTitle>Filters</SheetTitle>
					<SheetDescription className="sr-only">Refine the product list</SheetDescription>
				</SheetHeader>
				<div className="px-6 pb-8">
					<FilterControls {...props} />
				</div>
			</SheetContent>
		</Sheet>
	);
}
