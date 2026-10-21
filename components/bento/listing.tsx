import { ChevronDown } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { ProductCard, type TileProduct } from "@/components/product-card";
import { getListingNav, LISTING_SORTS, type ListingLink, type ListingSort } from "@/lib/listing";
import { cn } from "@/lib/utils";

/**
 * Three-column listing from the reference: collections on the left, the grid in the middle,
 * sort on the right. Below `md` the side lists collapse into dropdowns above the grid.
 * `children` renders the grid and the sort column as siblings (see `ListingResults`).
 */
export async function ListingShell({
	title,
	activePath,
	children,
}: {
	title: string;
	activePath: string;
	children: ReactNode;
}) {
	const nav = await getListingNav();
	const groups = [
		{ title: "Collections", links: [{ title: "All", path: "/products" }, ...nav.collections] },
		...(nav.categories.length > 0 ? [{ title: "Categories", links: nav.categories }] : []),
	];
	const allLinks = groups.flatMap((g) => g.links);
	const active = allLinks.find((link) => link.path === activePath);

	return (
		<div className="mx-auto flex min-h-svh max-w-(--breakpoint-2xl) flex-col gap-8 px-4 pb-4 text-black md:flex-row dark:text-white">
			<h1 className="sr-only">{title}</h1>
			<div className="order-first w-full flex-none md:max-w-[125px]">
				<nav aria-label="Collections" className="hidden md:block">
					{groups.map((group, index) => (
						<div key={group.title} className={cn(index > 0 && "mt-6")}>
							<h2 className="text-xs text-muted-foreground">{group.title}</h2>
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
		<li className="mt-2 flex text-black dark:text-white">
			{active ? (
				<p className="w-full text-sm underline underline-offset-4">{link.title}</p>
			) : (
				<Link
					href={link.path}
					className="w-full text-sm underline-offset-4 hover:underline dark:hover:text-neutral-100"
				>
					{link.title}
				</Link>
			)}
		</li>
	);
}

/** No-JS dropdown: the reference's bordered select-alike, built on <details>. */
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
				className="flex min-h-10 w-full cursor-pointer list-none items-center justify-between rounded-sm border border-black/30 px-4 py-2 text-sm dark:border-white/30 [&::-webkit-details-marker]:hidden"
			>
				<span>{label}</span>
				<ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" aria-hidden="true" />
			</summary>
			<ul className="absolute z-40 max-h-[60vh] w-full overflow-y-auto rounded-b-md bg-white p-4 pt-2 shadow-md dark:bg-black">
				{children}
			</ul>
		</details>
	);
}

function sortHref(basePath: string, sort: ListingSort, q?: string) {
	const params = new URLSearchParams({
		...(q ? { q } : {}),
		...(sort.slug ? { sort: sort.slug } : {}),
	});
	return params.size ? `${basePath}?${params}` : basePath;
}

export function SortColumn({ basePath, active, q }: { basePath: string; active: ListingSort; q?: string }) {
	const items = LISTING_SORTS.map((sort) => (
		<li key={sort.title} className="mt-2 flex text-sm text-black dark:text-white">
			{sort.slug === active.slug ? (
				<p className="w-full underline underline-offset-4">{sort.title}</p>
			) : (
				<Link
					href={sortHref(basePath, sort, q)}
					prefetch={false}
					className="w-full hover:underline hover:underline-offset-4"
				>
					{sort.title}
				</Link>
			)}
		</li>
	));

	return (
		<div className="order-none flex-none md:order-last md:w-[125px]">
			<nav aria-label="Sort by" className="hidden md:block">
				<h2 className="text-xs text-muted-foreground">Sort by</h2>
				<ul>{items}</ul>
			</nav>
			<Dropdown key={active.title} label={active.title} name="Sort by" className="md:hidden">
				{items}
			</Dropdown>
		</div>
	);
}

/** Grid + sort column, rendered as two flex siblings inside the shell. */
export function ListingResults({
	products,
	basePath,
	sort,
	q,
	before,
	after,
	empty = "No products found in this collection",
}: {
	products: TileProduct[];
	basePath: string;
	sort: ListingSort;
	q?: string;
	before?: ReactNode;
	after?: ReactNode;
	empty?: ReactNode;
}) {
	// "Relevance" has no order of its own: photographed, priced products lead the page, so the grid
	// never opens on an empty frame or a 0.00 chip. Explicit sorts keep the API's order.
	const rank = (product: TileProduct) =>
		((product.images?.length ?? 0) > 0 ? 0 : 2) +
		("variants" in product && product.variants.some((variant) => Number(variant.price) > 0) ? 0 : 1);
	const ordered = sort.orderBy ? products : products.toSorted((a, b) => rank(a) - rank(b));
	return (
		<>
			<div className="order-last min-h-screen w-full md:order-none">
				{before}
				{ordered.length === 0 ? (
					<p className="py-3 text-lg">{empty}</p>
				) : (
					<ul className="grid grid-flow-row grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{ordered.map((product, index) => (
							<li key={product.id} className="animate-fade-in aspect-square">
								<ProductCard
									product={product}
									priority={index === 0}
									sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
								/>
							</li>
						))}
					</ul>
				)}
				{after}
			</div>
			<SortColumn basePath={basePath} active={sort} q={q} />
		</>
	);
}

export function ListingResultsSkeleton() {
	return (
		<>
			<div className="order-last min-h-screen w-full md:order-none">
				<ul className="grid grid-flow-row grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{Array.from({ length: 6 }, (_, i) => (
						<li
							key={`s-${i}`}
							className="aspect-square animate-pulse rounded-lg bg-neutral-100 dark:bg-neutral-800"
						/>
					))}
				</ul>
			</div>
			<div className="order-none flex-none md:order-last md:w-[125px]">
				<div className="hidden md:block">
					<p className="text-xs text-muted-foreground">Sort by</p>
					{LISTING_SORTS.map((sort) => (
						<p key={sort.title} className="mt-2 text-sm">
							{sort.title}
						</p>
					))}
				</div>
				<div className="min-h-10 rounded-sm border border-black/30 md:hidden dark:border-white/30" />
			</div>
		</>
	);
}
