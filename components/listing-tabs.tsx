import Link from "next/link";
import { getCategoryTiles } from "@/lib/catalog";
import { cn } from "@/lib/utils";

/**
 * The home page's category tabs as real links for the listing pages: "Everything", then the
 * top-level categories as chunky pills, the current one filled with ink.
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
		{ href: "/products", label: "Shop all", slug: undefined },
		...categories.map((c) => ({ href: c.href, label: c.name, slug: c.slug })),
	];

	return (
		<div className="mb-10 mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
			<nav aria-label="Sections" className="flex flex-wrap gap-2">
				{tabs.map((tab) => {
					const active = tab.slug === activeSlug;
					return (
						<Link
							key={tab.href}
							href={tab.href}
							aria-current={active ? "page" : undefined}
							className={cn(
								"rounded-full border-2 border-ink px-4 pb-1.5 pt-2 text-[1.05rem] font-bold transition-colors",
								active ? "bg-ink text-sun" : "text-ink hover:bg-ink/10",
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
