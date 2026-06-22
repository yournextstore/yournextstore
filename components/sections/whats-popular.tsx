import { cacheLife } from "next/cache";
import { commerce } from "@/lib/commerce";
import { CURRENCY, LOCALE } from "@/lib/constants";
import { formatMoney } from "@/lib/money";
import { YNSMedia } from "@/lib/yns-media";
import { YnsLink } from "../yns-link";

export async function WhatsPopular() {
	"use cache";
	cacheLife("minutes");

	const { data } = await commerce.productBrowse({ active: true, limit: 2 });

	const tileBgs = [
		{ ring: "bg-sky-gradient", inner: "bg-[var(--sky-soft)]" },
		{ ring: "bg-[var(--peach)]", inner: "bg-[var(--peach-light)]" },
	];

	return (
		<section className="px-3 sm:px-6 py-16 sm:py-24">
			<div className="max-w-7xl mx-auto">
				<div className="grid grid-cols-12 gap-8 items-center">
					{/* Left: heading + CTA */}
					<div className="col-span-12 md:col-span-6">
						<h2 className="font-display text-5xl sm:text-6xl lg:text-7xl tracking-tight text-[var(--ink)]">
							What&rsquo;s <em>Popular</em>
						</h2>
						<p className="mt-5 text-[15px] leading-relaxed text-[var(--ink)]/65 max-w-md">
							Crowd favorites, hand-picked by our community. Bold flavor, clean ingredients, and a kick of
							feel-good energy.
						</p>
						<YnsLink
							prefetch={"eager"}
							href="/products"
							className="mt-8 inline-flex items-center gap-2 bg-[var(--sky)] hover:bg-[#8fc5cd] text-[var(--ink)] px-7 py-3.5 rounded-full text-sm font-semibold tracking-wide transition-all"
						>
							See all
							<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
								<title>arrow</title>
								<path
									d="M5 12h14M13 5l7 7-7 7"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						</YnsLink>
					</div>

					{/* Right: two circular product tiles */}
					<div className="col-span-12 md:col-span-6 flex items-center justify-center md:justify-end gap-6 sm:gap-10">
						{data.slice(0, 2).map((product, i) => {
							const img = product.images?.[0] ?? product.variants?.[0]?.images?.[0];
							const tile = tileBgs[i % tileBgs.length] ?? tileBgs[0];
							const variantPrice = product.variants?.[0]?.price;
							return (
								<YnsLink
									key={product.id}
									prefetch={"eager"}
									href={`/product/${product.slug}`}
									className={`group relative ${tile?.ring} rounded-full w-44 sm:w-56 aspect-square flex items-center justify-center transition-transform hover:scale-[1.03]`}
								>
									<div
										className={`${tile?.inner} rounded-full w-[78%] h-[78%] flex items-center justify-center overflow-hidden relative shadow-inner`}
									>
										{img && (
											<YNSMedia
												src={img}
												alt={product.name}
												fill
												sizes="(max-width: 768px) 50vw, 200px"
												className="object-contain p-4"
											/>
										)}
									</div>
									<div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[var(--ink)] text-[var(--cream)] text-[11px] font-semibold tracking-wider uppercase px-3 py-1.5 rounded-full whitespace-nowrap">
										{product.name.length > 18 ? `${product.name.slice(0, 16)}…` : product.name}
										{variantPrice ? (
											<span className="ml-1.5 text-[var(--coral-soft)]">
												{formatMoney({ amount: BigInt(variantPrice), currency: CURRENCY, locale: LOCALE })}
											</span>
										) : null}
									</div>
								</YnsLink>
							);
						})}
					</div>
				</div>
			</div>
		</section>
	);
}
