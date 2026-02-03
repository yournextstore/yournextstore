import Image from "next/image";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { SearchForm } from "@/app/search/search-form";
import { MaterialIcon } from "@/components/icons/material-icon";
import { YnsLink } from "@/components/yns-link";
import { commerce } from "@/lib/commerce";
import { CURRENCY, LOCALE } from "@/lib/constants";
import { formatMoney } from "@/lib/money";
import { SearchPagination } from "./search-pagination";

const PRODUCTS_PER_PAGE = 12;

export async function generateMetadata({
	searchParams,
}: {
	searchParams: Promise<{ q?: string }>;
}): Promise<Metadata> {
	const { q } = await searchParams;
	return {
		title: q ? `Search: ${q} — Your Next Store` : "Search — Your Next Store",
		description: q ? `Search results for "${q}"` : "Search our store",
	};
}

type SearchPageProps = {
	searchParams: Promise<{ q?: string; page?: string }>;
};

async function SearchResults({ q, page }: { q?: string; page?: string }) {
	"use cache";
	cacheLife("minutes");

	const query = q?.trim() || "";
	const currentPage = Math.max(1, Number(page) || 1);
	const offset = (currentPage - 1) * PRODUCTS_PER_PAGE;

	const result = query
		? await commerce.productBrowse({
				query,
				active: true,
				limit: PRODUCTS_PER_PAGE,
				offset,
			})
		: { data: [], meta: { count: 0 } };

	const products = result.data;
	const totalPages = query ? Math.ceil(result.meta.count / PRODUCTS_PER_PAGE) : 0;

	return (
		<div className="min-h-screen bg-background-dark py-12">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Search Header */}
				<div className="text-center mb-12">
					<h1 className="text-3xl md:text-4xl font-bold text-white mb-6">Search Products</h1>
					<SearchForm initialQuery={query} />
				</div>

				{/* Results */}
				{query ? (
					<div>
						<p className="text-gray-400 mb-8">
							{result.meta.count} result{result.meta.count !== 1 ? "s" : ""} for &quot;{query}&quot;
						</p>

						{products.length > 0 ? (
							<>
								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
									{products.map((product) => {
										const variants = product.variants;
										const firstVariantPrice = variants?.[0] ? BigInt(variants[0].price) : null;
										const priceDisplay = firstVariantPrice
											? formatMoney({ amount: firstVariantPrice, currency: CURRENCY, locale: LOCALE })
											: null;

										const allImages = [
											...(product.images ?? []),
											...(variants
												?.flatMap((v) => v.images ?? [])
												.filter((img) => !(product.images ?? []).includes(img)) ?? []),
										];
										const primaryImage = allImages[0];

										return (
											<YnsLink
												key={product.id}
												prefetch="eager"
												href={`/product/${product.slug}`}
												className="group bg-dark-accent rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-all"
											>
												<div className="relative aspect-square bg-[#1a3c22] flex items-center justify-center">
													{primaryImage ? (
														<Image
															src={primaryImage}
															alt={product.name}
															fill
															sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
															className="object-cover group-hover:scale-105 transition-transform duration-500"
														/>
													) : (
														<MaterialIcon name="spa" className="text-primary text-6xl" />
													)}
												</div>
												<div className="p-4">
													<h3 className="text-white font-medium group-hover:text-primary transition-colors line-clamp-2">
														{product.name}
													</h3>
													{priceDisplay && <p className="text-primary font-bold mt-2">{priceDisplay}</p>}
												</div>
											</YnsLink>
										);
									})}
								</div>
								<SearchPagination currentPage={currentPage} totalPages={totalPages} query={q} />
							</>
						) : (
							<div className="text-center py-16">
								<MaterialIcon name="search_off" className="text-gray-600 text-6xl mb-4" />
								<p className="text-gray-400 text-lg">No products found for &quot;{query}&quot;</p>
								<p className="text-gray-500 mt-2">Try a different search term</p>
							</div>
						)}
					</div>
				) : (
					<div className="text-center py-16">
						<MaterialIcon name="search" className="text-gray-600 text-6xl mb-4" />
						<p className="text-gray-400 text-lg">Enter a search term to find products</p>
					</div>
				)}
			</div>
		</div>
	);
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
	const { q, page } = await searchParams;
	return <SearchResults q={q} page={page} />;
}
