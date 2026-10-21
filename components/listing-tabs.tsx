import Link from "next/link";
import { getCategoryTiles } from "@/lib/catalog";
import { cn } from "@/lib/utils";

/**
 * The home page's category tabs as real links for the listing pages: "Everything", then the
 * top-level categories, the current one underlined in coral.
 */
export async function ListingTabs({
	activeSlug,
	children,
}: {
	activeSlug?: string;
	children?: React.ReactNode;
}) {
	const categories = await getCategoryTiles(8);
	const tabs = [
		{ href: "/products", label: "Everything", slug: undefined },
		...categories.map((c) => ({ href: c.href, label: c.name, slug: c.slug })),
	];

	return (
		<div className="mb-8 mt-12 flex flex-col gap-4 border-b border-line pb-4 md:flex-row md:items-end md:justify-between">
			<nav aria-label="Categories" className="flex flex-wrap gap-x-6 gap-y-3">
				{tabs.map((tab) => {
					const active = tab.slug === activeSlug;
					return (
						<Link
							key={tab.href}
							href={tab.href}
							aria-current={active ? "page" : undefined}
							className={cn(
								"caps -mb-px border-b-2 pb-1 text-[0.73rem] transition-colors",
								active ? "border-coral text-ink" : "border-transparent text-muted-foreground hover:text-ink",
							)}
						>
							{tab.label}
						</Link>
					);
				})}
			</nav>
			{children}
		</div>
	);
}
