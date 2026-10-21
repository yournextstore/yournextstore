"use client";

import type { APIProductFiltersResult } from "commerce-kit";
import { SlidersHorizontalIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { type ReactNode, startTransition, useOptimistic, useState } from "react";
import { ChevronDownIcon } from "@/components/icons";
import { useStoreConfig } from "@/components/store-config-provider";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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

	const commitPrice = ([min = priceFloor, max = priceCeil]: number[]) =>
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

	const clearAll = () => {
		setPriceRange([priceFloor, priceCeil]);
		commit((params) => {
			for (const key of FILTER_KEYS) {
				params.delete(key);
			}
		});
	};

	return {
		searchParams,
		optimisticVts,
		priceFloor,
		priceCeil,
		priceRange,
		setPriceRange,
		setSingle,
		toggleVariantValue,
		commitPrice,
		clearAll,
		hasActiveFilters: FILTER_KEYS.some((key) => searchParams.has(key)),
		hasPrice: priceCeil > priceFloor,
	};
}

function FilterControls({ facets, showCategories = true, showCollections = true }: FilterControlsProps) {
	const { currency, locale } = useStoreConfig();
	const {
		searchParams,
		optimisticVts,
		priceFloor,
		priceCeil,
		priceRange,
		setPriceRange,
		setSingle,
		toggleVariantValue,
		commitPrice,
		clearAll,
		hasActiveFilters,
		hasPrice,
	} = useFilterActions(facets);

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

			<Accordion type="multiple" defaultValue={accordionDefault} className="w-full">
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
										const id = `${vt.label}-${value}`;
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
									minStepsBetweenThumbs={1}
									onValueChange={(value) => setPriceRange(value as [number, number])}
									onValueCommit={commitPrice}
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

const dropdownTrigger =
	"inline-flex h-12 items-center gap-2 border border-border bg-background px-3 text-copy transition-colors hover:bg-secondary data-[state=open]:border-foreground";
const optionRow =
	"flex w-full items-center gap-3 px-3 py-2.5 text-left text-copy transition-colors hover:bg-secondary";

function FilterDropdown({ label, count, children }: { label: string; count: number; children: ReactNode }) {
	return (
		<Popover>
			<PopoverTrigger className={dropdownTrigger}>
				{label}
				{count > 0 && (
					<span className="flex size-5 items-center justify-center rounded-full bg-foreground text-caption text-background">
						{count}
					</span>
				)}
				<ChevronDownIcon className="size-4" />
			</PopoverTrigger>
			<PopoverContent
				align="start"
				sideOffset={4}
				className="max-h-80 w-64 overflow-y-auto rounded-none border border-foreground p-1 shadow-none"
			>
				{children}
			</PopoverContent>
		</Popover>
	);
}

/** 640px and up: the original's row of square dropdown filters above the grid. */
export function ProductFilters({
	facets,
	showCategories = true,
	showCollections = true,
	className,
}: FilterControlsProps & { className?: string }) {
	const { currency, locale } = useStoreConfig();
	const {
		searchParams,
		optimisticVts,
		priceFloor,
		priceCeil,
		priceRange,
		setPriceRange,
		setSingle,
		toggleVariantValue,
		commitPrice,
		clearAll,
		hasActiveFilters,
		hasPrice,
	} = useFilterActions(facets);

	const single = (key: "category" | "collection" | "brand", items: { slug: string; name: string }[]) =>
		items.map((item) => {
			const active = searchParams.get(key) === item.slug;
			return (
				<button key={item.slug} type="button" onClick={() => setSingle(key, item.slug)} className={optionRow}>
					<span
						aria-hidden="true"
						className={cn("size-4 shrink-0 rounded-full border border-foreground", active && "border-[5px]")}
					/>
					{item.name}
				</button>
			);
		});

	return (
		<div className={cn("hidden flex-wrap items-center gap-2 sm:flex", className)}>
			{showCollections && facets.collections.length > 0 && (
				<FilterDropdown label="Collections" count={searchParams.has("collection") ? 1 : 0}>
					{single("collection", facets.collections)}
				</FilterDropdown>
			)}
			{showCategories && facets.categories.length > 0 && (
				<FilterDropdown label="Product type" count={searchParams.has("category") ? 1 : 0}>
					{single("category", facets.categories)}
				</FilterDropdown>
			)}
			{facets.variantTypes.map((vt) => {
				const selected = optimisticVts[vt.label] ?? [];
				return (
					<FilterDropdown key={vt.label} label={vt.label} count={selected.length}>
						{vt.values.map((value) => {
							const id = `inline-${vt.label}-${value}`;
							return (
								<label key={value} htmlFor={id} className={cn(optionRow, "cursor-pointer")}>
									<Checkbox
										id={id}
										checked={selected.includes(value)}
										onCheckedChange={(state) => toggleVariantValue(vt.label, value, state === true)}
									/>
									{value}
								</label>
							);
						})}
					</FilterDropdown>
				);
			})}
			{facets.brands.length > 0 && (
				<FilterDropdown label="Brand" count={searchParams.has("brand") ? 1 : 0}>
					{single("brand", facets.brands)}
				</FilterDropdown>
			)}
			{hasPrice && (
				<FilterDropdown
					label="Price"
					count={searchParams.has("priceMin") || searchParams.has("priceMax") ? 1 : 0}
				>
					<div className="px-3 pt-4 pb-3">
						<Slider
							value={priceRange}
							min={priceFloor}
							max={priceCeil}
							step={1}
							minStepsBetweenThumbs={1}
							onValueChange={(value) => setPriceRange(value as [number, number])}
							onValueCommit={commitPrice}
						/>
						<div className="mt-3 flex justify-between text-caption text-muted-foreground">
							<span>{formatMoney({ amount: priceRange[0], currency, locale })}</span>
							<span>{formatMoney({ amount: priceRange[1], currency, locale })}</span>
						</div>
					</div>
				</FilterDropdown>
			)}
			{hasActiveFilters && (
				<button
					type="button"
					onClick={clearAll}
					className="h-12 px-3 text-copy underline underline-offset-4 hover:no-underline"
				>
					Clear all
				</button>
			)}
		</div>
	);
}

/** Phones: a tonal "Filters" pill opening the filter sheet. */
export function ProductFiltersMobile(props: FilterControlsProps) {
	const searchParams = useSearchParams();
	const activeCount = FILTER_KEYS.filter((key) => searchParams.has(key)).length;

	return (
		<Sheet>
			<SheetTrigger asChild>
				<button type="button" className="pill pill-tonal w-full sm:hidden">
					<SlidersHorizontalIcon className="size-4" aria-hidden="true" />
					Filters
					{activeCount > 0 && (
						<span className="flex size-5 items-center justify-center rounded-full bg-foreground text-caption text-background">
							{activeCount}
						</span>
					)}
				</button>
			</SheetTrigger>
			<SheetContent side="left" className="block w-full overflow-y-auto sm:max-w-sm">
				<SheetHeader className="border-b border-border">
					<SheetTitle className="text-heading-xs font-normal">Filters</SheetTitle>
					<SheetDescription className="sr-only">Refine the product list</SheetDescription>
				</SheetHeader>
				<div className="px-4 pt-4 pb-8">
					<FilterControls {...props} />
				</div>
			</SheetContent>
		</Sheet>
	);
}
