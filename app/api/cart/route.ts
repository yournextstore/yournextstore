import { readCart } from "@/lib/cart";

// The cart read is a GET, not a server action: the router runs a page's actions one at a
// time, so a mount-time action read would hold back the shopper's first add to cart.
// Never cached: `private` keeps a CDN from serving one shopper's cart to another, and
// `no-store` keeps Back after a checkout from restoring the cart that was just paid for.
export async function GET() {
	return Response.json(await readCart(), {
		headers: { "Cache-Control": "private, no-store" },
	});
}
