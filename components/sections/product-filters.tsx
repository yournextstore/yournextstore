"use client";

import type { APIProductFiltersResult } from "commerce-kit";
import { SlidersHorizontalIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { type ReactNode, startTransition, useOptimistic, useState } from "react";
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
import { sentenceCase } from "@/lib/display";
import { formatMoney } from "@/lib/money";
import { cn } from "@/lib/utils";
import { encodeVts, parseVts } from "@/lib/vts";

const TRIGGER =
	"px-2.5 py-2.5 text-sm font-semibold uppercase text-neutral-600 hover:no-underline items-center";

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
	const accordionDefault = accordionGroups;

	return (
		<div className="flex flex-col gap-2 rounded-lg bg-card p-2">
			<div className="flex min-h-6 items-center justify-between px-2.5">
				<h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Filters</h2>
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

			<Accordion type="multiple" defaultValue={accordionDefault} className="flex w-full flex-col gap-2">
				{showCategories && facets.categories.length > 0 && (
					<AccordionItem className="rounded-lg border-0 bg-muted" value="categories">
						<AccordionTrigger className={TRIGGER}>Product category</AccordionTrigger>
						<AccordionContent className="px-2.5 pb-2.5">
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
												aria-pressed={isActive}
												className={cn(
													"flex w-full items-center gap-3 rounded-md py-1 text-left text-sm font-medium text-neutral-800 transition-colors hover:text-violet",
													isActive && "text-violet",
												)}
											>
												<span
													aria-hidden="true"
													className={cn(
														"h-4 w-4 shrink-0 rounded border",
														isActive ? "border-violet bg-violet" : "border-neutral-300 bg-card",
													)}
												/>
												{sentenceCase(category.name)}
											</button>
										</li>
									);
								}}
							/>
						</AccordionContent>
					</AccordionItem>
				)}

				{showCollections && facets.collections.length > 0 && (
					<AccordionItem className="rounded-lg border-0 bg-muted" value="collections">
						<AccordionTrigger className={TRIGGER}>Product collection</AccordionTrigger>
						<AccordionContent className="px-2.5 pb-2.5">
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
												aria-pressed={isActive}
												className={cn(
													"flex w-full items-center gap-3 rounded-md py-1 text-left text-sm font-medium text-neutral-800 transition-colors hover:text-violet",
													isActive && "text-violet",
												)}
											>
												<span
													aria-hidden="true"
													className={cn(
														"h-4 w-4 shrink-0 rounded border",
														isActive ? "border-violet bg-violet" : "border-neutral-300 bg-card",
													)}
												/>
												{sentenceCase(collection.name)}
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
						<AccordionItem key={vt.label} className="rounded-lg border-0 bg-muted" value={`vt-${vt.label}`}>
							<AccordionTrigger className={TRIGGER}>Product {vt.label}</AccordionTrigger>
							<AccordionContent className="px-2.5 pb-2.5">
								<CollapsibleList
									items={vt.values}
									className="space-y-3"
									renderItem={(value) => {
										const id = `${vt.label}-${value}`;
										const checked = selectedValues.includes(value);
										return (
											<li key={value} className="flex items-center gap-3">
												<Checkbox
													className="size-6 rounded-md border-neutral-300 bg-card data-[state=checked]:border-violet data-[state=checked]:bg-violet"
													id={id}
													checked={checked}
													onCheckedChange={(state) => toggleVariantValue(vt.label, value, state === true)}
												/>
												<label htmlFor={id} className="cursor-pointer text-sm font-medium text-neutral-800">
													{sentenceCase(value)}
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
					<AccordionItem className="rounded-lg border-0 bg-muted" value="brands">
						<AccordionTrigger className={TRIGGER}>Product brand</AccordionTrigger>
						<AccordionContent className="px-2.5 pb-2.5">
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
												aria-pressed={isActive}
												className={cn(
													"flex w-full items-center gap-3 rounded-md py-1 text-left text-sm font-medium text-neutral-800 transition-colors hover:text-violet",
													isActive && "text-violet",
												)}
											>
												<span
													aria-hidden="true"
													className={cn(
														"h-4 w-4 shrink-0 rounded border",
														isActive ? "border-violet bg-violet" : "border-neutral-300 bg-card",
													)}
												/>
												{sentenceCase(brand.name)}
											</button>
										</li>
									);
								}}
							/>
						</AccordionContent>
					</AccordionItem>
				)}

				{hasPrice && (
					<AccordionItem className="rounded-lg border-0 bg-muted" value="price">
						<AccordionTrigger className={TRIGGER}>Product price</AccordionTrigger>
						<AccordionContent className="px-2.5 pb-2.5">
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
			<SheetTrigger asChild>
				<Button variant="outline" size="sm" className="h-9 rounded-lg bg-card lg:hidden">
					<SlidersHorizontalIcon className="size-4" />
					Filters
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
				<div className="px-4 pb-8">
					<FilterControls {...props} />
				</div>
			</SheetContent>
		</Sheet>
	);
}
