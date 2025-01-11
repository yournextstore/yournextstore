import { addToCartAction } from "@/actions/cart-actions";
import { searchProducts } from "@/lib/search/search";
import { openai } from "@ai-sdk/openai";
import { StreamData, streamText } from "ai";
import { z } from "zod";

export const maxDuration = 30;

export async function POST(req: Request) {
	const json = await req.json();

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const messages = (json as any).messages;

	const streamingData = new StreamData();

	const result = streamText({
		system: "Every search query should be changed to singular form",
		model: openai("gpt-4o-mini"),
		messages,
		experimental_activeTools: ["productSearch", "cartAdd"],
		tools: {
			productSearch: {
				description: "Get a list of matching products",
				parameters: z.object({
					query: z.string(),
				}),
				execute: async ({ query }) => {
					const products = await searchProducts(query);

					return products.slice(0, 4);
				},
			},
			cartAdd: {
				description: "Add a product to the cart by id",
				parameters: z.object({
					id: z.string(),
				}),
				async execute({ id }) {
					const formData = new FormData();
					formData.append("productId", id);
					const cart = await addToCartAction(formData);

					if (cart) {
						streamingData.append({ operation: "cartAdd", id, cartId: cart.id });
					}
					return "OK. Done";
				},
			},
		},
		onFinish() {
			streamingData.close();
		},
	});

	return result.toDataStreamResponse({ data: streamingData });
}
