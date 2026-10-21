import { cacheLife } from "next/cache";
import Link from "next/link";
import { getHeroProduct } from "@/lib/catalog";
import { meGetCached } from "@/lib/commerce";
import { formatMoney } from "@/lib/money";
import { priceRange } from "@/lib/pricing";
import { getStoreConfig } from "@/lib/store-config";
import { YNSMedia } from "@/lib/yns-media";

async function getHeroData() {
	"use cache";
	cacheLife("minutes");
	const [product, config, me] = await Promise.all([
		getHeroProduct(),
		getStoreConfig(),
		meGetCached().catch(() => null),
	]);
	if (!product) return null;
	const { min } = priceRange(product.variants, config.taxBehavior);
	return {
		product,
		from: formatMoney({ amount: min, currency: config.currency, locale: config.locale }),
		year: new Date().getFullYear(),
		storeName: me?.store.settings?.storeName || me?.store.name || "",
	};
}

/**
 * The original's powder-blue hero: a tagged kicker, the piece's name in wide-tracked caps-height type,
 * "FROM" price and an outlined "Shop Now", with the piece floating over a white disc on the right.
 */
export async function Hero() {
	const data = await getHeroData();
	if (!data) return null;
	const { product, from, year, storeName } = data;
	const image = product.images[0];

	return (
		<section className="flex flex-col bg-sky p-6 pb-10 lg:flex-row">
			<div className="flex flex-col pt-4 pl-2 sm:pt-12 sm:pl-12 lg:max-w-[46%]">
				<div className="mb-10 border-l border-[#1a202c] px-3 pt-1">
					<p className="text-xs leading-tight tracking-wider uppercase">
						{product.category?.name ?? "Featured"}
					</p>
					<p className="text-xs leading-tight tracking-wider">{year}</p>
				</div>
				<h1 className="text-4xl leading-[1.05] font-medium tracking-[0.12em] text-[#1f2933] xl:text-5xl">
					{product.name}
				</h1>
				<p className="py-6 tracking-wide">FROM {from}</p>
				<div>
					<Link href={`/product/${product.slug}`} className="jam-btn">
						Shop Now
					</Link>
				</div>
				{storeName && (
					<div className="mt-6 flex flex-1 flex-col justify-end pb-4 lg:pb-10">
						<p className="mb-1 text-xs leading-tight font-light tracking-tight">Curated by</p>
						<p className="text-[0.7rem] leading-tight font-semibold tracking-tight">{storeName}</p>
					</div>
				)}
			</div>
			<div className="relative mt-6 flex min-h-[18rem] flex-1 items-center justify-center lg:mt-0 lg:min-h-[28rem]">
				<div
					aria-hidden
					className="absolute h-48 w-48 rounded-full bg-white sm:h-72 sm:w-72 xl:h-88 xl:w-88"
				/>
				{image && (
					<div className="jam-hero-piece relative z-10 aspect-square w-[min(88%,26rem)] xl:w-[30rem]">
						<YNSMedia
							src={image}
							alt={product.name}
							fill
							priority
							sizes="(max-width: 1024px) 88vw, 30rem"
							className="object-cover"
						/>
					</div>
				)}
			</div>
		</section>
	);
}
