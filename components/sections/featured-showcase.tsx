import { cacheLife } from "next/cache";
import Image from "next/image";
import { commerce } from "@/lib/commerce";
import { CURRENCY, LOCALE } from "@/lib/constants";
import { formatMoney } from "@/lib/money";
import { isVideoUrl } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";
import { YnsLink } from "../yns-link";

export async function FeaturedShowcase() {
	"use cache";
	cacheLife("minutes");

	const { data } = await commerce.productBrowse({ active: true, limit: 1 });
	const product = data[0];

	if (!product) {
		return null;
	}

	const minorPrice = product.variants[0] ? BigInt(product.variants[0].price) : BigInt(0);
	const price = formatMoney({ amount: minorPrice, currency: CURRENCY, locale: LOCALE });
	const heroMedia = product.images?.[0] ?? product.variants[0]?.images?.[0];

	return (
		<section className="bg-[#fbe5ea]">
			<div className="hayati-showcase">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-20 items-center">
					<YnsLink href={`/product/${product.slug}`} className="group block">
						<div className="relative aspect-[4/5] rounded-[28px] overflow-hidden bg-[#f4c2cb] shadow-[0_40px_80px_-40px_rgba(122,14,21,0.5)]">
							{heroMedia ? (
								isVideoUrl(heroMedia) ? (
									<video
										className="absolute inset-0 w-full h-full object-cover"
										src={heroMedia}
										muted
										loop
										autoPlay
										playsInline
									/>
								) : (
									<YNSMedia
										src={heroMedia}
										alt={product.name}
										fill
										sizes="(max-width: 1024px) 100vw, 50vw"
										className="object-cover transition-transform duration-700 group-hover:scale-105"
									/>
								)
							) : (
								<Image
									src="/scraped-2.jpg"
									alt={product.name}
									fill
									sizes="(max-width: 1024px) 100vw, 50vw"
									className="object-cover"
								/>
							)}
							<div className="absolute top-4 left-4 inline-flex items-center gap-2 bg-[#fffaf7] text-[#7a0e15] text-[10px] uppercase tracking-[0.25em] rounded-full px-3 py-1.5 font-semibold">
								<span className="hayati-star" /> Pantry favorite
							</div>
						</div>
					</YnsLink>

					<div className="lg:pl-4">
						<p className="text-[11px] uppercase tracking-[0.3em] text-[#b81e26] font-semibold mb-3">
							The signature blend
						</p>
						<h2 className="font-display italic text-4xl sm:text-5xl text-[#7a0e15] leading-tight">
							{product.name}
						</h2>
						<p className="mt-4 text-2xl font-medium text-[#7a0e15]">{price}</p>
						<p className="mt-2 text-sm text-[#7a0e15]/70">
							<u>Shipping</u> calculated at checkout.
						</p>
						<div className="mt-3 flex items-center gap-2 bg-white/60 rounded-lg px-3 py-2 max-w-md text-xs text-[#2b2120]">
							<span>
								Pay over time for orders over <b>$35.00</b> with
							</span>
							<span className="inline-flex items-center gap-1 rounded bg-[#5a31f4] text-white px-2 py-0.5 font-bold tracking-wide">
								shop <span className="font-light italic">Pay</span>
							</span>
						</div>
						<p className="mt-2 text-xs text-[#7a0e15]/70 underline cursor-default">Learn more</p>

						{product.summary && (
							<p className="mt-8 text-[15px] leading-relaxed text-[#2b2120]/80 max-w-md">{product.summary}</p>
						)}

						<YnsLink
							href={`/product/${product.slug}`}
							className="mt-8 inline-flex items-center justify-center h-12 px-8 rounded-full bg-[#b81e26] text-[#fbe5ea] text-sm font-medium tracking-wide hover:bg-[#7a0e15] transition-colors"
						>
							Add to pantry
						</YnsLink>
					</div>
				</div>
			</div>
		</section>
	);
}
