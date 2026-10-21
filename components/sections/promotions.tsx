import { cacheLife } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { getCatalogCategories, getPromoProducts, mainImage } from "@/lib/catalog";
import { sentenceCase } from "@/lib/display";
import { formatMoney } from "@/lib/money";
import { displayPrice } from "@/lib/pricing";
import { getStoreConfig } from "@/lib/store-config";
import { YNSMedia } from "@/lib/yns-media";
import bannerImage from "@/public/images/pexels/handbag-accessories.jpg";

async function getPromotionData() {
	"use cache";
	cacheLife("minutes");
	const [categories, products, { currency, locale, taxBehavior }] = await Promise.all([
		getCatalogCategories(),
		getPromoProducts(),
		getStoreConfig(),
	]);
	const tiles = products.map((product) => {
		const variant = product.variants[0];
		const price = variant ? BigInt(displayPrice(variant, taxBehavior)) : null;
		const list = variant ? BigInt(displayPrice(variant, taxBehavior, "originalPrice") ?? 0) : null;
		return {
			name: product.name,
			slug: product.slug,
			image: mainImage(product.images),
			price: price ? formatMoney({ amount: price, currency, locale }) : null,
			compareAt: price && list && list > price ? formatMoney({ amount: list, currency, locale }) : null,
		};
	});
	return { lead: categories[0] ?? null, second: categories[1] ?? null, tiles };
}

/**
 * "Our Promotions Events": the original's four-tile bento (wide banner, two tall product
 * tiles, dark promo-code slab). Discount copy becomes the store's categories and products;
 * the promo-code slab becomes a link to the whole catalogue.
 */
export async function Promotions() {
	const { lead, second, tiles } = await getPromotionData();
	if (!lead && tiles.length === 0) return null;
	const [first, other] = tiles;

	return (
		<section className="bg-card">
			<div className="mx-auto flex flex-col items-center px-4 py-10 md:container">
				<p className="mb-4 text-sm font-bold uppercase text-violet">Featured</p>
				<h2 className="mb-6 text-center text-kara-section font-bold text-black md:text-kara-section-lg">
					Our Featured Picks
				</h2>
				<div className="grid w-full max-w-[1150px] grid-cols-2 gap-3 md:grid-cols-4">
					{lead && (
						<Link
							href={`/category/${lead.slug}`}
							className="group relative col-span-2 flex min-h-48 overflow-hidden bg-stone md:min-h-56"
						>
							<div className="relative z-10 flex flex-1 flex-col justify-center px-5 md:px-10">
								<span className="text-lg font-extrabold uppercase leading-tight tracking-wide text-neutral-900 [overflow-wrap:anywhere] sm:text-2xl md:text-3xl">
									{lead.name}
								</span>
								<span className="mt-1 text-sm tracking-wide text-neutral-800 md:text-lg">
									{lead.count} {lead.count === 1 ? "piece" : "pieces"} in the shop
								</span>
							</div>
							<div className="relative w-2/5 shrink-0">
								<Image
									src={bannerImage}
									placeholder="blur"
									alt=""
									fill
									sizes="(max-width: 768px) 40vw, 240px"
									className="object-cover transition duration-500 group-hover:scale-105"
								/>
							</div>
						</Link>
					)}
					{[first, other].map((tile, index) =>
						tile ? (
							<Link
								key={tile.slug}
								href={`/product/${tile.slug}`}
								className={`group flex flex-col overflow-hidden md:row-span-2 ${index === 0 ? "bg-sand" : "bg-stone"}`}
							>
								<div className="px-3 pt-4 md:px-5 md:pt-6">
									<span className="line-clamp-2 text-xs tracking-wide text-neutral-900 md:text-base">
										{tile.name}
									</span>
									<span className="mt-1 flex flex-wrap items-baseline gap-x-3 text-xs font-semibold text-neutral-900 md:text-lg">
										{tile.compareAt && <s className="font-normal text-neutral-700">{tile.compareAt}</s>}
										{tile.price}
									</span>
								</div>
								{tile.image && (
									<div className="relative mt-4 aspect-[4/5] w-full md:mt-auto">
										<YNSMedia
											src={tile.image}
											alt=""
											fill
											sizes="(max-width: 768px) 50vw, 280px"
											className="object-cover transition duration-500 group-hover:scale-105"
										/>
									</div>
								)}
							</Link>
						) : null,
					)}
					<div className="col-span-2 flex min-h-48 flex-col items-center justify-center gap-3 bg-ink px-5 py-8 text-center text-white md:min-h-56">
						<span className="text-2xl font-extrabold leading-tight [overflow-wrap:anywhere] md:text-4xl">
							{second ? `Discover ${sentenceCase(second.name)}` : "Discover the shop"}
						</span>
						<span className="text-xs uppercase tracking-wide md:text-sm">Browse every piece</span>
						<Link
							href={second ? `/category/${second.slug}` : "/products"}
							className="rounded-lg bg-neutral-700 px-6 py-2 text-xs font-bold uppercase tracking-[0.3em] text-white transition hover:bg-neutral-600 md:px-11 md:text-base"
						>
							Shop now
						</Link>
					</div>
				</div>
			</div>
		</section>
	);
}
