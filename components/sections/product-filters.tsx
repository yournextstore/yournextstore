"use client";

import type { APIProductFiltersResult } from "commerce-kit";
import { ListFilter } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { type ReactNode, startTransition, useOptimistic, useState } from "react";
import { useStoreConfig } from "@/components/store-config-provider";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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
import { FILTERS_BUTTON } from "@/lib/listing-styles";
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
	// All groups that will render, in display order — only the first opens by default.
	const accordionGroups = [
		...(showCategories && facets.categories.length > 0 ? ["categories"] : []),
		...(showCollections && facets.collections.length > 0 ? ["collections"] : []),
		...facets.variantTypes.map((vt) => `vt-${vt.label}`),
		...(facets.brands.length > 0 ? ["brands"] : []),
		...(hasPrice ? ["price"] : []),
	];

	return (
		<div className="space-y-4">
			<button
				type="button"
				onClick={clearAll}
				disabled={!hasActiveFilters}
				className="w-16 rounded-md bg-black/20 px-2 py-0.5 text-center text-sm font-semibold shadow-sm transition-colors hover:bg-gray-800 hover:text-white disabled:opacity-60 disabled:hover:bg-black/20 disabled:hover:text-foreground"
			>
				Clear
			</button>

			<Accordion type="multiple" defaultValue={accordionGroups} className="w-full">
				{showCategories && facets.categories.length > 0 && (
					<AccordionItem value="categories">
						<AccordionTrigger className="text-xl font-normal hover:no-underline">Categories</AccordionTrigger>
						<AccordionContent>
							<CollapsibleList
								items={facets.categories}
								className="grid grid-cols-2 gap-2"
								renderItem={(category) => {
									const isActive = searchParams.get("category") === category.slug;
									return (
										<li key={category.slug}>
											<button
												type="button"
												onClick={() => setSingle("category", category.slug)}
												className={cn(
													"w-full rounded-md p-2 text-center text-sm capitalize shadow-sm transition-colors",
													isActive
														? "bg-foreground text-white"
														: "bg-black/10 hover:bg-foreground hover:text-white",
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
						<AccordionTrigger className="text-xl font-normal hover:no-underline">
							Collections
						</AccordionTrigger>
						<AccordionContent>
							<CollapsibleList
								items={facets.collections}
								className="grid grid-cols-2 gap-2"
								renderItem={(collection) => {
									const isActive = searchParams.get("collection") === collection.slug;
									return (
										<li key={collection.slug}>
											<button
												type="button"
												onClick={() => setSingle("collection", collection.slug)}
												className={cn(
													"w-full rounded-md p-2 text-center text-sm capitalize shadow-sm transition-colors",
													isActive
														? "bg-foreground text-white"
														: "bg-black/10 hover:bg-foreground hover:text-white",
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
							<AccordionTrigger className="text-xl font-normal hover:no-underline">
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
												<label htmlFor={id} className="cursor-pointer text-base">
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
						<AccordionTrigger className="text-xl font-normal hover:no-underline">Brands</AccordionTrigger>
						<AccordionContent>
							<CollapsibleList
								items={facets.brands}
								className="grid grid-cols-2 gap-2"
								renderItem={(brand) => {
									const isActive = searchParams.get("brand") === brand.slug;
									return (
										<li key={brand.slug}>
											<button
												type="button"
												onClick={() => setSingle("brand", brand.slug)}
												className={cn(
													"w-full rounded-md p-2 text-center text-sm capitalize shadow-sm transition-colors",
													isActive
														? "bg-foreground text-white"
														: "bg-black/10 hover:bg-foreground hover:text-white",
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
						<AccordionTrigger className="text-xl font-normal hover:no-underline">Price</AccordionTrigger>
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
								<div className="mt-3 flex justify-between text-sm">
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

/**
 * Eyesome's "Filters" button and the frosted panel that slides in from the left, at every width
 * (the original has no sidebar).
 */
export function ProductFiltersMobile(props: FilterControlsProps) {
	const searchParams = useSearchParams();
	const activeCount = FILTER_KEYS.filter((key) => searchParams.has(key)).length;

	return (
		<Sheet>
			<SheetTrigger asChild>
				<button type="button" className={cn(FILTERS_BUTTON, activeCount > 0 && "bg-foreground text-white")}>
					<ListFilter className="h-4 w-4" aria-hidden />
					<span className="text-sm">Filters</span>
					{activeCount > 0 && <span className="text-xs">({activeCount})</span>}
				</button>
			</SheetTrigger>
			<SheetContent
				side="left"
				className="glass-panel block w-[280px] overflow-y-auto border-0 p-3 sm:max-w-[280px]"
			>
				<SheetHeader className="p-0 pe-8">
					<SheetTitle className="text-3xl font-bold">Filter Products</SheetTitle>
					<SheetDescription className="sr-only">Refine the product list</SheetDescription>
				</SheetHeader>
				<div className="pt-3 pb-8">
					<FilterControls {...props} />
				</div>
			</SheetContent>
		</Sheet>
	);
}
