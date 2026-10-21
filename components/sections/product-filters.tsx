"use client";

import type { APIProductFiltersResult } from "commerce-kit";
import { ChevronDownIcon, SlidersHorizontalIcon, XIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { type ReactNode, startTransition, useOptimistic, useState } from "react";
import { useStoreConfig } from "@/components/store-config-provider";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { cn, sentenceCase } from "@/lib/utils";
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
	const accordionDefault = accordionGroups.slice(0, 1);

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<h2 className="sr-only">Filters</h2>
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
													"min-h-10 w-full rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-muted",
													isActive ? "bg-primary/10 font-medium text-primary" : "text-foreground",
												)}
											>
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
													"min-h-10 w-full rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-muted",
													isActive ? "bg-primary/10 font-medium text-primary" : "text-foreground",
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
							<AccordionTrigger className="text-sm">{sentenceCase(vt.label)}</AccordionTrigger>
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
													"min-h-10 w-full rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-muted",
													isActive ? "bg-primary/10 font-medium text-primary" : "text-foreground",
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
									onValueCommitted={(value) => {
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
									}}
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

const toolbarButton =
	"flex min-h-10 cursor-pointer items-center gap-2 rounded-md border border-border px-4 py-2 text-sm transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring data-popup-open:bg-muted";

/** Mobile filters trigger + slide-over sheet (hidden from md, where the dropdown bar takes over). */
export function ProductFiltersMobile(props: FilterControlsProps) {
	const searchParams = useSearchParams();
	const activeCount = FILTER_KEYS.filter((key) => searchParams.has(key)).length;

	return (
		<Sheet>
			<SheetTrigger className={cn(toolbarButton, "md:hidden")}>
				<SlidersHorizontalIcon className="size-4" aria-hidden="true" />
				Filters
				{activeCount > 0 && (
					<span className="rounded-full bg-primary px-1.5 text-xs text-primary-foreground">
						{activeCount}
					</span>
				)}
			</SheetTrigger>
			<SheetContent side="left" className="block overflow-y-auto p-6 data-[side=left]:w-80">
				<SheetHeader className="p-0">
					<SheetTitle className="font-display text-3xl font-normal">Filters</SheetTitle>
					<SheetDescription className="sr-only">Refine the product list</SheetDescription>
				</SheetHeader>
				<div className="mt-6 pb-8">
					<FilterControls {...props} />
				</div>
			</SheetContent>
		</Sheet>
	);
}

/** The original's desktop toolbar: one bordered dropdown per facet, left of the sort select. */
export function ProductFilterBar({
	facets,
	showCategories = true,
	showCollections = true,
}: FilterControlsProps) {
	const { currency, locale } = useStoreConfig();
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const selectedVts = parseVts(searchParams.get("vts"));

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
		params.delete("page");
		startTransition(() => {
			router.push(params.size ? `${pathname}?${params}` : pathname, { scroll: false });
		});
	};

	const setSingle = (key: string, value: string | null) =>
		commit((params) => {
			if (value === null || params.get(key) === value) {
				params.delete(key);
			} else {
				params.set(key, value);
			}
		});

	const toggleVariantValue = (label: string, value: string, checked: boolean) => {
		const current = selectedVts[label] ?? [];
		const next = checked ? [...new Set([...current, value])] : current.filter((v) => v !== value);
		const encoded = encodeVts({ ...selectedVts, [label]: next });
		commit((params) => {
			if (encoded) {
				params.set("vts", encoded);
			} else {
				params.delete("vts");
			}
		});
	};

	const singleGroups = [
		...(showCategories && facets.categories.length > 0
			? [{ key: "category", label: "Category", items: facets.categories }]
			: []),
		...(showCollections && facets.collections.length > 0
			? [{ key: "collection", label: "Collection", items: facets.collections }]
			: []),
		...(facets.brands.length > 0 ? [{ key: "brand", label: "Brand", items: facets.brands }] : []),
	];

	// Active filters as removable pills under the toolbar.
	const active = [
		...singleGroups.flatMap((group) => {
			const slug = searchParams.get(group.key);
			const item = group.items.find((i) => i.slug === slug);
			return item ? [{ id: group.key, label: item.name, clear: () => setSingle(group.key, null) }] : [];
		}),
		...Object.entries(selectedVts).flatMap(([label, values]) =>
			values.map((value) => ({
				id: `${label}-${value}`,
				label: value,
				clear: () => toggleVariantValue(label, value, false),
			})),
		),
		...(priceMinParam || priceMaxParam
			? [
					{
						id: "price",
						label: `${formatMoney({ amount: Number(priceMinParam ?? priceFloor), currency, locale })} – ${formatMoney({ amount: Number(priceMaxParam ?? priceCeil), currency, locale })}`,
						clear: () => {
							setPriceRange([priceFloor, priceCeil]);
							commit((params) => {
								params.delete("priceMin");
								params.delete("priceMax");
							});
						},
					},
				]
			: []),
	];

	return (
		<div className="hidden min-w-0 md:block">
			<div className="flex flex-wrap gap-2">
				{singleGroups.map((group) => (
					<DropdownMenu key={group.key}>
						<DropdownMenuTrigger className={toolbarButton}>
							{group.label}
							<ChevronDownIcon className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
						</DropdownMenuTrigger>
						<DropdownMenuContent align="start" sideOffset={4} className="max-h-80 w-auto min-w-48 rounded-md">
							<DropdownMenuItem onClick={() => setSingle(group.key, null)}>All</DropdownMenuItem>
							{group.items.map((item) => (
								<DropdownMenuItem
									key={item.slug}
									onClick={() => setSingle(group.key, item.slug)}
									className={cn(searchParams.get(group.key) === item.slug && "font-medium text-primary")}
								>
									{sentenceCase(item.name)}
								</DropdownMenuItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>
				))}
				{facets.variantTypes.map((vt) => (
					<DropdownMenu key={vt.label}>
						<DropdownMenuTrigger className={toolbarButton}>
							{sentenceCase(vt.label)}
							<ChevronDownIcon className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
						</DropdownMenuTrigger>
						<DropdownMenuContent align="start" sideOffset={4} className="max-h-80 w-auto min-w-48 rounded-md">
							{vt.values.map((value) => (
								<DropdownMenuCheckboxItem
									key={value}
									checked={(selectedVts[vt.label] ?? []).includes(value)}
									onCheckedChange={(checked) => toggleVariantValue(vt.label, value, checked === true)}
								>
									{value}
								</DropdownMenuCheckboxItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>
				))}
				{priceCeil > priceFloor && (
					<Popover>
						<PopoverTrigger className={toolbarButton}>
							Price
							<ChevronDownIcon className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
						</PopoverTrigger>
						<PopoverContent align="start" sideOffset={4} className="w-72 rounded-md p-5">
							<p className="eyebrow text-muted-foreground">Price range</p>
							<Slider
								className="mt-5"
								value={priceRange}
								min={priceFloor}
								max={priceCeil}
								step={1}
								minStepsBetweenValues={1}
								aria-label="Price range"
								onValueChange={(value) => setPriceRange(value as [number, number])}
								onValueCommitted={(value) => {
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
								}}
							/>
							<div className="mt-3 flex justify-between text-xs text-muted-foreground">
								<span>{formatMoney({ amount: priceRange[0], currency, locale })}</span>
								<span>{formatMoney({ amount: priceRange[1], currency, locale })}</span>
							</div>
						</PopoverContent>
					</Popover>
				)}
			</div>
			{active.length > 0 && (
				<div className="mt-4 flex flex-wrap items-center gap-2">
					{active.map((filter) => (
						<span
							key={filter.id}
							className="flex items-center gap-1 rounded-full bg-muted py-1 pr-1 pl-3 text-xs"
						>
							{sentenceCase(filter.label)}
							<button
								type="button"
								aria-label={`Remove ${filter.label} filter`}
								onClick={filter.clear}
								className="flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground"
							>
								<XIcon className="h-3 w-3" aria-hidden="true" />
							</button>
						</span>
					))}
					<button
						type="button"
						onClick={() =>
							commit((params) => {
								for (const key of FILTER_KEYS) {
									params.delete(key);
								}
							})
						}
						className="px-2 py-2 text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
					>
						Clear all
					</button>
				</div>
			)}
		</div>
	);
}
