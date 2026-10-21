"use client";

import type { APIProductFiltersResult } from "commerce-kit";
import { SlidersHorizontalIcon } from "lucide-react";
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
	/** The page's sort control, shown first like the original's "Sort By" group. */
	sortSlot?: ReactNode;
};

function FilterControls({
	facets,
	showCategories = true,
	showCollections = true,
	sortSlot,
}: FilterControlsProps) {
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

	// Single-choice facets (category, collection, brand) still read as the original's checkbox list.
	const singleChoice = (key: string, items: { slug: string; name: string }[]) => (
		<CollapsibleList
			items={items}
			className="grid gap-2"
			renderItem={(item) => {
				const id = `${key}-${item.slug}`;
				return (
					<li key={item.slug} className="flex items-center gap-2">
						<Checkbox
							id={id}
							checked={searchParams.get(key) === item.slug}
							onCheckedChange={() => setSingle(key, item.slug)}
						/>
						<label htmlFor={id} className="cursor-pointer text-sm leading-tight">
							{item.name}
						</label>
					</li>
				);
			}}
		/>
	);

	return (
		<div className="grid gap-5">
			{sortSlot}

			{showCategories && facets.categories.length > 0 && (
				<FilterGroup title="Category">{singleChoice("category", facets.categories)}</FilterGroup>
			)}

			{showCollections && facets.collections.length > 0 && (
				<FilterGroup title="Collection">{singleChoice("collection", facets.collections)}</FilterGroup>
			)}

			{facets.variantTypes.map((vt) => {
				const selectedValues = optimisticVts[vt.label] ?? [];
				return (
					<FilterGroup key={vt.label} title={vt.label}>
						<CollapsibleList
							items={vt.values}
							className="grid gap-2"
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
										<label htmlFor={id} className="cursor-pointer text-sm leading-tight">
											{value}
										</label>
									</li>
								);
							}}
						/>
					</FilterGroup>
				);
			})}

			{facets.brands.length > 0 && (
				<FilterGroup title="Brand">{singleChoice("brand", facets.brands)}</FilterGroup>
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
				</FilterGroup>
			)}

			{hasActiveFilters && (
				<button
					type="button"
					onClick={clearAll}
					className="w-max text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
				>
					Clear all filters
				</button>
			)}
		</div>
	);
}

function FilterGroup({ title, children }: { title: string; children: ReactNode }) {
	return (
		<div>
			<h3 className="mb-2 text-base font-medium">{title}</h3>
			{children}
		</div>
	);
}

/** Desktop sidebar (hidden on small screens — use `ProductFiltersMobile` there). */
export function ProductFilters({ className, ...props }: FilterControlsProps & { className?: string }) {
	return (
		<aside
			aria-label="Filters"
			className={cn(
				"hidden lg:sticky lg:top-36 lg:block lg:max-h-[calc(100svh-10rem)] lg:overflow-y-auto",
				className,
			)}
		>
			<h2 className="mb-4 text-xl font-medium">Filter</h2>
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
				<Button variant="outline" className="h-9 rounded-full lg:hidden">
					<SlidersHorizontalIcon className="size-4" />
					Filter
					{activeCount > 0 && (
						<span className="ml-1 rounded-full bg-primary px-1.5 text-xs text-primary-foreground">
							{activeCount}
						</span>
					)}
				</Button>
			</SheetTrigger>
			<SheetContent side="left" className="block w-[85vw] max-w-sm overflow-y-auto">
				<SheetHeader className="px-5 pt-6">
					<SheetTitle className="text-xl font-medium">Filter</SheetTitle>
					<SheetDescription className="sr-only">Sort and refine the product list</SheetDescription>
				</SheetHeader>
				<div className="px-5 pb-8">
					<FilterControls {...props} />
				</div>
			</SheetContent>
		</Sheet>
	);
}
