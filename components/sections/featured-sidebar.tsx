import { cacheLife } from "next/cache";
import Image from "next/image";
import { commerce } from "@/lib/commerce";
import { CURRENCY, LOCALE } from "@/lib/constants";
import { formatMoney } from "@/lib/money";
import { YNSImage } from "@/lib/yns-image";
import { YnsLink } from "../yns-link";

export async function FeaturedSidebar() {
	"use cache";
	cacheLife("minutes");

	const products = (await commerce.productBrowse({ active: true, limit: 2 })).data;

	return (
		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
				{/* Left side: two product cards */}
				<div className="lg:col-span-1 space-y-4">
					{products.map((product) => {
						const variants = "variants" in product ? product.variants : null;
						const price = variants?.[0] ? BigInt(variants[0].price) : null;
						const primaryImage =
							product.images?.[0] ?? variants?.flatMap((v) => v.images ?? []).find(Boolean);

						return (
							<YnsLink
								prefetch={"eager"}
								key={product.id}
								href={`/product/${product.slug}`}
								className="group flex gap-3 p-3 border border-border hover:border-brand transition-colors"
							>
								<div className="relative w-20 h-20 flex-shrink-0 bg-secondary overflow-hidden">
									{primaryImage && (
										<YNSImage
											src={primaryImage}
											alt={product.name}
											fill
											sizes="80px"
											className="object-cover"
										/>
									)}
								</div>
								<div className="flex flex-col justify-center">
									<h4 className="text-sm font-medium text-foreground group-hover:text-brand transition-colors line-clamp-2">
										{product.name}
									</h4>
									{price !== null && (
										<p className="mt-1 text-sm font-bold text-brand">
											{formatMoney({ amount: price, currency: CURRENCY, locale: LOCALE })}
										</p>
									)}
								</div>
							</YnsLink>
						);
					})}
				</div>

				{/* Right side: promo image */}
				<div className="lg:col-span-3 relative overflow-hidden min-h-[280px]">
					<Image
						src="/scraped-7.png"
						alt="Premium automotive parts"
						fill
						className="object-cover"
						sizes="(max-width: 1024px) 100vw, 75vw"
					/>
					<div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
					<div className="relative z-10 h-full flex flex-col justify-center p-8 sm:p-12 max-w-md">
						<p className="font-heading text-brand text-sm font-semibold uppercase tracking-widest">
							MAKE HER
						</p>
						<h3 className="font-heading text-4xl sm:text-5xl font-bold text-white uppercase mt-1">SHINE</h3>
						<p className="mt-2 text-white/70 text-sm">Complete Clean Kit</p>
						<YnsLink
							prefetch={"eager"}
							href="/products"
							className="mt-4 inline-flex items-center justify-center self-start h-10 px-6 border border-white/30 text-white font-heading font-semibold uppercase text-xs tracking-wider hover:bg-white/10 transition-colors"
						>
							View Details
						</YnsLink>
					</div>

					{/* Yellow discount badge */}
					<div className="absolute top-4 right-4 z-10 bg-brand text-brand-foreground w-24 h-24 flex flex-col items-center justify-center transform rotate-12">
						<span className="font-heading text-xs font-bold uppercase">Get a</span>
						<span className="font-heading text-xs font-bold uppercase">Discount</span>
						<span className="font-heading text-2xl font-bold">30%</span>
						<span className="font-heading text-xs font-bold uppercase">OFF</span>
					</div>
				</div>
			</div>
		</section>
	);
}
