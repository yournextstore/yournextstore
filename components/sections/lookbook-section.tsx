import { cacheLife } from "next/cache";
import Image from "next/image";
import { YnsLink } from "@/components/yns-link";
import { commerce } from "@/lib/commerce";
import { CURRENCY, LOCALE } from "@/lib/constants";
import { formatMoney } from "@/lib/money";
import { YNSImage } from "@/lib/yns-image";

const lookbooks = [
	{
		title: "Curated Workspace",
		label: "Collection",
		image: "/scraped-8.png",
	},
	{
		title: "Everyday Carry",
		label: "Collection",
		image: "/scraped-9.png",
	},
];

export async function LookbookSection() {
	"use cache";
	cacheLife("minutes");

	const products = await commerce.productBrowse({ active: true, limit: 8 });
	const firstFour = products.data.slice(0, 4);
	const secondFour = products.data.slice(4, 8);
	const productSets = [firstFour, secondFour];

	return (
		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
			<h2 className="font-heading text-2xl sm:text-3xl font-light tracking-wider text-center mb-12 uppercase">
				Shop by Collection
			</h2>

			{lookbooks.map((lookbook, setIndex) => {
				const setProducts = productSets[setIndex] ?? [];
				return (
					<div
						key={lookbook.title}
						className={`grid grid-cols-1 lg:grid-cols-2 gap-8 ${setIndex > 0 ? "mt-16" : ""}`}
					>
						{/* Lookbook image - alternates sides */}
						<div className={`relative ${setIndex % 2 === 1 ? "lg:order-2" : ""}`}>
							<div className="aspect-square relative bg-secondary overflow-hidden">
								<Image
									src={lookbook.image}
									alt={lookbook.title}
									fill
									className="object-cover"
									sizes="(max-width: 1024px) 100vw, 50vw"
								/>
							</div>
							<div className="mt-4">
								<h3 className="font-heading text-xl font-light tracking-wider">{lookbook.title}</h3>
								<span className="text-xs tracking-[0.2em] uppercase text-muted-foreground">
									{lookbook.label}
								</span>
							</div>
						</div>

						{/* Products grid */}
						<div className={`grid grid-cols-2 gap-4 ${setIndex % 2 === 1 ? "lg:order-1" : ""}`}>
							{setProducts.map((product) => {
								const variants = "variants" in product ? product.variants : null;
								const firstVariantPrice = variants?.[0] ? BigInt(variants[0].price) : null;
								const price = firstVariantPrice
									? formatMoney({ amount: firstVariantPrice, currency: CURRENCY, locale: LOCALE })
									: null;

								const allImages = [
									...(product.images ?? []),
									...(variants
										?.flatMap((v) => v.images ?? [])
										.filter((img) => !(product.images ?? []).includes(img)) ?? []),
								];

								return (
									<YnsLink
										prefetch={"eager"}
										key={product.id}
										href={`/product/${product.slug}`}
										className="group"
									>
										<div className="relative aspect-square bg-secondary overflow-hidden">
											{allImages[0] && (
												<YNSImage
													src={allImages[0]}
													alt={product.name}
													fill
													sizes="(max-width: 640px) 50vw, 25vw"
													className="object-cover transition-opacity duration-500 group-hover:opacity-0"
												/>
											)}
											{allImages[1] && (
												<YNSImage
													src={allImages[1]}
													alt={`${product.name} alt`}
													fill
													sizes="(max-width: 640px) 50vw, 25vw"
													className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
												/>
											)}
										</div>
										<div className="mt-3 space-y-0.5">
											<h4 className="text-sm font-normal">{product.name}</h4>
											{price && <p className="text-sm text-muted-foreground">{price}</p>}
										</div>
									</YnsLink>
								);
							})}
						</div>
					</div>
				);
			})}
		</section>
	);
}
