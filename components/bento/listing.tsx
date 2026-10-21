import { ChevronDown } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { ProductCard, type TileProduct } from "@/components/product-card";
import {
	getListingNav,
	LISTING_SORTS,
	type ListingLink,
	type ListingSort,
	PRICE_BUCKETS,
	type PriceBucket,
} from "@/lib/listing";
import { formatMoney } from "@/lib/money";
import { getStoreConfig } from "@/lib/store-config";
import { cn } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";

/**
 * The reference's three-column listing: collections on the left, the banner, chips and grid in
 * the middle, sort on the right. Below `md` the side lists collapse into dropdowns above the grid.
 * `children` renders the middle column and the sort column as siblings (see `ListingResults`).
 */
export async function ListingShell({ activePath, children }: { activePath: string; children: ReactNode }) {
	const nav = await getListingNav();
	const groups = [
		{ title: "Shop", links: [{ title: "All", path: "/products" }, ...nav.categories] },
		...(nav.collections.length > 0 ? [{ title: "Collections", links: nav.collections }] : []),
	];
	const allLinks = groups.flatMap((g) => g.links);
	const active = allLinks.find((link) => link.path === activePath);

	return (
		<div className="mx-auto flex min-h-svh max-w-[1536px] flex-col gap-8 px-4 pt-4 pb-16 md:flex-row md:pt-6">
			<div className="order-first w-full flex-none md:max-w-[140px]">
				<nav aria-label="Collections" className="hidden md:block">
					{groups.map((group, index) => (
						<div key={group.title} className={cn(index > 0 && "mt-8")}>
							<h2 className="text-xs text-[#8a9a9c]">{group.title}</h2>
							<ul>
								{group.links.map((link) => (
									<PathItem key={link.path} link={link} active={link.path === activePath} />
								))}
							</ul>
						</div>
					))}
				</nav>
				<Dropdown key={activePath} label={active?.title ?? "All"} name="Collections" className="md:hidden">
					{groups.flatMap((group) =>
						group.links.map((link) => (
							<PathItem key={`${group.title}${link.path}`} link={link} active={link.path === activePath} />
						)),
					)}
				</Dropdown>
			</div>
			{children}
		</div>
	);
}

function PathItem({ link, active }: { link: ListingLink; active: boolean }) {
	return (
		<li className="mt-2 flex">
			{active ? (
				<p className="w-full text-sm text-bone underline decoration-amber underline-offset-4">{link.title}</p>
			) : (
				<Link href={link.path} className="w-full text-sm text-[#d4d4d4] transition-colors hover:text-amber">
					{link.title}
				</Link>
			)}
		</li>
	);
}

/** No-JS dropdown: the reference's bordered mobile select, built on <details>. */
function Dropdown({
	label,
	name,
	className,
	children,
}: {
	label: string;
	name: string;
	className?: string;
	children: ReactNode;
}) {
	return (
		<details className={cn("group relative", className)}>
			<summary
				aria-label={`${name}: ${label}`}
				className="flex min-h-10 w-full cursor-pointer list-none items-center justify-between rounded-sm border border-white/30 px-4 py-2 text-sm text-bone [&::-webkit-details-marker]:hidden"
			>
				<span>{label}</span>
				<ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" aria-hidden="true" />
			</summary>
			<ul className="absolute z-40 max-h-[60vh] w-full overflow-y-auto rounded-b-md border border-white/10 bg-panel p-4 pt-2 shadow-2xl">
				{children}
			</ul>
		</details>
	);
}

function hrefWith(basePath: string, params: Record<string, string | undefined>) {
	const search = new URLSearchParams(
		Object.entries(params).filter((entry): entry is [string, string] => Boolean(entry[1])),
	);
	return search.size ? `${basePath}?${search}` : basePath;
}

export type ListingQuery = { q?: string; sort?: string; price?: string };

export function SortColumn({
	basePath,
	active,
	query = {},
}: {
	basePath: string;
	active: ListingSort;
	query?: ListingQuery;
}) {
	const items = LISTING_SORTS.map((sort) => (
		<li key={sort.title} className="mt-2 flex text-sm">
			{sort.slug === active.slug ? (
				<p className="w-full text-bone underline decoration-amber underline-offset-4">{sort.title}</p>
			) : (
				<Link
					href={hrefWith(basePath, { ...query, sort: sort.slug ?? undefined })}
					prefetch={false}
					className="w-full text-[#d4d4d4] transition-colors hover:text-amber"
				>
					{sort.title}
				</Link>
			)}
		</li>
	));

	return (
		<div className="order-none flex-none md:order-last md:w-[125px]">
			<nav aria-label="Sort by" className="hidden md:block">
				<h2 className="text-xs text-[#8a9a9c]">Sort by</h2>
				<ul>{items}</ul>
			</nav>
			<Dropdown key={active.title} label={active.title} name="Sort by" className="md:hidden">
				{items}
			</Dropdown>
		</div>
	);
}

/**
 * The banner card that opens a collection or category: its photo under a deep fade, the name,
 * the description and an amber product count. Without a photo it is a plain panel.
 */
export function ListingBanner({
	title,
	description,
	image,
	count,
}: {
	title: string;
	description?: string | null;
	image?: string | null;
	count?: number;
}) {
	const countLabel =
		count === undefined ? null : (
			<p className="aq-spec mt-2 text-xs font-semibold tracking-wide text-amber uppercase">
				{count} {count === 1 ? "product" : "products"}
			</p>
		);
	if (!image) {
		return (
			<div className="mb-8 rounded-3xl border border-white/10 bg-panel p-6 md:p-8">
				<h1 className="text-2xl font-normal wrap-break-word md:text-4xl">{title}</h1>
				{description ? <p className="mt-1 max-w-xl text-sm text-[#a3a3a3]">{description}</p> : null}
				{countLabel}
			</div>
		);
	}
	return (
		<div className="relative mb-8 overflow-hidden rounded-3xl border border-white/10 bg-panel">
			<div className="relative h-48 w-full md:h-52">
				<YNSMedia
					src={image}
					alt=""
					fill
					priority
					sizes="(min-width: 768px) 70vw, 100vw"
					className="object-cover brightness-[0.7] saturate-[0.85]"
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent" />
			</div>
			<div className="absolute bottom-0 left-0 p-6 md:p-8">
				<h1 className="text-2xl font-normal wrap-break-word text-white md:text-4xl">{title}</h1>
				{description ? (
					<p className="mt-1 line-clamp-2 max-w-xl text-sm text-[#d4d4d4]">{description}</p>
				) : null}
				{countLabel}
			</div>
		</div>
	);
}

/** Plain heading for /products and /search. */
export function ListingHeading({ title, children }: { title: string; children?: ReactNode }) {
	return (
		<div className="mb-6">
			<h1 className="text-2xl font-normal md:text-3xl">{title}</h1>
			{children ? <p className="mt-2 text-[#a3a3a3]">{children}</p> : null}
		</div>
	);
}

/** Which price buckets the unfiltered list actually reaches (the reference hides empty facets). */
export function presentBuckets(prices: number[]) {
	return PRICE_BUCKETS.filter((bucket) =>
		prices.some((price) => price >= (bucket.min ?? 0) && (bucket.max === undefined || price < bucket.max)),
	);
}

/** "PRICE" label and pill chips; each toggles its bucket through the URL. */
export async function PriceChips({
	basePath,
	buckets,
	query = {},
}: {
	basePath: string;
	buckets: PriceBucket[];
	query?: ListingQuery;
}) {
	if (buckets.length < 2) {
		return <div className="mb-6 border-b border-white/10" />;
	}
	const { currency, locale } = await getStoreConfig();
	const fmt = (minor: number) =>
		formatMoney({ amount: BigInt(minor), currency, locale }).replace(/[.,]00(?=\D*$)/, "");
	const label = (bucket: PriceBucket) =>
		bucket.min === undefined
			? `Under ${fmt(bucket.max ?? 0)}`
			: bucket.max === undefined
				? `${fmt(bucket.min)}+`
				: `${fmt(bucket.min)} to ${fmt(bucket.max)}`;

	return (
		<div className="mb-6 flex flex-wrap items-center gap-x-3 gap-y-3 border-b border-white/10 pb-5">
			<span className="text-[11px] tracking-[0.18em] text-[#8a9a9c] uppercase">Price</span>
			<ul className="flex flex-wrap gap-2">
				{buckets.map((bucket) => {
					const active = query.price === bucket.slug;
					return (
						<li key={bucket.slug}>
							<Link
								href={hrefWith(basePath, { ...query, price: active ? undefined : bucket.slug })}
								prefetch={false}
								aria-current={active ? "true" : undefined}
								className={cn(
									"inline-flex rounded-full border px-3 py-1 text-xs transition-colors",
									active
										? "border-amber bg-amber/10 text-amber"
										: "border-white/15 text-[#d4d4d4] hover:border-amber/50 hover:text-amber",
								)}
							>
								{label(bucket)}
							</Link>
						</li>
					);
				})}
			</ul>
		</div>
	);
}

/** Middle column + sort column, rendered as two flex siblings inside the shell. */
export function ListingResults({
	products,
	basePath,
	sort,
	query,
	before,
	after,
	empty = "No products found in this collection.",
}: {
	products: TileProduct[];
	basePath: string;
	sort: ListingSort;
	query?: ListingQuery;
	before?: ReactNode;
	after?: ReactNode;
	empty?: ReactNode;
}) {
	return (
		<>
			<div className="order-last min-h-svh w-full min-w-0 md:order-none">
				{before}
				{products.length === 0 ? (
					empty ? (
						<p className="py-3 text-lg text-[#a3a3a3]">{empty}</p>
					) : null
				) : (
					<ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{products.map((product, index) => (
							<li key={product.id} className="animate-fade-in">
								<ProductCard
									product={product}
									priority={index === 0}
									sizes="(min-width: 1024px) 25vw, (min-width: 640px) 45vw, 90vw"
								/>
							</li>
						))}
					</ul>
				)}
				{after}
			</div>
			<SortColumn basePath={basePath} active={sort} query={query} />
		</>
	);
}

export function ListingResultsSkeleton({ before }: { before?: ReactNode }) {
	return (
		<>
			<div className="order-last min-h-svh w-full min-w-0 md:order-none">
				{before}
				<div className="mb-6 h-[3.25rem] border-b border-white/10" />
				<ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{Array.from({ length: 6 }, (_, i) => (
						<li key={`s-${i}`} className="rounded-[1.75rem] border border-line p-1.5">
							<div className="aspect-[4/3] animate-pulse rounded-t-[calc(1.75rem-0.375rem)] bg-panel" />
							<div className="h-[6.5rem] rounded-b-[calc(1.75rem-0.375rem)] bg-panel" />
						</li>
					))}
				</ul>
			</div>
			<div className="order-none flex-none md:order-last md:w-[125px]">
				<div className="hidden md:block">
					<p className="text-xs text-[#8a9a9c]">Sort by</p>
					{LISTING_SORTS.map((sort) => (
						<p key={sort.title} className="mt-2 text-sm text-[#d4d4d4]">
							{sort.title}
						</p>
					))}
				</div>
				<div className="min-h-10 rounded-sm border border-white/30 md:hidden" />
			</div>
		</>
	);
}

/** Same box as `ListingBanner` with a photo, for Suspense fallbacks (no layout shift). */
export function BannerSkeleton() {
	return <div className="mb-8 h-48 animate-pulse rounded-3xl border border-white/10 bg-panel md:h-52" />;
}
