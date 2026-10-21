import { cacheLife } from "next/cache";
import Link from "next/link";
import { QuickAddButton } from "@/components/quick-add-button";
import { commerce } from "@/lib/commerce";
import { formatMoney } from "@/lib/money";
import { priceRange } from "@/lib/pricing";
import { getStoreConfig } from "@/lib/store-config";
import { isVideoUrl } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";

// Cached per category, not per product: every product page in a category shares one
// browse, and the current product is filtered out afterwards.
async function getCategoryProducts(categorySlug?: string) {
	"use cache";
	cacheLife("minutes");
	const { data } = await commerce.productBrowse({
		active: true,
		limit: 5,
		...(categorySlug ? { category: categorySlug } : {}),
	});
	return data;
}

const secondaryButton =
	"relative flex w-full items-center justify-center rounded-md border border-transparent bg-gray-100 px-8 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200";

/**
 * Penny's "Customers also bought": photo with the price on a dark gradient, the name, and a grey
 * Add to cart. Rendered without its own Suspense: it streams with the page, so it can't land
 * after the footer and push it down.
 */
export async function RelatedProducts({
	productId,
	categorySlug,
}: {
	productId: string;
	categorySlug?: string;
}) {
	const [products, { currency, locale, taxBehavior }] = await Promise.all([
		getCategoryProducts(categorySlug),
		getStoreConfig(),
	]);
	const related = products.filter((p) => p.id !== productId).slice(0, 4);
	if (related.length === 0) return null;

	return (
		<section aria-labelledby="related-heading" className="mt-10 border-t border-gray-200 py-16">
			<h2 id="related-heading" className="text-xl font-bold text-gray-900">
				Customers also bought
			</h2>
			<div className="mt-8 grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
				{related.map((product) => {
					const image = product.images.find((url) => !isVideoUrl(url));
					const { min } = priceRange(product.variants, taxBehavior);
					const single =
						product.variants.length === 1 && product.variants[0]?.stock !== 0 ? product.variants[0] : null;
					return (
						<div key={product.id}>
							<Link href={`/product/${product.slug}`} className="relative block">
								<div className="relative h-72 w-full overflow-hidden rounded-lg bg-gray-100">
									{image && (
										<YNSMedia
											src={image}
											alt=""
											fill
											sizes="(min-width: 1024px) 300px, (min-width: 640px) 50vw, 100vw"
											className="object-cover object-center"
										/>
									)}
								</div>
								<div className="relative mt-4">
									<h3 className="line-clamp-1 text-sm font-medium text-gray-900">{product.name}</h3>
								</div>
								<div className="absolute inset-x-0 top-0 flex h-72 items-end justify-end overflow-hidden rounded-lg p-4">
									<div
										aria-hidden="true"
										className="absolute inset-x-0 bottom-0 h-36 bg-linear-to-t from-black opacity-50"
									/>
									<p className="relative text-lg font-semibold text-white">
										{product.variants.length > 0 ? formatMoney({ amount: min, currency, locale }) : null}
									</p>
								</div>
							</Link>
							<div className="mt-6">
								{single ? (
									<QuickAddButton
										className={secondaryButton}
										variantId={single.id}
										variantSku={single.sku}
										variantPrice={single.price}
										variantPriceGross={single.priceGross}
										variantImages={single.images}
										product={{
											id: product.id,
											name: product.name,
											slug: product.slug,
											images: product.images,
										}}
									/>
								) : (
									<Link href={`/product/${product.slug}`} className={secondaryButton}>
										Choose options<span className="sr-only">, {product.name}</span>
									</Link>
								)}
							</div>
						</div>
					);
				})}
			</div>
		</section>
	);
}
