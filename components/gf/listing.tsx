import type { ReactNode } from "react";
import { CategoryCard } from "@/components/sections/home";
import { getCategoryTiles } from "@/lib/catalog";
import { cn } from "@/lib/utils";

/** The home page's round category chips as a filter strip above a listing; the current one is outlined. */
export async function CategoryStrip({ activeSlug }: { activeSlug?: string }) {
	const tiles = await getCategoryTiles();
	if (tiles.length === 0) {
		return null;
	}
	return (
		<nav
			aria-label="Categories"
			className="-mx-6 mt-[18px] flex snap-x overflow-x-auto scroll-px-6 px-6 [scrollbar-width:none]"
		>
			{tiles.map((tile) => (
				<div
					key={tile.id}
					className={cn(
						"shrink-0 rounded-[30px]",
						tile.slug === activeSlug && "outline outline-green-500 -outline-offset-1",
					)}
				>
					<CategoryCard tile={tile} />
				</div>
			))}
		</nav>
	);
}

/** Count on the left, controls on the right; the same 40px row for the real toolbar and its fallback. */
export function ListingToolbar({ count, children }: { count?: ReactNode; children?: ReactNode }) {
	return (
		<div className="mt-[18px] mb-[18px] flex min-h-10 flex-wrap items-center justify-between gap-2.5">
			<p className="text-gf-sm text-muted-foreground">{count}</p>
			<div className="flex items-center gap-2">{children}</div>
		</div>
	);
}

export function ListingToolbarSkeleton({ controls = 2 }: { controls?: number }) {
	return (
		<ListingToolbar count={<span className="inline-block h-3 w-20 rounded-full bg-flash-white" />}>
			{Array.from({ length: controls }, (_, i) => (
				<span key={i} className="h-10 w-28 rounded-full bg-flash-white" />
			))}
		</ListingToolbar>
	);
}

/** Footprint of the category chips strip (padding, 65px photo, label). */
export function CategoryStripSkeleton() {
	return (
		<div className="mt-[18px] flex h-[120px] overflow-hidden">
			{Array.from({ length: 5 }, (_, i) => (
				<div key={i} className="flex w-[97px] shrink-0 flex-col items-center gap-2.5 p-4">
					<div className="size-[65px] rounded-full bg-flash-white" />
					<div className="h-[13px] w-12 rounded-full bg-flash-white" />
				</div>
			))}
		</div>
	);
}
