import { TrendingCard } from "@/components/trending-card";
import { getTrending } from "@/lib/catalog";

/** The original's "Trending Products": the title takes the first cell of a four-column grid. */
export async function Trending() {
	const { products } = await getTrending();
	if (products.length === 0) return null;

	return (
		<section className="mt-10 grid grid-cols-1 gap-4 py-4 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
			<h2 className="flex items-center text-3xl break-words md:text-4xl lg:text-5xl">Trending Products</h2>
			{products.map((product) => (
				<TrendingCard key={product.id} product={product} />
			))}
		</section>
	);
}
