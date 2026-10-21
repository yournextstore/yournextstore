import Link from "next/link";
import { getCategoryTiles } from "@/lib/catalog";

/**
 * The booking card's chip row as the listing's shelf switcher: "Everything", then the top-level
 * categories, the current one filled gold.
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
		<div className="mb-10 flex flex-col gap-4 border-y border-line py-4 lg:flex-row lg:items-center lg:justify-between">
			<nav aria-label="Shelves" className="flex flex-wrap gap-2">
				{tabs.map((tab) => (
					<Link
						key={tab.href}
						href={tab.href}
						aria-current={tab.slug === activeSlug ? "page" : undefined}
						className="chip"
					>
						{tab.label}
					</Link>
				))}
			</nav>
			{children}
		</div>
	);
}
