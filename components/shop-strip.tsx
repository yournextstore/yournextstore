import { cacheLife } from "next/cache";
import Link from "next/link";
import { commerce } from "@/lib/commerce";

async function getStripLinks() {
	"use cache";
	cacheLife("hours");
	const [categories, collections] = await Promise.all([
		commerce.categoriesBrowse({ active: true, limit: 50 }).catch(() => ({ data: [] })),
		commerce.collectionBrowse({ limit: 8 }).catch(() => ({ data: [] })),
	]);
	return [
		{ href: "/products", label: "All" },
		...categories.data
			.filter((category) => !category.parentId)
			.slice(0, 8)
			.map((category) => ({ href: `/category/${category.slug}`, label: category.name })),
		...collections.data
			.filter((c) => (c.productCollections?.length ?? 0) > 0 || (c.metafieldRules?.length ?? 0) > 0)
			.map((collection) => ({
				href: `/collection/${collection.slug}`,
				label: collection.name,
			})),
	];
}

/** The original's shop sub-nav: one centred row of plain links above a hairline. */
export async function ShopStrip({ current }: { current?: string }) {
	const links = await getStripLinks();
	return (
		<nav aria-label="Shop" className="border-b border-border">
			<ul className="m-auto flex flex-wrap items-center justify-center gap-x-6 gap-y-2 p-5">
				{links.map((link) => (
					<li key={link.href}>
						<Link
							href={link.href}
							aria-current={link.href === current ? "page" : undefined}
							className="underline-offset-4 hover:underline aria-[current=page]:underline"
						>
							{link.label}
						</Link>
					</li>
				))}
			</ul>
		</nav>
	);
}
