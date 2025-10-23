import { cacheLife } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { formatMoney } from "@/money";
import { ynsClient } from "@/yns-client";

const currency = "USD";
const locale = "en-US";

export default async function Home() {
	"use cache";
	cacheLife("seconds");

	console.log("Fetching products...");
	const products = await ynsClient.productBrowse({ active: true, limit: 4 });
	console.log({ products: products.meta });
	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
							<div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-3">
								{image && (
									<Image
										src={image}
										alt={product.name}
										width={400}
										height={400}
										className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
									/>
								)}
							</div>
							<div className="space-y-1">
								<h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
								{product.summary && <p className="text-sm text-gray-500">{product.summary}</p>}
								<p className="text-sm font-semibold text-gray-900">{priceDisplay}</p>
							</div>
						</Link>
					);
				})}
			</div>
		</div>
	);
}
