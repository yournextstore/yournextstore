import { ArrowRight } from "lucide-react";
import { cacheLife } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { formatMoney } from "../src/money";
import { ynsClient } from "../src/yns-client";

const currency = "USD";
const locale = "en-US";

function HeroSection() {
	return (
		<section className="relative overflow-hidden bg-secondary/30">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="py-16 sm:py-20 lg:py-28">
					<div className="max-w-2xl">
						<h1 className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-foreground">
							Curated essentials for modern living
						</h1>
						<p className="mt-6 text-lg sm:text-xl text-muted-foreground leading-relaxed">
							Discover our thoughtfully designed collection of premium products, crafted with care and built
							to last.
						</p>
						<div className="mt-10 flex flex-col sm:flex-row gap-4">
							<Link
								href="#products"
								className="inline-flex items-center justify-center gap-2 h-12 px-8 bg-foreground text-primary-foreground rounded-full text-base font-medium hover:bg-foreground/90 transition-colors"
							>
								Shop Collection
								<ArrowRight className="h-4 w-4" />
							</Link>
							<Link
								href="#about"
								className="inline-flex items-center justify-center gap-2 h-12 px-8 border border-border rounded-full text-base font-medium hover:bg-secondary transition-colors"
							>
								Our Story
							</Link>
						</div>
					</div>
				</div>
			</div>
			{/* Subtle decorative element */}
			<div className="absolute top-1/2 right-0 -translate-y-1/2 w-1/3 h-full bg-gradient-to-l from-secondary/50 to-transparent pointer-events-none hidden lg:block" />
		</section>
	);
}

async function ProductGrid() {
	"use cache";
	cacheLife("seconds");

	const products = await ynsClient.productBrowse({ active: true, limit: 6 });

	return (
		<section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
			<div className="flex items-end justify-between mb-12">
				<div>
					<h2 className="text-2xl sm:text-3xl font-medium text-foreground">Featured Products</h2>
					<p className="mt-2 text-muted-foreground">Handpicked favorites from our collection</p>
				</div>
				<Link
					href="/products"
					className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
				>
					View all
					<ArrowRight className="h-4 w-4" />
				</Link>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
				{products.data.map((product) => {
					const prices = product.variants.map((v) => BigInt(v.price));
					const minPrice = prices.length > 0 ? prices.reduce((a, b) => (a < b ? a : b)) : 0n;
					const maxPrice = prices.length > 0 ? prices.reduce((a, b) => (a > b ? a : b)) : 0n;

					const priceDisplay =
						prices.length > 1 && minPrice !== maxPrice
							? `${formatMoney({ amount: minPrice, currency, locale })} - ${formatMoney({ amount: maxPrice, currency, locale })}`
							: formatMoney({ amount: minPrice, currency, locale });

					const allImages = [
						...product.images,
						...product.variants.flatMap((v) => v.images).filter((img) => !product.images.includes(img)),
					];
					const primaryImage = allImages[0];
					const secondaryImage = allImages[1];

					return (
						<Link key={product.id} href={`/product/${product.slug}`} className="group">
							<div className="relative aspect-square bg-secondary rounded-2xl overflow-hidden mb-4">
								{primaryImage && (
									<Image
										src={primaryImage}
										alt={product.name}
										fill
										sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
										className="object-cover transition-opacity duration-500 group-hover:opacity-0"
									/>
								)}
								{secondaryImage && (
									<Image
										src={secondaryImage}
										alt={`${product.name} - alternate view`}
										fill
										sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
										className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
									/>
								)}
							</div>
							<div className="space-y-1">
								<h3 className="text-base font-medium text-foreground">{product.name}</h3>
								<p className="text-base font-semibold text-foreground">{priceDisplay}</p>
							</div>
						</Link>
					);
				})}
			</div>

			<div className="mt-12 text-center sm:hidden">
				<Link
					href="/products"
					className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
				>
					View all products
					<ArrowRight className="h-4 w-4" />
				</Link>
			</div>
		</section>
	);
}

export default function Home() {
	return (
		<main>
			<HeroSection />
			<ProductGrid />
		</main>
	);
}
