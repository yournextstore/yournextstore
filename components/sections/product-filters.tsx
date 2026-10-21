"use client";

import type { APIProductFiltersResult } from "commerce-kit";
import { SearchIcon, SlidersHorizontalIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { type ReactNode, startTransition, useId, useOptimistic, useState } from "react";
import { useStoreConfig } from "@/components/store-config-provider";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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
					className="mt-2 px-3 font-body text-xs text-earth-soft underline-offset-4 hover:text-crimson hover:underline"
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

	const searchId = useId();
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
			{showCategories && (
				<form action="/search">
					<label
						htmlFor={searchId}
						className="mb-2 block font-body text-2xs uppercase tracking-widest text-earth-soft"
					>
						Search
					</label>
					<div className="flex items-center rounded-lg border border-earth/20 bg-background transition-colors focus-within:border-royal">
						<input
							id={searchId}
							type="search"
							name="q"
							placeholder="Search products…"
							className="min-w-0 flex-1 bg-transparent px-3 py-2.5 font-body text-sm text-earth outline-none placeholder:text-earth-soft"
						/>
						<button
							type="submit"
							aria-label="Search"
							className="shrink-0 px-3 py-2.5 text-earth-soft transition-colors hover:text-crimson"
						>
							<SearchIcon className="size-4" aria-hidden="true" />
						</button>
					</div>
				</form>
			)}
			<div className="flex items-center justify-between">
				<h2 className="font-body text-2xs uppercase tracking-widest text-earth-soft">Refine</h2>
				{hasActiveFilters && (
					<button
						type="button"
						onClick={clearAll}
						className="font-body text-xs text-crimson underline-offset-4 hover:underline"
					>
						Clear all
					</button>
				)}
			</div>

			<Accordion
				type="multiple"
				defaultValue={accordionDefault}
				className="w-full [&_[data-slot=accordion-item]]:border-earth/10"
			>
				{showCategories && facets.categories.length > 0 && (
					<AccordionItem value="categories">
						<AccordionTrigger className="py-3 font-body text-2xs font-normal uppercase tracking-widest text-earth-soft hover:no-underline">
							Categories
						</AccordionTrigger>
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
													"w-full cursor-pointer rounded-md px-3 py-2 text-left font-body text-sm transition-colors",
													isActive
														? "bg-crimson/5 font-semibold text-crimson"
														: "text-earth hover:bg-earth/5 hover:text-crimson",
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
						<AccordionTrigger className="py-3 font-body text-2xs font-normal uppercase tracking-widest text-earth-soft hover:no-underline">
							Collections
						</AccordionTrigger>
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
													"w-full cursor-pointer rounded-md px-3 py-2 text-left font-body text-sm transition-colors",
													isActive
														? "bg-crimson/5 font-semibold text-crimson"
														: "text-earth hover:bg-earth/5 hover:text-crimson",
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
							<AccordionTrigger className="py-3 font-body text-2xs font-normal uppercase tracking-widest text-earth-soft hover:no-underline">
								{vt.label}
							</AccordionTrigger>
							<AccordionContent>
								<CollapsibleList
									items={vt.values}
									className="space-y-2"
									renderItem={(value) => {
										const id = `${vt.label}-${value}`;
										const checked = selectedValues.includes(value);
										return (
											<li key={value} className="flex items-center gap-2">
												<Checkbox
													id={id}
													checked={checked}
													onCheckedChange={(state) => toggleVariantValue(vt.label, value, state === true)}
												/>
												<label htmlFor={id} className="cursor-pointer font-body text-sm text-earth">
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
						<AccordionTrigger className="py-3 font-body text-2xs font-normal uppercase tracking-widest text-earth-soft hover:no-underline">
							Brands
						</AccordionTrigger>
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
													"w-full cursor-pointer rounded-md px-3 py-2 text-left font-body text-sm transition-colors",
													isActive
														? "bg-crimson/5 font-semibold text-crimson"
														: "text-earth hover:bg-earth/5 hover:text-crimson",
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
						<AccordionTrigger className="py-3 font-body text-2xs font-normal uppercase tracking-widest text-earth-soft hover:no-underline">
							Price
						</AccordionTrigger>
						<AccordionContent>
							<div className="px-1 pt-2">
								<Slider
									value={priceRange}
									min={priceFloor}
									max={priceCeil}
									step={1}
									minStepsBetweenThumbs={1}
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
								<div className="mt-3 flex justify-between font-body text-xs text-earth-soft">
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
			<SheetTrigger asChild>
				<Button
					variant="outline"
					size="sm"
					className="h-9 rounded-md border-earth/20 bg-transparent font-body text-xs uppercase tracking-widest text-earth hover:bg-earth/5 lg:hidden"
				>
					<SlidersHorizontalIcon className="size-4" />
					Filters
					{activeCount > 0 && (
						<span className="ml-1 rounded-full bg-crimson px-1.5 text-2xs text-cream">{activeCount}</span>
					)}
				</Button>
			</SheetTrigger>
			<SheetContent side="left" className="block w-[85vw] max-w-sm overflow-y-auto bg-background">
				<SheetHeader>
					<SheetTitle className="font-display text-2xl font-normal text-royal">Filters</SheetTitle>
					<SheetDescription className="sr-only">Refine the product list</SheetDescription>
				</SheetHeader>
				<div className="px-4 pb-8">
					<FilterControls {...props} />
				</div>
			</SheetContent>
		</Sheet>
	);
}
