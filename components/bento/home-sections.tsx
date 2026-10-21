import { cacheLife } from "next/cache";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { commerce } from "@/lib/commerce";

async function getHomeProducts() {
	"use cache";
	cacheLife("minutes");
	const { data } = await commerce.productBrowse({ active: true, limit: 24 });
	// Photographed, priced products lead: the featured tiles are all picture, with a price chip on top,
	// so an image-less product or a set priced 0 belongs at the end of the marquee instead.
	const rank = (product: (typeof data)[number]) =>
		(product.images.length > 0 ? 0 : 2) + (product.variants.some((v) => Number(v.price) > 0) ? 0 : 1);
	return data.toSorted((a, b) => rank(a) - rank(b));
}

/** One large tile and two stacked halves: the reference's featured bento. */
export async function ThreeItemGrid() {
	const products = await getHomeProducts();
	const [first, second, third] = products;
	if (!first || !second || !third) return null;

	return (
		<section
			aria-label="Featured products"
			className="mx-auto grid max-w-(--breakpoint-2xl) gap-4 px-4 pb-4 md:grid-cols-6 md:grid-rows-2 lg:max-h-[calc(100vh-200px)]"
		>
			<div className="md:col-span-4 md:row-span-2">
				<div className="relative aspect-square h-full w-full">
					<ProductCard
						product={first}
						priority
						labelPosition="center"
						sizes="(min-width: 768px) 66vw, 100vw"
					/>
				</div>
			</div>
			{[second, third].map((product, index) => (
				<div key={product.id} className="md:col-span-2 md:row-span-1">
					<div className="relative aspect-square h-full w-full">
						<ProductCard product={product} priority={index === 0} sizes="(min-width: 768px) 33vw, 100vw" />
					</div>
				</div>
			))}
		</section>
	);
}

/** Endless marquee of the rest of the catalogue; the list is tripled so the loop never runs dry. */
export async function Carousel() {
	const products = (await getHomeProducts()).slice(3);
	if (products.length === 0) return null;

	const copies = [0, 1, 2];

	return (
		<section aria-label="More products" className="w-full overflow-x-auto pt-1 pb-6">
			<ul className="animate-carousel flex w-max">
				{copies.flatMap((copy) =>
					products.map((product) => (
						<li
							key={`${copy}-${product.id}`}
							aria-hidden={copy > 0 ? true : undefined}
							inert={copy > 0 ? true : undefined}
							className="relative aspect-square h-[30vh] max-h-[275px] w-[66vw] max-w-[475px] flex-none pr-4 md:w-[33vw]"
						>
							<ProductCard product={product} sizes="(min-width: 768px) 33vw, 66vw" />
						</li>
					)),
				)}
			</ul>
			<p className="sr-only">
				<Link href="/products">Browse all products</Link>
			</p>
		</section>
	);
}
