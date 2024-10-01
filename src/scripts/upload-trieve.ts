import * as Commerce from "commerce-kit";
import { type ChunkReqPayload, TrieveSDK } from "trieve-ts-sdk";
// import { mapProduct } from "commerce-kit/internal";

const datasetId = process.env.TRIEVE_DATASET_ID!;
const apiKey = process.env.TRIEVE_API_KEY!;

export const trieve = new TrieveSDK({ apiKey, datasetId });

const stripe = Commerce.provider({
	secretKey: process.env.STRIPE_SECRET_KEY!,
	tagPrefix: undefined,
});

const { data: products } = await stripe.products.list({
	limit: 100,
	active: true,
});
console.log(products);
const chunks = products.map(
	(product): ChunkReqPayload => ({
		chunk_html: `
Product Name: ${product.name}
Description: ${product.description}
`.trim(),
		image_urls: product.images,
		tracking_id: product.id,
		upsert_by_tracking_id: true,
		metadata: {
			name: product.name,
			description: product.description,
			image_url: product.images[0],
		},
	}),
);

const r = await trieve.createChunk(chunks);

console.log("Done", r);
