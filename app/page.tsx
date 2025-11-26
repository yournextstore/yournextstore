import { cacheLife } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { formatMoney } from "../src/money";
import { ynsClient } from "../src/yns-client";

const currency = "USD";
const locale = "en-US";

export default async function Home() {
	"use cache";
	cacheLife("seconds");

	const products = await ynsClient.productBrowse({ active: true, limit: 4 });

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
				{products.data.map((product) => {
					const prices = product.variants.map((v) => BigInt(v.price));
					const minPrice = prices.length > 0 ? prices.reduce((a, b) => (a < b ? a : b)) : 0n;
					const maxPrice = prices.length > 0 ? prices.reduce((a, b) => (a > b ? a : b)) : 0n;

					const priceDisplay =
						prices.length > 1 && minPrice !== maxPrice
							? `${formatMoney({ amount: minPrice, currency, locale })} - ${formatMoney({ amount: maxPrice, currency, locale })}`
							: formatMoney({ amount: minPrice, currency, locale });

					const image = product.images[0] ?? product.variants[0]?.images[0];

					return (
						<Link key={product.id} href={`/product/${product.slug}`} className="group">
							<div className="relative aspect-square bg-secondary rounded-2xl overflow-hidden mb-4">
								{image && (
									<Image
										src={image}
										alt={product.name}
										fill
										sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
										className="object-cover transition-transform duration-500 group-hover:scale-105"
									/>
								)}
								<div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
							</div>
							<div className="space-y-1">
								<h3 className="text-base font-medium text-foreground">{product.name}</h3>
								<p className="text-base font-semibold text-foreground">{priceDisplay}</p>
							</div>
						</Link>
					);
				})}
			</div>
		</div>
	);
}
