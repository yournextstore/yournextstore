import Link from "next/link";
import { ProductGridSkeleton } from "@/components/product-grid-skeleton";
import { getShelf } from "@/lib/catalog";
import { cn } from "@/lib/utils";

/**
 * The original's collection header: a big serif title, one muted line, and the sibling
 * collections as square tabs (the current one tinted oxblood).
 */
export async function ListingHeader({
	title,
	description,
	activeHref,
}: {
	title: string;
	description?: string | null;
	activeHref?: string;
}) {
	const shelf = await getShelf();
	const tabs = [{ href: "/products", label: "All pieces" }, ...shelf];
	return (
		<section className="mx-auto max-w-6xl px-5 pt-5 md:pt-8">
			<h1 className="text-page font-medium tracking-tight">{title}</h1>
			{description ? (
				<p className="mt-3 max-w-[52ch] text-[16px] leading-relaxed text-muted-foreground">{description}</p>
			) : null}
			<nav aria-label="Browse" className="mt-7 pb-6">
				<ul className="flex flex-wrap gap-2">
					{tabs.map((tab) => {
						const active = tab.href === activeHref;
						return (
							<li key={tab.href}>
								<Link
									href={tab.href}
									aria-current={active ? "page" : undefined}
									className={cn(
										"block border px-4 py-2.5 text-[14px] transition",
										active
											? "border-brand bg-brand-soft font-semibold text-ink"
											: "border-line text-muted-foreground hover:border-ink hover:text-ink",
									)}
								>
									{tab.label}
								</Link>
							</li>
						);
					})}
				</ul>
			</nav>
		</section>
	);
}

/** The bordered toolbar above the grid: filters and count on the left, sort on the right. */
export function ListingToolbar({ start, end }: { start?: React.ReactNode; end?: React.ReactNode }) {
	return (
		<div className="mb-6 flex min-h-[62px] flex-wrap items-center justify-between gap-3 border border-line bg-paper/90 px-3 py-2.5 sm:gap-4 sm:px-5 sm:py-3">
			<div className="flex min-w-0 items-center gap-3">{start}</div>
			<div className="flex items-center gap-2">{end}</div>
		</div>
	);
}

export function ListingEmpty({ children = "No pieces match this filter." }: { children?: React.ReactNode }) {
	return <p className="py-10 text-center text-muted-foreground sm:py-16">{children}</p>;
}

/** Same shape as toolbar + grid; `min-h-svh` keeps the footer below the fold while it streams. */
export function ListingSkeleton() {
	return (
		<div className="min-h-svh">
			<ListingToolbar
				start={<div className="h-9 w-40 animate-pulse bg-tile" />}
				end={<div className="h-9 w-40 animate-pulse bg-tile" />}
			/>
			<ProductGridSkeleton />
		</div>
	);
}
