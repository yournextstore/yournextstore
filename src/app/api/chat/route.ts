import { openai } from "@ai-sdk/openai";
import { streamText, tool } from "ai";
import { z } from "zod";
import { addToCartAction } from "@/actions/cart-actions";
import { searchProducts } from "@/lib/search/search";

export const maxDuration = 30;

export async function POST(req: Request) {
	try {
		const json = await req.json();

		// biome-ignore lint/suspicious/noExplicitAny: Request body type is not strictly defined
		const messages = (json as any).messages;

		const result = streamText({
			system: "Every search query should be changed to singular form",
			model: openai("gpt-4o-mini"),
			messages,
			tools: {
				productSearch: tool({
					description: "Get a list of matching products",
					inputSchema: z.object({
						query: z.string(),
					}),
					execute: async ({ query }) => {
						const products = await searchProducts(query);
						return products.slice(0, 4);
					},
				}),
				cartAdd: tool({
					description: "Add a product to the cart by id",
					inputSchema: z.object({
						id: z.string(),
					}),
					execute: async ({ id }) => {
						const formData = new FormData();
						formData.append("productId", id);
						const cart = await addToCartAction(formData);

						if (cart) {
							return `Product added to cart successfully. Cart ID: ${cart.id}`;
						}
						return "Failed to add product to cart";
					},
				}),
			},
		});

		return result.toUIMessageStreamResponse();
	} catch (error) {
		console.error("Chat API error:", error);
		return new Response("Internal Server Error", { status: 500 });
	}
}
