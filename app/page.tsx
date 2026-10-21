import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { type GridItem, ModuleGrid } from "@/components/modules/module-grid";
import { ProductHero } from "@/components/modules/product-hero";
import { getCollectionTiles, heroPick, picturedFirst } from "@/lib/catalog";
import { colorThemeAt } from "@/lib/color-theme";
import { commerce } from "@/lib/commerce";

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

async function getHomeData() {
	"use cache";
	cacheLife("minutes");
	const [products, collections] = await Promise.all([
		commerce
			.productBrowse({ active: true, limit: 24 })
			.then((result) => picturedFirst(result.data))
			.catch(() => []),
		getCollectionTiles(3),
	]);
	return { products, collections };
}

export default async function Home() {
	const { products, collections } = await getHomeData();
	const heroProduct = heroPick(products);
	const rest = products.filter((product) => product !== heroProduct);
	// Half-width cells are dealt from one queue so every run between the wide modules fills whole
	// rows: a missing collection is replaced by the next product, and an odd leftover is dropped.
	const queue = [...rest];
	const nextProduct = (imageOnly = false): GridItem[] => {
		const product = queue.shift();
		return product ? [{ kind: "product", key: product.id, product, imageOnly }] : [];
	};
	const collectionOr = (index: number): GridItem[] => {
		const tile = collections[index];
		return tile
			? [{ kind: "collection", key: tile.id, ...tile, theme: colorThemeAt(index * 2) }]
			: nextProduct();
	};
	const evenRun = (cells: GridItem[]) => cells.slice(0, cells.length - (cells.length % 2));

	// The original's home: a run of product cards broken up by a photograph with a statement,
	// collections cut into shapes and one large callout, all on the staggered two-column grid.
	const opening = evenRun([...nextProduct(true), ...nextProduct()]);
	const middle = evenRun([...nextProduct(), ...collectionOr(0), ...nextProduct(), ...collectionOr(1)]);
	const closing = evenRun([...nextProduct(), ...nextProduct(), ...nextProduct(), ...collectionOr(2)]);
	const items: GridItem[] = [
		...opening,
		{
			kind: "callToAction",
			key: "cta",
			title: "Colour for every shelf.",
			body: "Terrazzo trays, glazed plates, twisted candles and tufted cushions in bold pastels: a few cheerful things for the table, the windowsill and the sofa.",
			link: { href: "/about", label: "Our story" },
			image: "/images/pexels/sunglasses-pink.jpg",
		},
		...middle,
		{
			kind: "callout",
			key: "callout",
			text: "Bright, useful and made to be used every day.",
			link: { href: "/products", label: "Shop all products" },
			color: colorThemeAt(0).text,
		},
		...closing,
	];

	return (
		<>
			<section
				data-flush
				className="flex flex-col items-center rounded-b-xl bg-peach px-4 pt-24 pb-4 md:px-8 md:pt-34 md:pb-8"
			>
				<h1 className="mb-7 max-w-[60rem] whitespace-pre-line text-center text-ui-3xl md:text-ui-5xl">
					{"Good things.\nNo clutter."}
				</h1>
				<Link
					href="/products"
					className="flex h-10 items-center rounded-full bg-offblack px-4 text-ui-sm font-bold text-white duration-200 hover:opacity-80"
				>
					Shop all products
				</Link>
				{heroProduct && (
					<div className="mt-6 w-full md:mt-12">
						<ProductHero product={heroProduct} priority />
					</div>
				)}
			</section>
			<div className="mt-24 mb-32 px-4 md:px-8">
				<ModuleGrid items={items} />
			</div>
		</>
	);
}
