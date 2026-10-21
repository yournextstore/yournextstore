"use client";

import type { APIProductFiltersResult } from "commerce-kit";
import { CheckIcon, ChevronDownIcon, SlidersHorizontalIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { type ReactNode, startTransition, useOptimistic, useState } from "react";
import { useStoreConfig } from "@/components/store-config-provider";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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

function useFilterActions(facets: APIProductFiltersResult) {
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

	const commitPrice = (value: number | readonly number[]) => {
		const [min, max] = value as [number, number];
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
		});
	};

	return {
		currency,
		locale,
		searchParams,
		optimisticVts,
		priceFloor,
		priceCeil,
		priceRange,
		setPriceRange,
		commitPrice,
		setSingle,
		toggleVariantValue,
		clearAll,
		hasActiveFilters,
	};
}

function FilterControls({ facets, showCategories = true, showCollections = true }: FilterControlsProps) {
	const {
		currency,
		locale,
		searchParams,
		optimisticVts,
		priceFloor,
		priceCeil,
		priceRange,
		setPriceRange,
		commitPrice,
		setSingle,
		toggleVariantValue,
		clearAll,
		hasActiveFilters,
	} = useFilterActions(facets);
	const hasPrice = priceCeil > priceFloor;
	// All groups that will render, in display order — only the first opens by default.
	const accordionGroups = [
		...(showCategories && facets.categories.length > 0 ? ["categories"] : []),
		...(showCollections && facets.collections.length > 0 ? ["collections"] : []),
		...facets.variantTypes.map((vt) => `vt-${vt.label}`),
		...(facets.brands.length > 0 ? ["brands"] : []),
		...(hasPrice ? ["price"] : []),
	];
	const accordionDefault = accordionGroups.slice(0, 1);

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<h2 className="text-sm font-medium text-foreground">Filters</h2>
				{hasActiveFilters && (
					<button
						type="button"
						onClick={clearAll}
						className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
					>
						Clear all
					</button>
				)}
			</div>

			<Accordion multiple defaultValue={accordionDefault} className="w-full">
				{showCategories && facets.categories.length > 0 && (
					<AccordionItem value="categories">
						<AccordionTrigger className="text-sm">Categories</AccordionTrigger>
						<AccordionContent>
							<CollapsibleList
								items={facets.categories}
								className="space-y-1"
								renderItem={(category) => {
									const isActive = searchParams.get("category") === category.slug;
									return (
										<li key={category.slug}>
											<button
												type="button"
												onClick={() => setSingle("category", category.slug)}
												className={cn(
													"w-full rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-secondary",
													isActive ? "font-medium text-foreground" : "text-muted-foreground",
												)}
											>
												{category.name}
											</button>
										</li>
									);
								}}
							/>
						</AccordionContent>
					</AccordionItem>
				)}

				{showCollections && facets.collections.length > 0 && (
					<AccordionItem value="collections">
						<AccordionTrigger className="text-sm">Collections</AccordionTrigger>
						<AccordionContent>
							<CollapsibleList
								items={facets.collections}
								className="space-y-1"
								renderItem={(collection) => {
									const isActive = searchParams.get("collection") === collection.slug;
									return (
										<li key={collection.slug}>
											<button
												type="button"
												onClick={() => setSingle("collection", collection.slug)}
												className={cn(
													"w-full rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-secondary",
													isActive ? "font-medium text-foreground" : "text-muted-foreground",
												)}
											>
												{collection.name}
											</button>
										</li>
									);
								}}
							/>
						</AccordionContent>
					</AccordionItem>
				)}

				{facets.variantTypes.map((vt) => {
					const selectedValues = optimisticVts[vt.label] ?? [];
					return (
						<AccordionItem key={vt.label} value={`vt-${vt.label}`}>
							<AccordionTrigger className="text-sm">{vt.label}</AccordionTrigger>
							<AccordionContent>
								<CollapsibleList
									items={vt.values}
									className="space-y-2"
									renderItem={(value) => {
										// No spaces: the checkbox names itself through aria-labelledby, a space-separated
										// id list, so "Dual Color" would point at two ids and leave it unnamed.
										const id = `${vt.label}-${value}`.replace(/\s+/g, "-");
										const checked = selectedValues.includes(value);
										return (
											<li key={value} className="flex items-center gap-2">
												<Checkbox
													id={id}
													checked={checked}
													onCheckedChange={(state) => toggleVariantValue(vt.label, value, state === true)}
												/>
												<label htmlFor={id} className="cursor-pointer text-sm text-muted-foreground">
													{value}
												</label>
											</li>
										);
									}}
								/>
							</AccordionContent>
						</AccordionItem>
					);
				})}

				{facets.brands.length > 0 && (
					<AccordionItem value="brands">
						<AccordionTrigger className="text-sm">Brands</AccordionTrigger>
						<AccordionContent>
							<CollapsibleList
								items={facets.brands}
								className="space-y-1"
								renderItem={(brand) => {
									const isActive = searchParams.get("brand") === brand.slug;
									return (
										<li key={brand.slug}>
											<button
												type="button"
												onClick={() => setSingle("brand", brand.slug)}
												className={cn(
													"w-full rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-secondary",
													isActive ? "font-medium text-foreground" : "text-muted-foreground",
												)}
											>
												{brand.name}
											</button>
										</li>
									);
								}}
							/>
						</AccordionContent>
					</AccordionItem>
				)}

				{hasPrice && (
					<AccordionItem value="price">
						<AccordionTrigger className="text-sm">Price</AccordionTrigger>
						<AccordionContent>
							<div className="px-1 pt-2">
								<Slider
									value={priceRange}
									min={priceFloor}
									max={priceCeil}
									step={1}
									minStepsBetweenValues={1}
									onValueChange={(value) => setPriceRange(value as [number, number])}
									onValueCommitted={commitPrice}
								/>
								<div className="mt-3 flex justify-between text-xs text-muted-foreground">
									<span>{formatMoney({ amount: priceRange[0], currency, locale })}</span>
									<span>{formatMoney({ amount: priceRange[1], currency, locale })}</span>
								</div>
							</div>
						</AccordionContent>
					</AccordionItem>
				)}
			</Accordion>
		</div>
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
			<SheetTrigger render={<Button variant="outline" className="h-11 px-4 lg:hidden" />}>
				<SlidersHorizontalIcon className="size-4" aria-hidden />
				Filters
				{activeCount > 0 && (
					<span className="ml-1 rounded-full bg-primary px-1.5 text-xs text-primary-foreground">
						{activeCount}
					</span>
				)}
			</SheetTrigger>
			<SheetContent
				side="left"
				className="overflow-y-auto data-[side=left]:w-[85vw] data-[side=left]:max-w-sm"
			>
				<SheetHeader>
					<SheetTitle>Filters</SheetTitle>
					<SheetDescription className="sr-only">Refine the product list</SheetDescription>
				</SheetHeader>
				<div className="px-4 pb-8">
					<FilterControls {...props} />
				</div>
			</SheetContent>
		</Sheet>
	);
}

function FilterPill({ label, count, children }: { label: string; count?: number; children: ReactNode }) {
	return (
		<Popover>
			<PopoverTrigger
				render={<Button variant="outline" size="sm" className="group/pill text-xs font-medium" />}
			>
				<span>{label}</span>
				{count ? (
					<span className="flex size-5 items-center justify-center rounded-md bg-primary text-xs text-primary-foreground">
						{count}
					</span>
				) : null}
				<ChevronDownIcon
					className="size-4 transition-transform group-aria-expanded/pill:rotate-180"
					aria-hidden
				/>
			</PopoverTrigger>
			<PopoverContent align="start" className="max-h-80 w-64 overflow-y-auto p-2">
				{children}
			</PopoverContent>
		</Popover>
	);
}

const optionRow =
	"flex w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left text-sm text-ink-soft transition-colors hover:bg-muted hover:text-ink";

function SingleOptions({
	items,
	paramKey,
	activeSlug,
	onPick,
}: {
	items: { slug: string; name: string }[];
	paramKey: string;
	activeSlug: string | null;
	onPick: (key: string, slug: string) => void;
}) {
	return (
		<ul className="space-y-0.5">
			{items.map((item) => (
				<li key={item.slug}>
					<button
						type="button"
						aria-pressed={activeSlug === item.slug}
						onClick={() => onPick(paramKey, item.slug)}
						className={cn(optionRow, activeSlug === item.slug && "font-medium text-ink")}
					>
						{item.name}
						{activeSlug === item.slug && <CheckIcon className="size-4" aria-hidden />}
					</button>
				</li>
			))}
		</ul>
	);
}

/**
 * The original's desktop filter row: one outline pill per facet opening a dropdown, the result
 * count and the sort pill at the inline end. Below lg the toolbar shows the Filters sheet instead.
 */
export function ProductFilterBar({
	facets,
	showCategories = true,
	showCollections = true,
	totalCount,
	sort,
}: FilterControlsProps & { totalCount: number; sort?: ReactNode }) {
	const {
		currency,
		locale,
		searchParams,
		optimisticVts,
		priceFloor,
		priceCeil,
		priceRange,
		setPriceRange,
		commitPrice,
		setSingle,
		toggleVariantValue,
		clearAll,
		hasActiveFilters,
	} = useFilterActions(facets);
	const hasPrice = priceCeil > priceFloor;
	const priceActive = searchParams.has("priceMin") || searchParams.has("priceMax");

	return (
		<div className="mb-6 flex items-center justify-between gap-3 border-b border-border pb-4">
			<div className="flex min-w-0 flex-wrap items-center gap-3">
				<div className="lg:hidden">
					<ProductFiltersMobile
						facets={facets}
						showCategories={showCategories}
						showCollections={showCollections}
					/>
				</div>
				<div className="hidden flex-wrap items-center gap-3 lg:flex">
					{showCategories && facets.categories.length > 0 && (
						<FilterPill label="Category" count={searchParams.has("category") ? 1 : 0}>
							<SingleOptions
								items={facets.categories}
								paramKey="category"
								activeSlug={searchParams.get("category")}
								onPick={setSingle}
							/>
						</FilterPill>
					)}
					{showCollections && facets.collections.length > 0 && (
						<FilterPill label="Collection" count={searchParams.has("collection") ? 1 : 0}>
							<SingleOptions
								items={facets.collections}
								paramKey="collection"
								activeSlug={searchParams.get("collection")}
								onPick={setSingle}
							/>
						</FilterPill>
					)}
					{facets.variantTypes.map((vt) => {
						const selected = optimisticVts[vt.label] ?? [];
						return (
							<FilterPill key={vt.label} label={vt.label} count={selected.length}>
								<ul className="space-y-1">
									{vt.values.map((value) => {
										// No spaces, as in FilterControls: the id feeds aria-labelledby.
										const id = `bar-${vt.label}-${value}`.replace(/\s+/g, "-");
										return (
											<li
												key={value}
												className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-muted"
											>
												<Checkbox
													id={id}
													checked={selected.includes(value)}
													onCheckedChange={(state) => toggleVariantValue(vt.label, value, state === true)}
												/>
												<label htmlFor={id} className="flex-1 cursor-pointer text-sm text-ink-soft">
													{value}
												</label>
											</li>
										);
									})}
								</ul>
							</FilterPill>
						);
					})}
					{facets.brands.length > 0 && (
						<FilterPill label="Brand" count={searchParams.has("brand") ? 1 : 0}>
							<SingleOptions
								items={facets.brands}
								paramKey="brand"
								activeSlug={searchParams.get("brand")}
								onPick={setSingle}
							/>
						</FilterPill>
					)}
					{hasPrice && (
						<FilterPill label="Price" count={priceActive ? 1 : 0}>
							<div className="px-2 pt-3 pb-1">
								<Slider
									value={priceRange}
									min={priceFloor}
									max={priceCeil}
									step={1}
									minStepsBetweenValues={1}
									onValueChange={(value) => setPriceRange(value as [number, number])}
									onValueCommitted={commitPrice}
									aria-label="Price range"
								/>
								<div className="mt-3 flex justify-between text-xs text-ink-soft">
									<span>{formatMoney({ amount: priceRange[0], currency, locale })}</span>
									<span>{formatMoney({ amount: priceRange[1], currency, locale })}</span>
								</div>
							</div>
						</FilterPill>
					)}
					{hasActiveFilters && (
						<button
							type="button"
							onClick={clearAll}
							className="text-sm text-ink-soft underline-offset-4 hover:text-ink hover:underline"
						>
							Clear all
						</button>
					)}
				</div>
			</div>
			<div className="flex shrink-0 items-center gap-3">
				<span className="hidden text-sm text-ink-soft sm:inline">
					{totalCount} {totalCount === 1 ? "product" : "products"}
				</span>
				{sort}
			</div>
		</div>
	);
}
