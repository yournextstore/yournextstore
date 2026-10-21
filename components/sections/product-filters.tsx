"use client";

import type { APIProductFiltersResult } from "commerce-kit";
import { ChevronDown, ChevronRight, SlidersHorizontalIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { type ReactNode, startTransition, useId, useOptimistic, useState } from "react";
import { useStoreConfig } from "@/components/store-config-provider";
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

/**
 * One filter group of the original: a bold title with a chevron over its controls. A plain
 * disclosure rather than Radix Accordion, whose `<h3>` headers would break the page's heading order.
 */
function FilterGroup({
	title,
	defaultOpen = true,
	children,
}: {
	title: string;
	defaultOpen?: boolean;
	children: ReactNode;
}) {
	const [open, setOpen] = useState(defaultOpen);
	const panelId = useId();
	return (
		<div className="border-t border-black/10 pt-5 md:pt-6">
			<button
				type="button"
				aria-expanded={open}
				aria-controls={panelId}
				onClick={() => setOpen((value) => !value)}
				className="flex w-full items-center justify-between py-0.5 text-left text-xl font-bold"
			>
				<span className="capitalize-first inline-block">{title}</span>
				<ChevronDown
					className={cn("size-4 shrink-0 transition-transform", !open && "-rotate-90")}
					aria-hidden
				/>
			</button>
			<div id={panelId} hidden={!open} className="pt-4">
				{children}
			</div>
		</div>
	);
}

function LinkList<T extends { slug: string; name: string }>({
	items,
	activeSlug,
	onPick,
}: {
	items: T[];
	activeSlug: string | null;
	onPick: (slug: string) => void;
}) {
	return (
		<CollapsibleList
			items={items}
			className="flex flex-col gap-0.5"
			renderItem={(item) => {
				const isActive = activeSlug === item.slug;
				return (
					<li key={item.slug}>
						<button
							type="button"
							aria-pressed={isActive}
							onClick={() => onPick(item.slug)}
							className={cn(
								"flex w-full items-center justify-between py-2 text-left text-base transition-colors hover:text-black",
								isActive ? "font-medium text-black" : "text-muted-foreground",
							)}
						>
							<span className="capitalize-first">{item.name}</span>
							<ChevronRight className="size-4 shrink-0" aria-hidden />
						</button>
					</li>
				);
			}}
		/>
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
	const showCategoryList = showCategories && facets.categories.length > 0;

	return (
		<div className="flex flex-col gap-5 md:gap-6">
			<div className="flex items-center justify-between">
				<span className="text-xl font-bold text-black">Filters</span>
				<SlidersHorizontalIcon className="size-6 text-black/40" aria-hidden />
			</div>

			{showCategoryList && (
				<div className="border-t border-black/10 pt-5 md:pt-6">
					<LinkList
						items={facets.categories}
						activeSlug={searchParams.get("category")}
						onPick={(slug) => setSingle("category", slug)}
					/>
				</div>
			)}

			{hasPrice && (
				<FilterGroup title="Price">
					<div className="px-1 pt-2">
						<Slider
							value={priceRange}
							min={priceFloor}
							max={priceCeil}
							step={1}
							minStepsBetweenThumbs={1}
							thumbLabels={["Minimum price", "Maximum price"]}
							className="[&_[data-slot=slider-range]]:bg-black [&_[data-slot=slider-thumb]]:size-5 [&_[data-slot=slider-thumb]]:border-black [&_[data-slot=slider-thumb]]:bg-black [&_[data-slot=slider-track]]:bg-pill"
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
						<div className="mt-3 flex justify-between text-sm font-medium text-black">
							<span>{formatMoney({ amount: priceRange[0], currency, locale })}</span>
							<span>{formatMoney({ amount: priceRange[1], currency, locale })}</span>
						</div>
					</div>
				</FilterGroup>
			)}

			{facets.variantTypes.map((vt) => {
				const selectedValues = optimisticVts[vt.label] ?? [];
				return (
					<FilterGroup key={vt.label} title={vt.label}>
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
											className={cn(
												"rounded-full px-5 py-2.5 text-sm transition-colors",
												checked
													? "bg-black font-medium text-white"
													: "bg-pill text-muted-foreground hover:text-black",
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

			{showCollections && facets.collections.length > 0 && (
				<FilterGroup title="Collections">
					<LinkList
						items={facets.collections}
						activeSlug={searchParams.get("collection")}
						onPick={(slug) => setSingle("collection", slug)}
					/>
				</FilterGroup>
			)}

			{facets.brands.length > 0 && (
				<FilterGroup title="Brands">
					<LinkList
						items={facets.brands}
						activeSlug={searchParams.get("brand")}
						onPick={(slug) => setSingle("brand", slug)}
					/>
				</FilterGroup>
			)}

			{hasActiveFilters && (
				<button
					type="button"
					onClick={clearAll}
					className="h-12 w-full rounded-full bg-black py-4 text-sm font-medium text-white transition-colors hover:bg-black/80"
				>
					Clear Filters
				</button>
			)}
		</div>
	);
}

/** Desktop sidebar: the original's bordered, rounded filter card (hidden below md — use `ProductFiltersMobile`). */
export function ProductFilters({ className, ...props }: FilterControlsProps & { className?: string }) {
	return (
		<aside
			aria-label="Filters"
			className={cn(
				"hidden w-[295px] shrink-0 rounded-[20px] border border-black/10 px-6 py-5 md:block",
				className,
			)}
		>
			<FilterControls {...props} />
		</aside>
	);
}

/** Phones: the round grey slider button beside the title, opening the filters as a bottom sheet. */
export function ProductFiltersMobile(props: FilterControlsProps) {
	const searchParams = useSearchParams();
	const activeCount = FILTER_KEYS.filter((key) => searchParams.has(key)).length;

	return (
		<Sheet>
			<SheetTrigger asChild>
				<button
					type="button"
					aria-label={activeCount > 0 ? `Filters (${activeCount} active)` : "Filters"}
					className="relative flex size-8 shrink-0 items-center justify-center rounded-full bg-pill md:hidden"
				>
					<SlidersHorizontalIcon className="size-4" aria-hidden />
					{activeCount > 0 && (
						<span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-black text-[10px] text-white">
							{activeCount}
						</span>
					)}
				</button>
			</SheetTrigger>
			<SheetContent
				side="bottom"
				className="block max-h-[90svh] overflow-y-auto rounded-t-[20px] px-5 pt-8 pb-8"
			>
				<SheetHeader className="sr-only">
					<SheetTitle>Filters</SheetTitle>
					<SheetDescription>Refine the product list</SheetDescription>
				</SheetHeader>
				<FilterControls {...props} />
			</SheetContent>
		</Sheet>
	);
}
