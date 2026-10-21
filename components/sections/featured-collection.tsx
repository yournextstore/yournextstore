import { cacheLife } from "next/cache";
import Link from "next/link";
import { getFilledCollections, getFreeShippingLabel, photographedFirst, plainText } from "@/lib/catalog";
import { commerce } from "@/lib/commerce";
import { formatMoney } from "@/lib/money";
import { priceRange } from "@/lib/pricing";
import { getStoreConfig } from "@/lib/store-config";

async function getFeatured() {
	"use cache";
	cacheLife("hours");
	const collections = await getFilledCollections();
	// The hero leads with the first collection; feature another one here when there is one.
	const candidates = [...collections.slice(1), ...collections.slice(0, 1)];
	const [{ currency, locale, taxBehavior }, freeShipping] = await Promise.all([
		getStoreConfig(),
		getFreeShippingLabel(),
	]);

	for (const collection of candidates) {
		const result = await commerce
			.productBrowse({ active: true, limit: 4, collection: collection.slug })
			.catch(() => null);
		if (result && result.data.length > 0) {
			return {
				slug: collection.slug,
				name: collection.name,
				description: plainText(collection.description),
				count: result.meta.count,
				freeShipping,
				items: photographedFirst(result.data).map((product) => ({
					slug: product.slug,
					name: product.name,
					price: product.variants.some((v) => Number(v.price) > 0)
						? formatMoney({ amount: priceRange(product.variants, taxBehavior).min, currency, locale })
						: null,
				})),
			};
		}
	}
	return null;
}

/** The original's pine "colophon" card, turned into a featured-collection block. */
export async function FeaturedCollection() {
	const featured = await getFeatured();
	if (!featured) return null;

	return (
		<section className="mx-auto max-w-6xl px-5 pb-4 sm:pb-8">
			<div className="grid gap-6 rounded-2xl border border-pine-deep bg-pine p-5 text-white sm:gap-10 sm:p-10 md:grid-cols-[1.2fr_1fr] md:items-center">
				<div>
					<p className="text-[13px] font-medium text-white/80">
						Featured collection · {featured.count} {featured.count === 1 ? "product" : "products"}
					</p>
					<h2 className="mt-3 font-display text-[clamp(26px,3.5vw,38px)] leading-tight font-bold tracking-tight">
						{featured.name}, up close.
					</h2>
					<p className="mt-4 max-w-[52ch] text-[15px] leading-relaxed text-white/90">
						{featured.description ||
							"A closer look at one of our collections, with everything in it a click away."}
					</p>
					<div className="mt-7 flex flex-wrap items-center gap-3">
						<Link
							href={`/collection/${featured.slug}`}
							className="rounded-md bg-white px-6 py-3.5 text-[15px] font-semibold text-pine hover:bg-white/90"
						>
							Shop {featured.name}
						</Link>
						<Link
							href="/products"
							className="rounded-md border border-white/50 px-6 py-3.5 text-[15px] font-semibold text-white hover:bg-white/10"
						>
							All products
						</Link>
						<Link
							href="/about"
							className="px-2 py-3.5 text-[15px] font-semibold text-white/90 underline decoration-white/50 underline-offset-4 hover:text-white"
						>
							About us
						</Link>
					</div>
				</div>
				<ol className="grid min-w-0 gap-3 rounded-xl bg-pine-deep/60 p-4 text-[14px] leading-relaxed sm:p-7">
					{featured.items.map((item, index) => (
						<li key={item.slug} className="flex min-w-0 gap-3">
							<span aria-hidden className="mt-0.5 text-white/75">
								{String(index + 1).padStart(2, "0")}
							</span>
							<Link
								href={`/product/${item.slug}`}
								className="min-w-0 hover:underline hover:underline-offset-4"
							>
								<strong className="font-semibold">{item.name}</strong>
								{item.price ? <span className="text-white/85"> — {item.price}</span> : null}
							</Link>
						</li>
					))}
					<li className="mt-2 flex items-center justify-between gap-3 rounded-md bg-black/25 px-4 py-2.5 font-mono text-[13px] text-white/90">
						<span>{featured.freeShipping ? "free_shipping_over=" : "products="}</span>
						<span className="text-white">{featured.freeShipping ?? featured.count}</span>
					</li>
				</ol>
			</div>
		</section>
	);
}
