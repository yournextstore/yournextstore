import { cacheLife } from "next/cache";
import Link from "next/link";
import { commerce } from "@/lib/commerce";
import { cn } from "@/lib/utils";

async function getTopCategories() {
	"use cache";
	cacheLife("hours");
	const categories = await commerce.categoriesBrowse({ active: true, limit: 50 }).catch(() => null);
	return (categories?.data ?? []).filter((category) => !category.parentId);
}

/** Plain text links under the store bar: the way into each category at every width. */
export async function CategoryRow({ activeSlug }: { activeSlug?: string }) {
	const categories = await getTopCategories();
	if (categories.length === 0) return null;
	const linkClass = "inline-block py-1 hover:text-black hover:underline";
	return (
		<nav aria-label="Categories" className="px-8 pb-2">
			<ul className="flex flex-wrap gap-x-5 gap-y-1 text-sm">
				<li>
					<Link
						href="/products"
						aria-current={activeSlug ? undefined : "page"}
						className={cn(linkClass, !activeSlug && "text-gray-900 underline")}
					>
						All
					</Link>
				</li>
				{categories.map((category) => (
					<li key={category.id}>
						<Link
							href={`/category/${category.slug}`}
							aria-current={category.slug === activeSlug ? "page" : undefined}
							className={cn(linkClass, category.slug === activeSlug && "text-gray-900 underline")}
						>
							{category.name}
						</Link>
					</li>
				))}
			</ul>
		</nav>
	);
}

/** Same box as the live sort + filter controls, so they land without moving the title row. */
export function ListingToolbarFallback({ withFilter = true }: { withFilter?: boolean }) {
	return (
		<div className="flex items-center gap-1" aria-hidden>
			<span className="h-9 w-44" />
			{withFilter && <span className="h-9 w-24" />}
		</div>
	);
}
