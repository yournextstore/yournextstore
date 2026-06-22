import Image from "next/image";
import { ProductFeatures } from "@/app/product/[slug]/product-features";
import { TrustBadges } from "@/app/product/[slug]/trust-badges";
import { CURRENCY, LOCALE } from "@/lib/constants";
import type { DemoProduct } from "@/lib/demo-products";
import { formatMoney } from "@/lib/money";

export function PreviewProductDetails({ product }: { product: DemoProduct }) {
	const variant = product.variants[0];
	const priceDisplay = variant
		? formatMoney({ amount: BigInt(variant.price), currency: CURRENCY, locale: LOCALE })
		: "";
	const image = product.images[0] ?? "/scraped-0.jpg";

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
			<div className="lg:grid lg:grid-cols-2 lg:gap-20">
				<div className="lg:sticky lg:top-28 lg:self-start">
					<div className="relative aspect-[4/5] overflow-hidden bg-[#e8dcc8] rounded-sm border border-border/40">
						<Image
							src={image}
							alt={product.name}
							fill
							sizes="(max-width: 1024px) 100vw, 50vw"
							className="object-cover"
							priority
						/>
					</div>
				</div>

				<div className="mt-10 lg:mt-0 space-y-10">
					{product.tag && <p className="text-[11px] tracking-luxe uppercase text-[#8b6b4a]">{product.tag}</p>}
					<div className="space-y-5">
						<h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-foreground leading-[1.05] text-balance">
							{product.name}
						</h1>
						<p className="text-2xl font-light tracking-tight">{priceDisplay}</p>
						<div className="h-px w-12 bg-[#c9a87c]" />
						<p className="text-base text-muted-foreground leading-[1.85]">{product.summary}</p>
						<p className="text-base text-muted-foreground leading-[1.85]">
							Hand-poured in our atelier and signed by the perfumer. Each numbered piece is cured for two
							weeks before it ships, so the fragrance arrives with the depth of a well-rested wine.
						</p>
					</div>

					<div className="space-y-6">
						<div className="flex items-center gap-3">
							<button
								type="button"
								disabled
								className="flex-1 h-14 bg-foreground text-background py-4 px-8 text-[11px] tracking-luxe uppercase font-medium opacity-70 cursor-not-allowed"
							>
								Add to bag — {priceDisplay}
							</button>
						</div>
						<p className="text-[10px] tracking-luxe uppercase text-muted-foreground text-center">
							Preview mode — checkout disabled
						</p>
					</div>

					<TrustBadges />

					<div className="border-t border-[#e8dcc8] pt-8">
						<h2 className="text-[11px] tracking-luxe uppercase text-[#8b6b4a] mb-4">Notes</h2>
						<dl className="grid grid-cols-3 gap-y-3 text-sm">
							<dt className="text-muted-foreground">Top</dt>
							<dd className="col-span-2 text-foreground">Bergamot, fig leaf</dd>
							<dt className="text-muted-foreground">Heart</dt>
							<dd className="col-span-2 text-foreground">Orris, vetiver</dd>
							<dt className="text-muted-foreground">Base</dt>
							<dd className="col-span-2 text-foreground">Sandalwood, tonka, amber</dd>
						</dl>
					</div>
				</div>
			</div>

			<ProductFeatures />
		</div>
	);
}
