import Link from "next/link";
import { Fragment } from "react";
import { type CardProduct, ProductCard } from "@/components/product-card";
import { type SortChoice, SortSelect } from "@/components/sort-select";
import { pad2 } from "@/lib/pad";

export type Crumb = { href?: string; label: string };
export type Chip = { label: string; href: string; current: boolean };
export type ChipGroup = { label: string; chips: Chip[] };

/** Mono breadcrumb: "Catalogue / Living Room". */
export function Crumbs({ items }: { items: Crumb[] }) {
	return (
		<nav
			className="mono flex flex-wrap gap-2 text-[0.6875rem] uppercase tracking-[0.05em] text-muted-foreground"
			aria-label="Breadcrumb"
		>
			{items.map((item, index) => (
				<Fragment key={`${item.label}-${index}`}>
					{index > 0 && <span aria-hidden="true">/</span>}
					{item.href ? (
						<Link href={item.href} className="link">
							{item.label}
						</Link>
					) : (
						<span className="text-foreground" aria-current="page">
							{item.label}
						</span>
					)}
				</Fragment>
			))}
		</nav>
	);
}

/** Page header: oversized tight headline and a lead paragraph. */
export function CatalogueHeader({
	title,
	lead,
	crumbs,
}: {
	title: string;
	lead?: string | null;
	crumbs?: Crumb[];
}) {
	return (
		<section className="pb-12 pt-12 md:pb-16 md:pt-20">
			{crumbs && (
				<div className="mb-8">
					<Crumbs items={crumbs} />
				</div>
			)}
			<h1 className="type-h1 hero-in max-w-[12ch]">{title}</h1>
			{lead && (
				<p
					className="type-lead hero-in mt-8 max-w-[52ch]"
					style={{ "--reveal-delay": "120ms" } as React.CSSProperties}
				>
					{lead}
				</p>
			)}
		</section>
	);
}

/** Filter chips and sort, then the live count rule. Chips are links, so the bar needs no JS. */
export function FilterBar({
	groups,
	sort,
	count,
	pending = false,
}: {
	groups: ChipGroup[];
	sort?: { choices: SortChoice[]; current: string };
	count: number | null;
	pending?: boolean;
}) {
	const visible = groups.filter((group) => group.chips.length > 1);
	return (
		<>
			{(visible.length > 0 || sort) && (
				<section className="border-t border-border pb-10 pt-7" aria-label="Filter and sort the catalogue">
					<div className="flex flex-col gap-7 lg:flex-row lg:items-start lg:justify-between">
						<div className="space-y-5">
							{visible.map((group) => (
								<div key={group.label}>
									<p className="label mb-2.5">{group.label}</p>
									<ul className="flex flex-wrap items-center gap-2">
										{group.chips.map((chip) => (
											<li key={chip.href}>
												<Link
													href={chip.href}
													scroll={false}
													className="chip"
													aria-current={chip.current ? "page" : undefined}
												>
													{chip.label}
												</Link>
											</li>
										))}
									</ul>
								</div>
							))}
						</div>
						{sort && <SortSelect choices={sort.choices} current={sort.current} disabled={pending} />}
					</div>
				</section>
			)}
			<p
				className="mono border-t border-border py-4 text-[0.6875rem] uppercase tracking-[0.05em] text-muted-foreground"
				aria-live="polite"
			>
				{count === null ? " " : `${pad2(count)} ${count === 1 ? "piece" : "pieces"} shown`}
			</p>
		</>
	);
}

export async function CatalogueGrid({ products }: { products: CardProduct[] }) {
	if (products.length === 0) {
		return (
			<div className="py-32 text-center">
				<p className="type-h3 text-muted-foreground">No pieces match that combination.</p>
				<Link href="/products" className="btn btn-outline mt-8">
					See every piece
				</Link>
			</div>
		);
	}
	return (
		<ul className="grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
			{products.map((product, index) => (
				<li key={product.id}>
					<ProductCard
						product={product}
						index={index}
						priority={index === 0}
						reveal={index >= 3}
						revealDelay={(index % 3) * 110}
					/>
				</li>
			))}
		</ul>
	);
}

export function CatalogueGridSkeleton({ count = 6 }: { count?: number }) {
	return (
		<ul className="grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
			{Array.from({ length: count }, (_, i) => (
				<li key={`skeleton-${i}`}>
					<div className="aspect-[4/5] animate-pulse bg-surface" />
					<div className="mt-4 border-t border-border pt-3">
						<div className="h-4 w-1/2 bg-surface" />
						<div className="mt-2 h-3 w-1/3 bg-surface" />
					</div>
				</li>
			))}
		</ul>
	);
}

/** Withdraws a key from a query string, for "toggle off" chip links. */
export function hrefWith(
	basePath: string,
	params: Record<string, string | undefined>,
	patch: Record<string, string | undefined>,
) {
	const next = new URLSearchParams();
	for (const [key, value] of Object.entries({ ...params, ...patch })) {
		if (value && key !== "page") next.set(key, value);
	}
	return next.size ? `${basePath}?${next}` : basePath;
}
