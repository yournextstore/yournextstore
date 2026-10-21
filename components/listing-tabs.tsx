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
		{ href: "/products", label: "All the goods", slug: undefined },
		...categories.map((c) => ({ href: c.href, label: c.name, slug: c.slug })),
	];

	return (
		<div className="mb-10 mt-10 flex flex-col gap-4 border-b border-line pb-5 md:flex-row md:items-center md:justify-between">
			<nav aria-label="Sections" className="flex flex-wrap gap-2">
				{tabs.map((tab) => {
					const active = tab.slug === activeSlug;
					return (
						<Link
							key={tab.href}
							href={tab.href}
							aria-current={active ? "page" : undefined}
							className={cn(
								"label-mono rounded-full border px-3.5 py-2 text-[0.66rem] transition-colors",
								active
									? "border-ink bg-ink text-foam"
									: "border-ink/25 text-dim hover:border-ink hover:text-ink",
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
