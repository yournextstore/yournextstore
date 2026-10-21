"use client";

import type { APIProductFiltersResult } from "commerce-kit";
import { ChevronDownIcon, ChevronUpIcon, SlidersHorizontalIcon } from "lucide-react";
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
const VISIBLE_ENTRY_LIMIT = 5;

/** A filter group's entries: the first five, then a full-width "Show more …" button (the original's seller list). */
function CollapsibleList<T>({
	items,
	noun,
	renderItem,
	limit = VISIBLE_ENTRY_LIMIT,
}: {
	items: T[];
	noun: string;
	renderItem: (item: T) => ReactNode;
	limit?: number;
}) {
	const [expanded, setExpanded] = useState(false);
	const visible = expanded ? items : items.slice(0, limit);
	const hasMore = items.length > limit;

	return (
		<>
			<ul>{visible.map(renderItem)}</ul>
			{hasMore && (
				<Button
					variant="secondary"
					size="sm"
					className="mt-2 w-full"
					onClick={() => setExpanded((prev) => !prev)}
				>
					{expanded ? `Collapse ${noun}` : `Show more ${noun}`}
					{expanded ? <ChevronUpIcon aria-hidden /> : <ChevronDownIcon aria-hidden />}
				</Button>
			)}
		</>
	);
}

/** One checkbox row; the box mirrors whether this value is the active filter. */
function CheckRow({
	id,
	label,
	checked,
	onChange,
}: {
	id: string;
	label: string;
	checked: boolean;
	onChange: (checked: boolean) => void;
}) {
	return (
		<li className="my-2 flex items-center gap-2 py-1">
			<Checkbox id={id} checked={checked} onCheckedChange={(state) => onChange(state === true)} />
			<label htmlFor={id} className="cursor-pointer text-sm font-medium leading-none">
				{label}
			</label>
		</li>
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
	const single = (key: string, entries: { slug: string; name: string }[], noun: string, heading: string) => (
		<div className="mt-4">
			<h3 className="text-xl font-semibold tracking-tight">{heading}</h3>
			<CollapsibleList
				items={entries}
				noun={noun}
				renderItem={(entry) => (
					<CheckRow
						key={entry.slug}
						id={`${key}-${entry.slug}`}
						label={entry.name}
						checked={searchParams.get(key) === entry.slug}
						onChange={() => setSingle(key, entry.slug)}
					/>
				)}
			/>
		</div>
	);

	return (
		<div>
			<div className="flex w-full items-center justify-between gap-2">
				<h2 className="text-2xl font-semibold tracking-tight">Filters</h2>
				{hasActiveFilters && (
					<Button size="sm" variant="link" className="text-muted-foreground" onClick={clearAll}>
						Clear filters
					</Button>
				)}
			</div>

			{showCategories &&
				facets.categories.length > 0 &&
				single("category", facets.categories, "categories", "Categories")}
			{showCollections &&
				facets.collections.length > 0 &&
				single("collection", facets.collections, "collections", "Collections")}
			{facets.brands.length > 0 && single("brand", facets.brands, "brands", "Brands")}

			{facets.variantTypes.map((vt) => {
				const selectedValues = optimisticVts[vt.label] ?? [];
				return (
					<div key={vt.label} className="mt-4">
						<h3 className="text-xl font-semibold tracking-tight">{vt.label}</h3>
						<CollapsibleList
							items={vt.values}
							noun="options"
							renderItem={(value) => (
								<CheckRow
									key={value}
									id={`${vt.label}-${value}`}
									label={value}
									checked={selectedValues.includes(value)}
									onChange={(checked) => toggleVariantValue(vt.label, value, checked)}
								/>
							)}
						/>
					</div>
				);
			})}

			{hasPrice && (
				<div className="mt-4">
					<h3 className="text-xl font-semibold tracking-tight">Price</h3>
					<div className="px-1 pt-4">
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
						<div className="mt-3 flex justify-between text-sm text-muted-foreground">
							<span>{formatMoney({ amount: priceRange[0], currency, locale })}</span>
							<span>{formatMoney({ amount: priceRange[1], currency, locale })}</span>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

/** Desktop sidebar filters (hidden on small screens — use `ProductFiltersMobile` there). */
export function ProductFilters({ className, ...props }: FilterControlsProps & { className?: string }) {
	return (
		<aside className={cn("hidden rounded-md border border-border p-6 lg:block", className)}>
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
				<Button variant="outline" size="sm" className="lg:hidden">
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
