import type { Metadata } from "next";
import Link from "next/link";
import {
	MenuChips,
	MenuGrid,
	MenuLayout,
	MenuSearch,
	MenuSidebar,
	SectionHeader,
	SectionLink,
} from "@/components/menu";
import { ProductCard } from "@/components/product-card";
import { Hero } from "@/components/sections/hero";
import { Newsletter } from "@/components/sections/newsletter";
import { getMenuSections, getMostOrdered } from "@/lib/catalog";
import { getStoreSeo, meGetCached } from "@/lib/commerce";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

const SECTION_LIMIT = 6;

export default async function Home() {
	// All cached reads: the whole catalog is part of the prerendered page, with no streamed
	// sections that could shift the grid after first paint.
	const [{ storeName }, sections, mostOrdered, me] = await Promise.all([
		getStoreSeo(),
		getMenuSections(),
		getMostOrdered(),
		meGetCached().catch(() => null),
	]);
	const newsletterEnabled = me?.store.settings?.enabledTools?.newsletter ?? false;

	const anchors = [
		...(mostOrdered.length > 0 ? [{ href: "#most-loved", label: "Most loved" }] : []),
		...sections.map((section) => ({ href: `#category-${section.id}`, label: section.name })),
	];

	return (
		<>
			<Hero storeName={storeName} />
			<MenuLayout
				id="shop"
				leading={<MenuSidebar links={anchors.map((a, i) => ({ ...a, current: i === 0 }))} />}
			>
				<MenuSearch />
				<MenuChips links={anchors.map((a, i) => ({ ...a, current: i === 0 }))} />

				{mostOrdered.length > 0 && (
					<section id="most-loved" aria-labelledby="most-loved-title">
						<SectionHeader
							id="most-loved-title"
							title="Most loved"
							action={
								<SectionLink href="#all-categories" label="See all, jump to every category">
									See all
								</SectionLink>
							}
						/>
						<MenuGrid>
							{mostOrdered.map((product, index) => (
								<ProductCard key={product.id} product={product} priority={index < 2} showSummary={false} />
							))}
						</MenuGrid>
					</section>
				)}

				{sections.length > 0 && (
					<section id="all-categories" aria-labelledby="all-categories-title" className="mt-12">
						<h2
							id="all-categories-title"
							className="mb-1 font-display text-heading-lg font-semibold leading-[1.1]"
						>
							Shop by category
						</h2>
						{sections.map((section) => (
							<a
								key={section.id}
								href={`#category-${section.id}`}
								className="flex min-h-11 items-center justify-between border-b border-border text-body-sm transition-colors hover:text-primary"
							>
								<span>{section.name}</span>
								<span className="text-muted-foreground">
									{section.productCount} {section.productCount === 1 ? "item" : "items"}
								</span>
							</a>
						))}
					</section>
				)}

				<div className="mt-12 flex flex-col gap-12">
					{sections.map((section) => {
						const shown = section.products.slice(0, SECTION_LIMIT);
						// Two columns on phones: an odd last card would sit alone, so it waits for "View all".
						const oddOnPhones = shown.length > 1 && shown.length % 2 === 1;
						return (
							<section key={section.id} id={`category-${section.id}`} aria-labelledby={`title-${section.id}`}>
								<SectionHeader
									id={`title-${section.id}`}
									title={section.name}
									description={section.description}
									action={
										section.productCount > SECTION_LIMIT || oddOnPhones ? (
											<SectionLink href={`/category/${section.path}`}>View all</SectionLink>
										) : null
									}
								/>
								<MenuGrid>
									{shown.map((product, index) =>
										oddOnPhones && index === shown.length - 1 ? (
											<div key={product.id} className="max-lg:hidden">
												<ProductCard product={product} />
											</div>
										) : (
											<ProductCard key={product.id} product={product} />
										),
									)}
								</MenuGrid>
							</section>
						);
					})}
				</div>

				{sections.length === 0 && mostOrdered.length === 0 && (
					<p className="py-16 text-body-md text-muted-foreground">
						Fresh bakes are on their way. <Link href="/products">Browse everything</Link>.
					</p>
				)}
			</MenuLayout>
			{newsletterEnabled && <Newsletter />}
		</>
	);
}
