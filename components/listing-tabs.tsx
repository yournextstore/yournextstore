import Link from "next/link";
import { getCategoryTiles } from "@/lib/catalog";

/** The desk's mono chips as listing filters: "Everything", then the top-level categories. */
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
		<div className="mb-8 mt-10 flex flex-col gap-4 border-b border-line pb-5 md:flex-row md:items-center md:justify-between">
			<nav aria-label="Categories" className="flex min-w-0 flex-wrap gap-2">
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
