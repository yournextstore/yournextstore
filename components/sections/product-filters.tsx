"use client";

import type { APIProductFiltersResult } from "commerce-kit";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { type ReactNode, startTransition, useOptimistic, useState } from "react";
import { ChevronDownIcon, CloseIcon, PlusIcon } from "@/components/icons";
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

type FilterProps = {
	facets: APIProductFiltersResult;
	showCategories?: boolean;
	showCollections?: boolean;
};

/** URL-backed filter state shared by the desktop dropdown bar and the mobile sheet. */
function useFilters(facets: APIProductFiltersResult) {
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
		setSingle,
		toggleVariantValue,
		priceRange,
		setPriceRange,
		commitPrice,
		priceFloor,
		priceCeil,
		hasPrice: priceCeil > priceFloor,
		clearAll,
		activeCount: FILTER_KEYS.filter((key) => searchParams.has(key)).length,
	};
}

type Filters = ReturnType<typeof useFilters>;

/** One checkbox row, the original's 16px-padded list item. */
function OptionRow({
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
		<li className="flex items-center gap-3 p-4 transition-colors hover:bg-grayscale-50">
			<Checkbox
				id={id}
				checked={checked}
				onCheckedChange={(state) => onChange(state === true)}
				className="rounded-[2px] border-grayscale-300 shadow-none"
			/>
			<label htmlFor={id} className="flex-1 cursor-pointer">
				{label}
			</label>
		</li>
	);
}

type Group = { key: string; label: string; content: ReactNode };

/** Every filter group the facets support, rendered as checkbox lists (and a price slider). */
function useFilterGroups(
	facets: APIProductFiltersResult,
	f: Filters,
	{ showCategories = true, showCollections = true }: Omit<FilterProps, "facets">,
): Group[] {
	const { currency, locale } = useStoreConfig();
	const single = (key: "category" | "collection" | "brand", items: { slug: string; name: string }[]) => (
		<ul>
			{items.map((item) => (
				<OptionRow
					key={item.slug}
					id={`${key}-${item.slug}`}
					label={item.name}
					checked={f.searchParams.get(key) === item.slug}
					onChange={() => f.setSingle(key, item.slug)}
				/>
			))}
		</ul>
	);

	return [
		...(showCollections && facets.collections.length > 0
			? [{ key: "collection", label: "Collection", content: single("collection", facets.collections) }]
			: []),
		...(showCategories && facets.categories.length > 0
			? [{ key: "category", label: "Category", content: single("category", facets.categories) }]
			: []),
		...facets.variantTypes.map((vt) => ({
			key: `vt-${vt.label}`,
			label: vt.label,
			content: (
				<ul>
					{vt.values.map((value) => (
						<OptionRow
							key={value}
							id={`${vt.label}-${value}`}
							label={value}
							checked={(f.optimisticVts[vt.label] ?? []).includes(value)}
							onChange={(checked) => f.toggleVariantValue(vt.label, value, checked)}
						/>
					))}
				</ul>
			),
		})),
		...(facets.brands.length > 0
			? [{ key: "brand", label: "Brand", content: single("brand", facets.brands) }]
			: []),
		...(f.hasPrice
			? [
					{
						key: "price",
						label: "Price",
						content: (
							<div className="p-4">
								<Slider
									value={f.priceRange}
									min={f.priceFloor}
									max={f.priceCeil}
									step={1}
									minStepsBetweenThumbs={1}
									onValueChange={(value) => f.setPriceRange(value as [number, number])}
									onValueCommit={f.commitPrice}
								/>
								<div className="mt-3 flex justify-between text-body-xs text-grayscale-500">
									<span>{formatMoney({ amount: f.priceRange[0], currency, locale })}</span>
									<span>{formatMoney({ amount: f.priceRange[1], currency, locale })}</span>
								</div>
							</div>
						),
					},
				]
			: []),
	];
}

const triggerClass =
	"flex h-8 items-center justify-between gap-1 rounded-xs border border-grayscale-200 px-3 text-body-xs transition-colors hover:border-grayscale-500 data-[state=open]:border-grayscale-500 md:h-10 md:gap-2 md:pr-3 md:pl-4 md:text-body";

/** md and up: a row of dropdown buttons, one per filter group, like the original's refinement bar. */
export function ProductFilterBar({ facets, className, ...options }: FilterProps & { className?: string }) {
	const f = useFilters(facets);
	const groups = useFilterGroups(facets, f, options);
	if (groups.length === 0) return null;

	return (
		<div className={cn("flex flex-wrap items-center gap-4 max-md:hidden", className)}>
			{groups.map((group) => (
				<Popover key={group.key}>
					<PopoverTrigger className={cn(triggerClass, "min-w-35")}>
						<span>{group.label}</span>
						<ChevronDownIcon className="size-4 md:size-6" />
					</PopoverTrigger>
					<PopoverContent
						align="start"
						sideOffset={4}
						className="max-h-80 w-64 overflow-y-auto rounded-xs border-grayscale-200 p-0 shadow-none"
					>
						{group.content}
					</PopoverContent>
				</Popover>
			))}
			{f.activeCount > 0 && (
				<button
					type="button"
					onClick={f.clearAll}
					className="inline-flex items-center gap-1 text-body-xs text-grayscale-500 transition-colors hover:text-foreground md:text-body"
				>
					<CloseIcon className="size-5" />
					Clear all
				</button>
			)}
		</div>
	);
}

/** Below md: a "Filter +" button opening a sheet with every group as an accordion. */
export function ProductFiltersMobile({ facets, ...options }: FilterProps) {
	const f = useFilters(facets);
	const groups = useFilterGroups(facets, f, options);
	if (groups.length === 0) return <span />;

	return (
		<Sheet>
			<SheetTrigger className={cn(triggerClass, "md:hidden")}>
				Filter
				{f.activeCount > 0 && <span className="text-grayscale-500">({f.activeCount})</span>}
				<PlusIcon className="size-4" />
			</SheetTrigger>
			<SheetContent side="left" className="w-[85vw] max-w-sm gap-0 overflow-y-auto border-0 p-0">
				<SheetHeader className="flex-row items-center justify-between px-6 pt-8 pb-4">
					<SheetTitle className="text-title-md font-normal">Filter</SheetTitle>
					<SheetDescription className="sr-only">Refine the product list</SheetDescription>
					{f.activeCount > 0 && (
						<button type="button" onClick={f.clearAll} className="mr-8 text-body-xs text-grayscale-500">
							Clear all
						</button>
					)}
				</SheetHeader>
				<Accordion type="multiple" defaultValue={groups.slice(0, 1).map((g) => g.key)} className="px-2">
					{groups.map((group) => (
						<AccordionItem key={group.key} value={group.key} className="border-grayscale-100">
							<AccordionTrigger className="px-4 text-body">{group.label}</AccordionTrigger>
							<AccordionContent>{group.content}</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>
			</SheetContent>
		</Sheet>
	);
}
