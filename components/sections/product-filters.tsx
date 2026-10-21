"use client";

import type { APIProductFiltersResult } from "commerce-kit";
import { SlidersHorizontalIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { type ReactNode, startTransition, useOptimistic, useState } from "react";
import { useStoreConfig } from "@/components/store-config-provider";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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

// Soul's toggle chips and mono uppercase group titles.
const chipClass = (active: boolean) =>
	cn(
		"h-12 rounded-full border px-4 text-sm whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime",
		active
			? "border-foreground bg-foreground text-background"
			: "border-contrast-100 bg-background text-foreground hover:border-contrast-200 hover:bg-contrast-100",
	);

const triggerClass =
	"py-3 font-mono text-sm font-normal uppercase text-contrast-500 hover:text-foreground hover:no-underline md:py-4 [&>svg]:text-contrast-500";

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
					className="mt-3 px-1 text-sm font-medium text-contrast-500 underline-offset-4 hover:text-foreground hover:underline"
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
	// All groups that will render, in display order.
	const accordionGroups = [
		...(showCategories && facets.categories.length > 0 ? ["categories"] : []),
		...(showCollections && facets.collections.length > 0 ? ["collections"] : []),
		...facets.variantTypes.map((vt) => `vt-${vt.label}`),
		...(facets.brands.length > 0 ? ["brands"] : []),
		...(hasPrice ? ["price"] : []),
	];
	// Soul opens every group.
	const accordionDefault = accordionGroups;

	return (
		<div className="space-y-5">
			<Accordion type="multiple" defaultValue={accordionDefault} className="w-full">
				{showCategories && facets.categories.length > 0 && (
					<AccordionItem className="border-0" value="categories">
						<AccordionTrigger className={triggerClass}>Categories</AccordionTrigger>
						<AccordionContent>
							<CollapsibleList
								items={facets.categories}
								className="flex flex-wrap gap-2"
								renderItem={(category) => {
									const isActive = searchParams.get("category") === category.slug;
									return (
										<li key={category.slug}>
											<button
												type="button"
												onClick={() => setSingle("category", category.slug)}
												aria-pressed={isActive}
												className={chipClass(isActive)}
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
					<AccordionItem className="border-0" value="collections">
						<AccordionTrigger className={triggerClass}>Collections</AccordionTrigger>
						<AccordionContent>
							<CollapsibleList
								items={facets.collections}
								className="flex flex-wrap gap-2"
								renderItem={(collection) => {
									const isActive = searchParams.get("collection") === collection.slug;
									return (
										<li key={collection.slug}>
											<button
												type="button"
												onClick={() => setSingle("collection", collection.slug)}
												aria-pressed={isActive}
												className={chipClass(isActive)}
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
						<AccordionItem className="border-0" key={vt.label} value={`vt-${vt.label}`}>
							<AccordionTrigger className={triggerClass}>{vt.label}</AccordionTrigger>
							<AccordionContent>
								<CollapsibleList
									items={vt.values}
									className="flex flex-wrap gap-2"
									renderItem={(value) => {
										const checked = selectedValues.includes(value);
										return (
											<li key={value}>
												<button
													type="button"
													aria-pressed={checked}
													onClick={() => toggleVariantValue(vt.label, value, !checked)}
													className={chipClass(checked)}
												>
													{value}
												</button>
											</li>
										);
									}}
								/>
							</AccordionContent>
						</AccordionItem>
					);
				})}

				{facets.brands.length > 0 && (
					<AccordionItem className="border-0" value="brands">
						<AccordionTrigger className={triggerClass}>Brands</AccordionTrigger>
						<AccordionContent>
							<CollapsibleList
								items={facets.brands}
								className="flex flex-wrap gap-2"
								renderItem={(brand) => {
									const isActive = searchParams.get("brand") === brand.slug;
									return (
										<li key={brand.slug}>
											<button
												type="button"
												onClick={() => setSingle("brand", brand.slug)}
												aria-pressed={isActive}
												className={chipClass(isActive)}
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
					<AccordionItem className="border-0" value="price">
						<AccordionTrigger className={triggerClass}>Price</AccordionTrigger>
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
								<div className="mt-3 flex justify-between text-sm text-contrast-500">
									<span>{formatMoney({ amount: priceRange[0], currency, locale })}</span>
									<span>{formatMoney({ amount: priceRange[1], currency, locale })}</span>
								</div>
							</div>
						</AccordionContent>
					</AccordionItem>
				)}
			</Accordion>
			{hasActiveFilters && (
				<button
					type="button"
					onClick={clearAll}
					className="btn-soul btn-secondary min-h-10 px-4 py-2.5 text-sm"
				>
					Reset filters
				</button>
			)}
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
				<button
					type="button"
					className="btn-soul btn-secondary min-h-12 gap-2.5 px-5 py-3 text-base lg:hidden"
				>
					Filters
					{activeCount > 0 ? (
						<span className="rounded-full bg-lime px-1.5 text-xs text-foreground">{activeCount}</span>
					) : (
						<SlidersHorizontalIcon className="hidden size-5 xs:block" strokeWidth={1.5} />
					)}
				</button>
			</SheetTrigger>
			<SheetContent side="left" className="w-[85vw] max-w-sm overflow-y-auto border-0">
				<SheetHeader className="px-6 pt-6">
					<SheetTitle className="font-heading text-3xl font-normal">Filters</SheetTitle>
					<SheetDescription className="sr-only">Refine the product list</SheetDescription>
				</SheetHeader>
				<div className="px-6 pb-8">
					<FilterControls {...props} />
				</div>
			</SheetContent>
		</Sheet>
	);
}
