import { cacheLife } from "next/cache";
import Link from "next/link";
import { ProductGridSkeleton } from "@/components/product-grid-skeleton";
import { getMenuCategories } from "@/lib/catalog";
import { cn } from "@/lib/utils";

const TAB =
	"inline-flex h-11 shrink-0 items-center rounded-md border px-5 font-serif text-body-md whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-brand-hover";

/** The menu's sections as tabs under the page heading: "Everything" plus each top-level category. */
export async function CategoryTabs({ active }: { active: string | null }) {
	"use cache";
	cacheLife("minutes");
	const categories = await getMenuCategories().catch(() => []);
	if (categories.length === 0) return null;
	const tabs: { href: string; label: string; slug: string | null }[] = [
		{ href: "/products", label: "Everything", slug: null },
		...categories.map((category) => ({
			href: `/category/${category.slug}`,
			label: category.name,
			slug: category.slug,
		})),
	];

	return (
		<nav aria-label="Shop sections" className="-mx-6 mb-10 sm:mx-0 lg:mb-14">
			<ul className="flex snap-x scroll-px-6 gap-2 overflow-x-auto px-6 pb-1 sm:flex-wrap sm:px-0 lg:justify-center">
				{tabs.map((tab) => {
					const isActive = tab.slug === active;
					return (
						<li key={tab.href} className="snap-start">
							<Link
								href={tab.href}
								aria-current={isActive ? "page" : undefined}
								className={cn(
									TAB,
									isActive
										? "border-brand bg-brand text-on-fill"
										: "border-line bg-surface text-foreground hover:border-brand-hover hover:text-brand-hover",
								)}
							>
								{tab.label}
							</Link>
						</li>
					);
				})}
			</ul>
		</nav>
	);
}

/** Same boxes as the real listing (sidebar, toolbar, grid), so nothing moves when it lands. */
export function ListingSkeleton({ withSidebar }: { withSidebar: boolean }) {
	return (
		<div className={withSidebar ? "lg:grid lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-12" : ""}>
			{withSidebar ? <div className="hidden h-96 animate-pulse rounded-md bg-surface lg:block" /> : null}
			<div>
				<div className="mb-8 flex h-10 items-center justify-between gap-3">
					<div className="h-10 w-28 animate-pulse rounded-md bg-surface lg:w-80" />
					<div className="h-10 w-36 animate-pulse rounded-md bg-surface lg:hidden" />
				</div>
				<ProductGridSkeleton className="lg:grid-cols-2 xl:grid-cols-3" />
			</div>
		</div>
	);
}
