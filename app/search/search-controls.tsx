"use client";

import type { APIProductFiltersResult } from "commerce-kit";
import { SlidersHorizontal, X } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { useStoreConfig } from "@/components/store-config-provider";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { encodeCustomFieldFilter, parseCustomFieldFilter } from "@/lib/custom-field-filter";
import { formatMoney } from "@/lib/money";
import { encodeVts, parseVts } from "@/lib/vts";
import type { SearchFilters } from "./search-filters";
import { SORT_OPTIONS, type SortKey } from "./sort";

type Category = { id: string; slug: string; name: string };

/** The search's filters with their counts; null when they could not be read, which leaves only the categories. */
type Facets = APIProductFiltersResult | null;

type FilterProps = {
	categories: Category[];
	facets: Facets;
	filters: SearchFilters;
};

function buildUrl(searchParams: URLSearchParams, overrides: Record<string, string | null>) {
	const params = new URLSearchParams(searchParams);
	for (const [key, value] of Object.entries(overrides)) {
		if (value === null || value === "") params.delete(key);
		else params.set(key, value);
	}
	params.delete("page");
	const qs = params.toString();
	return qs ? `/search?${qs}` : "/search";
}

/** `vts` with one option of one variant type switched on or off. */
const toggledVts = (filters: SearchFilters, type: string, value: string) => {
	const selected = parseVts(filters.vts ?? null);
	const values = selected[type] ?? [];
	return encodeVts({
		...selected,
		[type]: values.includes(value) ? values.filter((v) => v !== value) : [...values, value],
	});
};

/** `filter` with one option of one custom field switched on or off. */
const toggledCustomField = (filters: SearchFilters, field: string, option: string) => {
	const selected = parseCustomFieldFilter(filters.filter);
	const options = selected[field] ?? [];
	return encodeCustomFieldFilter({
		...selected,
		[field]: options.includes(option) ? options.filter((o) => o !== option) : [...options, option],
	});
};

/** A value the shopper can still reach: it leaves results, or it is the one picked now. */
const reachable = (count: number | undefined, isActive: boolean) =>
	isActive || count === undefined || count > 0;

function FilterRow({
	href,
	isActive,
	label,
	count,
	size = "sm",
	onClick,
}: {
	href: string;
	isActive: boolean;
	label: string;
	count?: number;
	size?: "sm" | "md";
	onClick?: () => void;
}) {
	const py = size === "md" ? "py-3 text-base" : "py-2.5 text-sm";
	const activeClass = isActive
		? size === "md"
			? "font-medium text-foreground"
			: "text-foreground"
		: "text-muted-foreground";
	return (
		<li>
			<Link
				href={href}
				onClick={onClick}
				scroll={false}
				aria-current={isActive ? "true" : undefined}
				className={`flex items-baseline justify-between gap-2 border-b border-border ${py} transition-colors hover:text-foreground ${activeClass}`}
			>
				<span>
					{isActive ? "— " : ""}
					{label}
				</span>
				{typeof count === "number" ? <span className="text-xs tabular-nums">{count}</span> : null}
			</Link>
		</li>
	);
}

function GroupHeading({ children }: { children: string }) {
	return <h3 className="mb-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">{children}</h3>;
}

function PriceFilter({ bounds, filters }: { bounds: { min: number; max: number }; filters: SearchFilters }) {
	const { currency, locale } = useStoreConfig();
	const router = useRouter();
	const searchParams = useSearchParams();
	const [, startTransition] = useTransition();
	// Bounds and the API's price filter are both net minor units; see the note in product-filters.tsx.
	const [range, setRange] = useState<[number, number]>([
		filters.priceMin ? Math.max(bounds.min, Number(filters.priceMin)) : bounds.min,
		filters.priceMax ? Math.min(bounds.max, Number(filters.priceMax)) : bounds.max,
	]);

	return (
		<div className="px-1 pt-2">
			<Slider
				value={range}
				min={bounds.min}
				max={bounds.max}
				step={1}
				minStepsBetweenValues={1}
				aria-label="Price range"
				onValueChange={(value) => setRange(value as [number, number])}
				onValueCommitted={(value) => {
					const [min, max] = value as [number, number];
					const url = buildUrl(searchParams, {
						priceMin: min > bounds.min ? String(min) : null,
						priceMax: max < bounds.max ? String(max) : null,
					});
					startTransition(() => router.push(url, { scroll: false }));
				}}
			/>
			<div className="mt-3 flex justify-between text-xs tabular-nums text-muted-foreground">
				<span>{formatMoney({ amount: range[0], currency, locale })}</span>
				<span>{formatMoney({ amount: range[1], currency, locale })}</span>
			</div>
		</div>
	);
}

/** Every filter group of the search, in the sidebar and in the mobile sheet. */
function FilterGroups({
	categories,
	facets,
	filters,
	totalCount,
	size,
	onNavigate,
}: FilterProps & { totalCount: number; size: "sm" | "md"; onNavigate?: () => void }) {
	const searchParams = useSearchParams();
	const categoryCounts = facets
		? Object.fromEntries(facets.categories.map((c) => [c.slug, c.count ?? 0]))
		: undefined;
	const brands = (facets?.brands ?? []).filter((b) => reachable(b.count, b.slug === filters.brand));
	const selectedVts = parseVts(filters.vts ?? null);
	const variantTypes = (facets?.variantTypes ?? [])
		.map((vt) => ({
			...vt,
			options: vt.options.filter((o) =>
				reachable(o.count, selectedVts[vt.label]?.includes(o.value) ?? false),
			),
		}))
		.filter((vt) => vt.options.length > 0);
	const selectedFields = parseCustomFieldFilter(filters.filter);
	const customFields = (facets?.metafields ?? [])
		.map((field) => ({
			...field,
			options: (field.options ?? []).filter((o) =>
				reachable(o.count, selectedFields[field.field]?.includes(o.key) ?? false),
			),
		}))
		.filter((field) => field.options.length > 0);
	const priceBounds = facets?.priceBounds;

	return (
		<div className={size === "md" ? "flex flex-col gap-8" : "flex flex-col gap-10"}>
			<nav aria-label="Filter by category">
				<GroupHeading>Category</GroupHeading>
				<ul className="flex flex-col">
					<FilterRow
						href={buildUrl(searchParams, { category: null })}
						isActive={!filters.category}
						label="All"
						count={totalCount}
						size={size}
						onClick={onNavigate}
					/>
					{categories
						.filter((c) => reachable(categoryCounts?.[c.slug], c.slug === filters.category))
						.map((c) => (
							<FilterRow
								key={c.id}
								href={buildUrl(searchParams, { category: c.slug === filters.category ? null : c.slug })}
								isActive={c.slug === filters.category}
								label={c.name}
								count={categoryCounts?.[c.slug]}
								size={size}
								onClick={onNavigate}
							/>
						))}
				</ul>
			</nav>

			{brands.length > 0 ? (
				<nav aria-label="Filter by brand">
					<GroupHeading>Brand</GroupHeading>
					<ul className="flex flex-col">
						{brands.map((b) => (
							<FilterRow
								key={b.slug}
								href={buildUrl(searchParams, { brand: b.slug === filters.brand ? null : b.slug })}
								isActive={b.slug === filters.brand}
								label={b.name}
								count={b.count}
								size={size}
								onClick={onNavigate}
							/>
						))}
					</ul>
				</nav>
			) : null}

			{variantTypes.map((vt) => (
				<nav key={vt.label} aria-label={`Filter by ${vt.label}`}>
					<GroupHeading>{vt.label}</GroupHeading>
					<ul className="flex flex-col">
						{vt.options.map((o) => (
							<FilterRow
								key={o.value}
								href={buildUrl(searchParams, { vts: toggledVts(filters, vt.label, o.value) })}
								isActive={selectedVts[vt.label]?.includes(o.value) ?? false}
								label={o.label}
								count={o.count}
								size={size}
								onClick={onNavigate}
							/>
						))}
					</ul>
				</nav>
			))}

			{customFields.map((field) => (
				<nav key={field.field} aria-label={`Filter by ${field.name}`}>
					<GroupHeading>{field.name}</GroupHeading>
					<ul className="flex flex-col">
						{field.options.map((o) => (
							<FilterRow
								key={o.key}
								href={buildUrl(searchParams, { filter: toggledCustomField(filters, field.field, o.key) })}
								isActive={selectedFields[field.field]?.includes(o.key) ?? false}
								label={o.label}
								count={o.count}
								size={size}
								onClick={onNavigate}
							/>
						))}
					</ul>
				</nav>
			))}

			{priceBounds && priceBounds.max > priceBounds.min ? (
				<div>
					<GroupHeading>Price</GroupHeading>
					{/* Remounts when the bounds move with the query, so the handles start from the new range. */}
					<PriceFilter
						key={`${priceBounds.min}-${priceBounds.max}-${filters.priceMin}-${filters.priceMax}`}
						bounds={priceBounds}
						filters={filters}
					/>
				</div>
			) : null}
		</div>
	);
}

export function ActiveFilters({ categories, facets, filters }: FilterProps) {
	const searchParams = useSearchParams();
	const { currency, locale } = useStoreConfig();
	const money = (amount: string) => formatMoney({ amount: Number(amount), currency, locale });

	const category = categories.find((c) => c.slug === filters.category);
	const brand = facets?.brands.find((b) => b.slug === filters.brand);
	const optionLabel = (type: string, value: string) =>
		facets?.variantTypes.find((vt) => vt.label === type)?.options.find((o) => o.value === value)?.label ??
		value;
	const fieldOptionLabel = (field: string, key: string) =>
		facets?.metafields?.find((f) => f.field === field)?.options?.find((o) => o.key === key)?.label ?? key;

	const chips = [
		...(filters.category
			? [
					{
						key: "category",
						label: category?.name ?? filters.category,
						href: buildUrl(searchParams, { category: null }),
					},
				]
			: []),
		...(filters.brand
			? [{ key: "brand", label: brand?.name ?? filters.brand, href: buildUrl(searchParams, { brand: null }) }]
			: []),
		...Object.entries(parseVts(filters.vts ?? null)).flatMap(([type, values]) =>
			values.map((value) => ({
				key: `vts-${type}-${value}`,
				label: optionLabel(type, value),
				href: buildUrl(searchParams, { vts: toggledVts(filters, type, value) }),
			})),
		),
		...Object.entries(parseCustomFieldFilter(filters.filter)).flatMap(([field, options]) =>
			options.map((option) => ({
				key: `filter-${field}-${option}`,
				label: fieldOptionLabel(field, option),
				href: buildUrl(searchParams, { filter: toggledCustomField(filters, field, option) }),
			})),
		),
		...(filters.priceMin || filters.priceMax
			? [
					{
						key: "price",
						label: `${filters.priceMin ? money(filters.priceMin) : ""}–${filters.priceMax ? money(filters.priceMax) : ""}`,
						href: buildUrl(searchParams, { priceMin: null, priceMax: null }),
					},
				]
			: []),
	];
	if (chips.length === 0) return null;

	return (
		<div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
			<span className="text-muted-foreground">in</span>
			{chips.map((chip) => (
				<Link
					key={chip.key}
					href={chip.href}
					scroll={false}
					aria-label={`Remove filter ${chip.label}`}
					className="group inline-flex items-center gap-1.5 border-b border-foreground/70 pb-0.5 text-foreground transition-colors hover:border-foreground"
				>
					<span>{chip.label}</span>
					<X className="h-3 w-3 opacity-60 group-hover:opacity-100" strokeWidth={1.5} />
				</Link>
			))}
		</div>
	);
}

export function SortSelect({ value }: { value: SortKey }) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [isPending, startTransition] = useTransition();

	return (
		<label className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
			<span>Sort</span>
			<div className="relative">
				<select
					value={value}
					disabled={isPending}
					onChange={(e) => {
						const url = buildUrl(searchParams, { sort: e.target.value });
						startTransition(() => router.push(url));
					}}
					className="appearance-none border-0 border-b border-foreground/30 bg-transparent pr-5 pb-0.5 text-sm font-medium normal-case tracking-normal text-foreground focus:border-foreground focus:outline-none"
				>
					{SORT_OPTIONS.map((opt) => (
						<option key={opt.value} value={opt.value}>
							{opt.label}
						</option>
					))}
				</select>
				<span
					aria-hidden
					className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-foreground/50"
				>
					↓
				</span>
			</div>
		</label>
	);
}

export function FilterSidebar(props: FilterProps & { totalCount: number }) {
	return <FilterGroups {...props} size="sm" />;
}

export function MobileControls({
	sort,
	totalCount,
	...props
}: FilterProps & { sort: SortKey; totalCount: number }) {
	const searchParams = useSearchParams();
	const [open, setOpen] = useState(false);
	const close = () => setOpen(false);
	const activeSort = SORT_OPTIONS.find((s) => s.value === sort);
	const activeCount =
		(props.filters.category ? 1 : 0) +
		(props.filters.brand ? 1 : 0) +
		(props.filters.priceMin || props.filters.priceMax ? 1 : 0) +
		Object.values(parseVts(props.filters.vts ?? null)).flat().length +
		Object.values(parseCustomFieldFilter(props.filters.filter)).flat().length;

	return (
		<div className="sticky top-16 z-30 -mx-4 flex items-center justify-between border-y border-border bg-background/90 px-4 py-3 text-xs uppercase tracking-[0.18em] backdrop-blur-md sm:hidden">
			<Sheet open={open} onOpenChange={setOpen}>
				<SheetTrigger className="inline-flex items-center gap-2 text-foreground transition-opacity hover:opacity-70">
					<SlidersHorizontal className="h-3.5 w-3.5" strokeWidth={1.5} />
					<span>
						Filter{activeCount > 0 ? ` · ${activeCount}` : ""} / {activeSort?.label}
					</span>
				</SheetTrigger>
				{/* The filter lists are as long as the store's catalog: cap the sheet below the viewport
				    and let it scroll, or a long list pushes its end off screen with no way to reach it. */}
				<SheetContent side="bottom" className="max-h-[85dvh] overflow-y-auto rounded-t-2xl p-6">
					<SheetTitle className="text-2xl font-medium tracking-tight">Refine</SheetTitle>

					<h3 className="mt-6 mb-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">Sort</h3>
					<ul className="flex flex-col">
						{SORT_OPTIONS.map((opt) => (
							<FilterRow
								key={opt.value}
								href={buildUrl(searchParams, { sort: opt.value })}
								isActive={opt.value === sort}
								label={opt.label}
								size="md"
								onClick={close}
							/>
						))}
					</ul>

					<div className="mt-8">
						<FilterGroups {...props} totalCount={totalCount} size="md" onNavigate={close} />
					</div>
				</SheetContent>
			</Sheet>
			<span className="tabular-nums text-foreground">{totalCount}</span>
		</div>
	);
}
