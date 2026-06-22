import { cacheLife } from "next/cache";
import { YnsLink } from "@/components/yns-link";
import { commerce } from "@/lib/commerce";

export const SORT_OPTIONS = [
	{ value: "newest", label: "Newest", orderBy: "createdAt", orderDirection: "desc" },
	{ value: "price-asc", label: "Price: Low to High", orderBy: "price", orderDirection: "asc" },
	{ value: "price-desc", label: "Price: High to Low", orderBy: "price", orderDirection: "desc" },
	{ value: "name", label: "Name: A–Z", orderBy: "name", orderDirection: "asc" },
] as const;

export type SortValue = (typeof SORT_OPTIONS)[number]["value"];

function buildHref(basePath: string, params: Record<string, string | undefined>) {
	const search = new URLSearchParams();
	Object.entries(params).forEach(([key, value]) => {
		if (value && value !== "") search.set(key, value);
	});
	const qs = search.size ? `?${search.toString()}` : "";
	return `${basePath}${qs}`;
}

export async function FilterSidebar({
	basePath = "/products",
	currentSort,
	currentCategory,
	keepParams = {},
	showCategories = true,
}: {
	basePath?: string;
	currentSort?: string;
	currentCategory?: string;
	keepParams?: Record<string, string | undefined>;
	showCategories?: boolean;
}) {
	"use cache";
	cacheLife("hours");

	const categories = showCategories ? await commerce.categoriesBrowse({ active: true, limit: 50 }) : null;

	return (
		<aside className="md:w-60 lg:w-64 shrink-0 md:sticky md:top-32 self-start">
			<div className="neo-border bg-[var(--color-surface-container-lowest)] divide-y divide-foreground">
				<div className="p-5">
					<h3 className="label-caps mb-4">Sort by</h3>
					<ul className="space-y-2">
						{SORT_OPTIONS.map((option) => {
							const isActive = (currentSort ?? "newest") === option.value;
							const href = buildHref(basePath, {
								...keepParams,
								sort: option.value === "newest" ? undefined : option.value,
							});
							return (
								<li key={option.value}>
									<YnsLink
										prefetch="eager"
										href={href}
										className={`flex items-center justify-between gap-2 px-2 py-1.5 text-sm transition-colors ${
											isActive
												? "bg-foreground text-background"
												: "hover:bg-[var(--color-secondary-container)] hover:text-[var(--color-on-secondary-container)]"
										}`}
									>
										<span>{option.label}</span>
										{isActive && <span aria-hidden>•</span>}
									</YnsLink>
								</li>
							);
						})}
					</ul>
				</div>

				{categories && categories.data.length > 0 && (
					<div className="p-5">
						<h3 className="label-caps mb-4">Category</h3>
						<ul className="space-y-2">
							<li>
								<YnsLink
									prefetch="eager"
									href={buildHref(basePath, { ...keepParams, category: undefined })}
									className={`block px-2 py-1.5 text-sm transition-colors ${
										!currentCategory
											? "bg-foreground text-background"
											: "hover:bg-[var(--color-secondary-container)] hover:text-[var(--color-on-secondary-container)]"
									}`}
								>
									All categories
								</YnsLink>
							</li>
							{categories.data.map((cat) => {
								const isActive = currentCategory === cat.slug;
								return (
									<li key={cat.id}>
										<YnsLink
											prefetch="eager"
											href={buildHref(basePath, { ...keepParams, category: cat.slug })}
											className={`block px-2 py-1.5 text-sm transition-colors ${
												isActive
													? "bg-foreground text-background"
													: "hover:bg-[var(--color-secondary-container)] hover:text-[var(--color-on-secondary-container)]"
											}`}
										>
											{cat.name}
										</YnsLink>
									</li>
								);
							})}
						</ul>
					</div>
				)}
			</div>
		</aside>
	);
}
