import { cacheLife } from "next/cache";
import { YnsLink } from "@/components/yns-link";
import { commerce } from "@/lib/commerce";
import { CURRENCY, LOCALE } from "@/lib/constants";
import { formatMoney } from "@/lib/money";
import { YNSImage } from "@/lib/yns-image";

export async function FeaturedProduct() {
	"use cache";
	cacheLife("minutes");

	const products = await commerce.productBrowse({ active: true, limit: 1 });
	const product = products.data[0];

	if (!product) {
		return null;
	}

	const variants = "variants" in product ? product.variants : null;
	const firstVariantPrice = variants?.[0] ? BigInt(variants[0].price) : null;
	const price = firstVariantPrice
		? formatMoney({ amount: firstVariantPrice, currency: CURRENCY, locale: LOCALE })
		: null;

	const allImages = [
		...(product.images ?? []),
		...(variants?.flatMap((v) => v.images ?? []).filter((img) => !(product.images ?? []).includes(img)) ??
			[]),
	];

	return (
		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
			<h2 className="font-heading text-2xl sm:text-3xl font-light tracking-wider text-center mb-12 uppercase">
				Featured Product
			</h2>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
				{/* Image */}
				<div className="relative aspect-square bg-secondary overflow-hidden">
					{allImages[0] && (
						<YNSImage
							src={allImages[0]}
							alt={product.name}
							fill
							sizes="(max-width: 1024px) 100vw, 50vw"
							className="object-cover"
							priority
						/>
					)}
				</div>

				{/* Details */}
				<div className="space-y-6">
					<div>
						<span className="text-xs tracking-[0.2em] uppercase text-muted-foreground">Your Next Store</span>
						<h3 className="font-heading text-2xl sm:text-3xl font-light tracking-wider mt-2">
							{product.name}
						</h3>
						{price && <p className="text-lg mt-3">{price}</p>}
					</div>

					{product.summary && (
						<p className="text-sm text-muted-foreground leading-relaxed">{product.summary}</p>
					)}

					<YnsLink
						prefetch={"eager"}
						href={`/product/${product.slug}`}
						className="inline-block bg-foreground text-primary-foreground text-xs tracking-[0.2em] uppercase px-8 py-3.5 hover:opacity-90 transition-opacity"
					>
						View Product
					</YnsLink>
				</div>
			</div>
		</section>
	);
}
