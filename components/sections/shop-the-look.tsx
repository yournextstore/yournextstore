import { cacheLife } from "next/cache";
import Image from "next/image";
import { commerce } from "@/lib/commerce";
import { CURRENCY, LOCALE } from "@/lib/constants";
import { formatMoney } from "@/lib/money";
import { YNSImage } from "@/lib/yns-image";
import { YnsLink } from "../yns-link";

export async function ShopTheLook() {
	"use cache";
	cacheLife("minutes");

	const products = await commerce.productBrowse({ active: true, limit: 3 });

	return (
		<section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
			{/* Section heading */}
			<div className="text-center mb-12">
				<span className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground font-medium">
					Ultralight
				</span>
				<h2 className="text-2xl sm:text-3xl font-medium mt-3 mb-2">Shop The Look</h2>
				<p className="text-muted-foreground">Things that go well together</p>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
				{/* Left: Large look image */}
				<div className="relative aspect-[3/4] overflow-hidden bg-secondary">
					<Image
						src="/scraped-8.png"
						alt="Shop the look"
						fill
						className="object-cover"
						sizes="(max-width: 1024px) 100vw, 50vw"
					/>
				</div>

				{/* Right: Product cards */}
				<div className="grid grid-cols-1 gap-6">
					{products.data.map((product) => {
						const firstVariant = product.variants[0];
						const price = firstVariant
							? formatMoney({ amount: firstVariant.price, currency: CURRENCY, locale: LOCALE })
							: null;
						const allImages = [
							...product.images,
							...product.variants.flatMap((v) => v.images).filter((img) => !product.images.includes(img)),
						];
						const primaryImage = allImages[0];
						const secondaryImage = allImages[1];

						return (
							<YnsLink
								prefetch={"eager"}
								key={product.id}
								href={`/product/${product.slug}`}
								className="group flex gap-4 items-start"
							>
								<div className="relative w-28 h-36 shrink-0 bg-secondary overflow-hidden">
									{primaryImage && (
										<YNSImage
											src={primaryImage}
											alt={product.name}
											fill
											sizes="112px"
											className="object-cover transition-opacity duration-500 group-hover:opacity-0"
										/>
									)}
									{secondaryImage && (
										<YNSImage
											src={secondaryImage}
											alt={`${product.name} alternate`}
											fill
											sizes="112px"
											className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
										/>
									)}
								</div>
								<div className="pt-1">
									<h3 className="text-sm font-medium">{product.name}</h3>
									<p className="text-sm text-muted-foreground mt-1">{price}</p>
								</div>
							</YnsLink>
						);
					})}
				</div>
			</div>
		</section>
	);
}
