import Image from "next/image";
import Link from "next/link";
import type { ShelfCard } from "@/lib/catalog";
import { cn } from "@/lib/utils";

/** The listing's top row of big rounded portraits (Horizon's category heroes). */
export function FeatureRow({ cards, activeHref }: { cards: ShelfCard[]; activeHref?: string }) {
	if (cards.length === 0) return null;
	return (
		<ul className="-mx-6 mt-4 flex snap-x snap-mandatory scroll-px-6 gap-6 overflow-x-auto px-6 pb-2 lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-4 lg:overflow-visible lg:px-0 lg:pb-0">
			{cards.map((card) => {
				const active = card.href === activeHref;
				return (
					<li key={card.href} className="w-[54vw] max-w-[17rem] shrink-0 snap-start lg:w-auto lg:max-w-none">
						<Link href={card.href} aria-current={active ? "page" : undefined} className="group block">
							<div className="relative aspect-[1104/1230] overflow-hidden rounded-image bg-sand">
								<Image
									src={card.image}
									alt=""
									fill
									sizes="(max-width: 1024px) 54vw, 33vw"
									className={cn(
										"object-cover transition-transform duration-500 group-hover:scale-105",
										active && "scale-110 group-hover:scale-110",
									)}
								/>
							</div>
							<h2 className="mt-3 text-label font-semibold text-ink lg:mt-4">{card.title}</h2>
						</Link>
					</li>
				);
			})}
		</ul>
	);
}

type NavEntry = { href: string; label: string };

/** Sidebar list: "All products" plus each collection and category, the current one in semibold. */
export function SideNav({ entries, active }: { entries: NavEntry[]; active: string }) {
	return (
		<nav aria-label="Shop" className="hidden lg:block">
			<ul className="space-y-2.5">
				{entries.map((entry) => {
					const isActive = entry.href === active;
					return (
						<li key={entry.href}>
							<Link
								href={entry.href}
								aria-current={isActive ? "page" : undefined}
								className={cn(
									"text-copy text-ink transition-opacity hover:opacity-70",
									isActive && "font-semibold",
								)}
							>
								{entry.label}
							</Link>
						</li>
					);
				})}
			</ul>
		</nav>
	);
}

export function shopEntries(facets: {
	collections: { slug: string; name: string }[];
	categories: { slug: string; name: string }[];
}): NavEntry[] {
	return [
		{ href: "/products", label: "All products" },
		...facets.collections.map((c) => ({ href: `/collection/${c.slug}`, label: c.name })),
		...facets.categories.map((c) => ({ href: `/category/${c.slug}`, label: c.name })),
	];
}

/** "ALL PRODUCTS (15)": the caps count label above the grid. */
export function CountLabel({ label, count }: { label: string; count: number }) {
	return (
		<p className="caps text-fine font-medium text-ink">
			{label} ({count})
		</p>
	);
}
