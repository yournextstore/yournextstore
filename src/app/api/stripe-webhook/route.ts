import { env } from "@/env.mjs";
import { unpackPromise } from "@/lib/utils";
import * as Commerce from "commerce-kit";
import { cartMetadataSchema } from "commerce-kit/internal";
import { revalidateTag } from "next/cache";

export async function POST(request: Request) {
	if (!env.STRIPE_WEBHOOK_SECRET) {
		return new Response("STRIPE_WEBHOOK_SECRET is not configured", { status: 500 });
	}

	const signature = (await request.headers).get("Stripe-Signature");
	if (!signature) {
		return new Response("No signature", { status: 401 });
	}

	const stripe = Commerce.provider({
		tagPrefix: undefined,
		secretKey: undefined,
		cache: "no-store",
	});

	const [error, event] = await unpackPromise(
		stripe.webhooks.constructEventAsync(await (await request.text)(), signature, env.STRIPE_WEBHOOK_SECRET),
	);

	if (error) {
		console.error(error);
		return new Response("Invalid signature", { status: 401 });
	}

	switch (event.type) {
		case "payment_intent.succeeded":
			const metadata = cartMetadataSchema.parse(event.data.object.metadata);
			if (metadata.taxCalculationId) {
				await stripe.tax.transactions.createFromCalculation({
					calculation: metadata.taxCalculationId,
					// @todo generate better references
					reference: event.data.object.id.slice(3),
				});
			}

			const products = await Commerce.getProductsFromMetadata(metadata);

			for (const { product } of products) {
				if (product && product.metadata.stock !== Infinity) {
					await stripe.products.update(product.id, {
						metadata: {
							stock: product.metadata.stock - 1,
						},
					});

					revalidateTag(`product-${product.id}`);
				}
			}

			revalidateTag(`cart-${event.data.object.id}`);

			break;

		default:
			console.log(`Unhandled event type: ${event.type}`);
	}
	return Response.json({ received: true });
}
