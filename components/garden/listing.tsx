import Link from "next/link";
import type { ReactNode } from "react";
import { SortSelect } from "@/app/products/products-sort-select";
import { ArrowSquiggle, IconSeedling, LeafGlyph } from "@/components/garden/icons";
import { ProductGridSkeleton } from "@/components/product-grid-skeleton";
import { SORT_OPTIONS } from "@/lib/sort";

export type Crumb = { href?: string; label: string };

/** Editorial page banner: crumbs, serif title, lede and a hand-written note on the right. */
export function PageHead({
	crumbs,
	title,
	lede,
	note,
}: {
	crumbs: Crumb[];
	title: string;
	lede?: ReactNode;
	note?: ReactNode;
}) {
	return (
		<header className="page-head">
			<div className="wrap page-head__grid">
				<div>
					<nav aria-label="Breadcrumb">
						<ol className="crumbs">
							{crumbs.map((crumb, index) => (
								<li key={crumb.label} className="flex items-center gap-2">
									{index > 0 && <span aria-hidden="true">/</span>}
									{crumb.href ? (
										<Link href={crumb.href}>{crumb.label}</Link>
									) : (
										<span aria-current="page">{crumb.label}</span>
									)}
								</li>
							))}
						</ol>
					</nav>
					<h1>{title}</h1>
					{lede ? <p className="lede">{lede}</p> : null}
				</div>
				{note ? (
					<div className="page-head__aside">
						<p className="anno">
							{note}
							<ArrowSquiggle width={70} height={14} />
						</p>
						<IconSeedling className="page-head__sprout" />
					</div>
				) : null}
			</div>
		</header>
	);
}

export type Chip = { href: string; label: string; active: boolean };

/** Chips on the left (categories), result count and sort on the right. */
export function ShopTools({
	chips,
	shown,
	total,
	sortable = true,
}: {
	chips: Chip[];
	shown: number;
	total: number;
	sortable?: boolean;
}) {
	return (
		<div className="shop-tools">
			<nav className="filters" aria-label="Filter by category">
				{chips.map((chip) => (
					<Link
						key={chip.href}
						href={chip.href}
						className="chip"
						aria-current={chip.active ? "page" : undefined}
						scroll={false}
					>
						{chip.label}
					</Link>
				))}
			</nav>
			<div className="shop-tools__right">
				<p className="result-count">
					Showing <b>{shown}</b> of <b>{total}</b> {total === 1 ? "item" : "items"}
				</p>
				{sortable && <SortSelect options={SORT_OPTIONS} />}
			</div>
		</div>
	);
}

/** Same box as ShopTools, without the client controls (they read search params). */
export function ShopToolsSkeleton({ chipCount = 5 }: { chipCount?: number }) {
	return (
		<div className="shop-tools" aria-hidden="true">
			<div className="filters">
				{Array.from({ length: chipCount }).map((_, i) => (
					<span key={`chip-${i}`} className="chip w-24" />
				))}
			</div>
			<div className="shop-tools__right">
				<span className="result-count">&nbsp;</span>
				<span className="inline-block h-8 w-36 rounded-md border border-[var(--input)]" />
			</div>
		</div>
	);
}

export function ListingSkeleton({ withTools = true }: { withTools?: boolean }) {
	return (
		<div className="min-h-svh">
			{withTools && <ShopToolsSkeleton />}
			<ProductGridSkeleton />
		</div>
	);
}

/** The grid-paper card the original drops into the catalogue grid. */
export function InsertCard({ href, linkLabel }: { href: string; linkLabel: string }) {
	return (
		<aside className="insert-card">
			<LeafGlyph width={22} height={22} />
			<h2>Not sure which one?</h2>
			<p>Tell us what you&apos;re looking for. We&apos;ll point you to a tree or tool that might fit.</p>
			<span className="hand">— ask us anything, really.</span>
			<Link className="link-arw" href={href}>
				{linkLabel} <span aria-hidden="true">&rarr;</span>
			</Link>
		</aside>
	);
}

export function EmptyListing({ message }: { message: string }) {
	return (
		<div className="shop-empty">
			<span className="hand">Nothing here just yet.</span>
			<p className="text-[var(--ink-3)]">{message}</p>
			<Link className="btn btn-ghost btn-sm mt-5" href="/products">
				Browse everything
			</Link>
		</div>
	);
}
