import { cacheLife } from "next/cache";
import { commerce, meGetCached } from "@/lib/commerce";
import { isVideoUrl } from "@/lib/utils";

/**
 * One cached read feeds the whole home page, so hero, tile and grid land in the
 * prerendered shell together. Products with a photograph come first so the home
 * grid never opens on an empty placeholder.
 */
export async function getHomeData() {
	"use cache";
	cacheLife("minutes");

	const [me, browse] = await Promise.all([
		meGetCached().catch(() => null),
		commerce.productBrowse({ active: true, limit: 24 }).catch(() => ({ data: [] })),
	]);

	const hasPhoto = (product: (typeof browse.data)[number]) =>
		[...(product.images ?? []), ...product.variants.flatMap((variant) => variant.images ?? [])].some(
			(image) => !isVideoUrl(image),
		);
	const products = [...browse.data.filter(hasPhoto), ...browse.data.filter((product) => !hasPhoto(product))];

	return {
		storeName: me?.store.name || "Your Next Store",
		products: products.slice(0, 7),
	};
}
