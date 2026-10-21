import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { About } from "@/components/sections/about";
import { CatalogStrip } from "@/components/sections/catalog-strip";
import { HeroSlideshow, type Slide } from "@/components/sections/hero-slideshow";
import { Newsletter } from "@/components/sections/newsletter";
import { ProductGrid } from "@/components/sections/product-grid";
import { getCatalogEntries, getProductCount, getProducts } from "@/lib/catalog";
import { itemsLabel } from "@/lib/display";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

const SLIDE_PHOTOS = [
	"/images/pexels/hoodie-rack.jpg",
	"/images/pexels/canvas-sack.jpg",
	"/images/pexels/jeans-hangers.jpg",
] as const;

async function getHomeData() {
	"use cache";
	cacheLife("minutes");
	const [entries, products, count] = await Promise.all([
		getCatalogEntries(),
		getProducts(8),
		getProductCount(),
	]);
	// Slides: bundled editorial photographs (see NOTICE.md), each leading into a part of
	// the catalog; the last slide (or every slide, for a store without categories) opens the shop.
	const links = [
		...entries.slice(0, SLIDE_PHOTOS.length - 1).map((entry) => ({
			href: entry.href,
			title: entry.name,
			text: entry.note,
		})),
		{ href: "/products", title: "All products", text: itemsLabel(count) },
	];
	const slides: Slide[] = links.map((link, i) => ({
		href: link.href,
		image: SLIDE_PHOTOS[i % SLIDE_PHOTOS.length] ?? "/images/pexels/hoodie-rack.jpg",
		label: `Shop ${link.title}`,
		kicker: link.href === "/products" ? "The catalog" : "Shop by category",
		title: link.title,
		text: link.text,
	}));
	const strip = [
		...entries,
		{
			href: "/products",
			name: "All products",
			image: products[1]?.images[0] ?? products[0]?.images[0] ?? null,
			note: itemsLabel(count),
		},
	];
	return { slides, strip, products };
}

export default async function Home() {
	const { slides, strip, products } = await getHomeData();
	return (
		<>
			<h1 className="sr-only">Shop the catalog</h1>
			{slides.length > 0 && <HeroSlideshow slides={slides} />}
			<CatalogStrip entries={strip} />
			<ProductGrid title="Featured items" products={products} />
			<About />
			<Newsletter />
		</>
	);
}
