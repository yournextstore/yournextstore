"use client";

import type { APIProductFiltersResult } from "commerce-kit";
import { ChevronDown, SlidersHorizontalIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { startTransition, useOptimistic, useState } from "react";
import { useStoreConfig } from "@/components/store-config-provider";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { formatMoney } from "@/lib/money";
import { cn } from "@/lib/utils";
import { encodeVts, parseVts } from "@/lib/vts";

// Search params owned by the filters, cleared by "Clear all".
const FILTER_KEYS = ["category", "collection", "brand", "priceMin", "priceMax", "vts"] as const;

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
	const major = (minor: number) => String(Math.round(minor / 100));
	const commitPrice = (key: "priceMin" | "priceMax", raw: string) => {
		const value = Math.round(Number(raw) * 100);
		const outside = key === "priceMin" ? value <= priceFloor : value >= priceCeil;
		const next = !raw || Number.isNaN(value) || outside ? null : String(value);
		if (searchParams.get(key) === next) return;
		const bound = key === "priceMin" ? priceFloor : priceCeil;
		setPriceRange((range) =>
			key === "priceMin" ? [next ? value : bound, range[1]] : [range[0], next ? value : bound],
		);
		commit((params) => {
			if (next) {
				params.set(key, next);
			} else {
				params.delete(key);
			}
		});
	};
	const symbol =
		new Intl.NumberFormat(locale, { style: "currency", currency, maximumFractionDigits: 0 })
			.formatToParts(0)
			.find((part) => part.type === "currency")?.value ?? currency;

	const option = (key: string, checked: boolean, label: string, onChange: () => void) => (
		<label key={key} className="filter-option">
			<input type="checkbox" className="checkbox" checked={checked} onChange={onChange} />
			{label}
		</label>
	);

	const single = (title: string, key: string, items: { name: string; slug: string }[], open: boolean) =>
		items.length > 0 && (
			<details className="filter-group" open={open || searchParams.has(key)}>
				<summary>
					{title}
					<ChevronDown size={16} className="filter-chevron" aria-hidden />
				</summary>
				<div className="filter-options">
					{items.map((item) =>
						option(item.slug, searchParams.get(key) === item.slug, item.name, () =>
							setSingle(key, item.slug),
						),
					)}
				</div>
			</details>
		);

	return (
		<div className="filter-form">
			<div className="filter-scroll">
				<div className="filter-head">
					<h2>Filters</h2>
					{hasActiveFilters && (
						<button type="button" onClick={clearAll} className="text-link filter-clear">
							Clear all
						</button>
					)}
				</div>
				{hasPrice && (
					<fieldset className="filter-group filter-price">
						<legend>Price</legend>
						<div className="price-inputs">
							<span className="input-affix">
								<em aria-hidden>{symbol}</em>
								<input
									inputMode="numeric"
									aria-label="Minimum price"
									placeholder={major(priceFloor)}
									defaultValue={priceMinParam ? major(Number(priceMinParam)) : ""}
									key={`min-${priceMinParam}`}
									onBlur={(e) => commitPrice("priceMin", e.currentTarget.value.trim())}
									onKeyDown={(e) => {
										if (e.key === "Enter") commitPrice("priceMin", e.currentTarget.value.trim());
									}}
								/>
							</span>
							<span className="input-affix">
								<em aria-hidden>{symbol}</em>
								<input
									inputMode="numeric"
									aria-label="Maximum price"
									placeholder="Any"
									defaultValue={priceMaxParam ? major(Number(priceMaxParam)) : ""}
									key={`max-${priceMaxParam}`}
									onBlur={(e) => commitPrice("priceMax", e.currentTarget.value.trim())}
									onKeyDown={(e) => {
										if (e.key === "Enter") commitPrice("priceMax", e.currentTarget.value.trim());
									}}
								/>
							</span>
						</div>
						<p className="sr-only">
							Range {formatMoney({ amount: priceRange[0], currency, locale })} to{" "}
							{formatMoney({ amount: priceRange[1], currency, locale })}
						</p>
					</fieldset>
				)}
				{showCategories && single("Category", "category", facets.categories, true)}
				{showCollections && single("Collection", "collection", facets.collections, true)}
				{single("Brand", "brand", facets.brands, true)}
				{facets.variantTypes.map((vt) => {
					const selectedValues = optimisticVts[vt.label] ?? [];
					return (
						<details key={vt.label} className="filter-group" open={selectedValues.length > 0}>
							<summary>
								{vt.label}
								<ChevronDown size={16} className="filter-chevron" aria-hidden />
							</summary>
							<div className="filter-options">
								{vt.values.map((value) => {
									const checked = selectedValues.includes(value);
									return option(value, checked, value, () => toggleVariantValue(vt.label, value, !checked));
								})}
							</div>
						</details>
					);
				})}
			</div>
		</div>
	);
}

/** Desktop sidebar filters: the original's sticky grey panel (hidden below 1024px). */
export function ProductFilters({ className, ...props }: FilterControlsProps & { className?: string }) {
	return (
		<aside className={cn("filter-sidebar", className)} aria-label="Filters">
			<FilterControls {...props} />
		</aside>
	);
}

/** Mobile filters trigger + sheet (hidden on large screens). */
export function ProductFiltersMobile(props: FilterControlsProps) {
	const searchParams = useSearchParams();
	const activeCount = FILTER_KEYS.filter((key) => searchParams.has(key)).length;

	return (
		<Sheet>
			<SheetTrigger className="button mobile-filter-button">
				<SlidersHorizontalIcon size={16} aria-hidden />
				Filters
				{activeCount > 0 && <span className="count-pill">{activeCount}</span>}
			</SheetTrigger>
			<SheetContent side="bottom" className="store-sheet filter-sheet">
				<SheetHeader className="p-0">
					<SheetTitle>Filters</SheetTitle>
					<SheetDescription className="sr-only">Refine the product list</SheetDescription>
				</SheetHeader>
				<FilterControls {...props} />
			</SheetContent>
		</Sheet>
	);
}
