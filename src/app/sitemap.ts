import type { MetadataRoute } from "next";
import { publicUrl } from "@/env.mjs";
import { commerce } from "@/lib/commerce";
import StoreConfig from "@/store.config";

type Item = MetadataRoute.Sitemap[number];
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const result = await commerce.product.browse({ first: 100 });
	const productUrls = result.data.map(
		(product) =>
			({
				url: `${publicUrl}/product/${product.slug || product.id}`,
				lastModified: new Date(), // YNS Product doesn't have updated field
				changeFrequency: "daily",
				priority: 0.8,
			}) satisfies Item,
	);

	const categoryUrls = StoreConfig.categories.map(
		(category) =>
			({
				url: `${publicUrl}/category/${category.slug}`,
				lastModified: new Date(),
				changeFrequency: "daily",
				priority: 0.5,
			}) satisfies Item,
	);

	return [
		{
			url: publicUrl,
			lastModified: new Date(),
			changeFrequency: "always",
			priority: 1,
		},
		...productUrls,
		...categoryUrls,
	];
}
