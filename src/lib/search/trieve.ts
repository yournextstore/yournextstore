import { unstable_cache } from "next/cache";
import { cache } from "react";
import { TrieveSDK } from "trieve-ts-sdk";

const apiKey = process.env.TRIEVE_API_KEY;
const datasetId = process.env.TRIEVE_DATASET_ID;

export const trieve = apiKey && datasetId ? new TrieveSDK({ apiKey, datasetId }) : null;

export const getRecommendedProducts = cache(({ productId, limit }: { productId: string; limit: number }) =>
	unstable_cache(
		async () => {
			if (!trieve) {
				return null;
			}

			try {
				const response = await trieve.getRecommendedChunks({
					positive_tracking_ids: [productId],
					strategy: "best_score",
					recommend_type: "semantic",
					limit,
				});

				const chunks = Array.isArray(response) ? null : response.chunks;
				if (!chunks) {
					return null;
				}

				const products = chunks.flatMap((chunk) => {
					if ("metadata" in chunk.chunk && chunk.chunk.metadata) {
						return chunk.chunk;
					}
					return [];
				});
				return products;
			} catch (error) {
				console.error(error);
				return null;
			}
		},
		[`getRecommendedProducts-${productId}-${limit}`],
		{
			tags: ["getRecommendedProducts", `getRecommendedProducts-${productId}`],
		},
	)(),
);
