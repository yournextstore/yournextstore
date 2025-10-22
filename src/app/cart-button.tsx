import { ShoppingCart } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";
import { ynsClient } from "@/yns-client";

export async function CartButton() {
	const cookieStore = await cookies();
	const cartId = cookieStore.get("cartId")?.value;

	const cart = cartId ? await ynsClient.cartGet({ cartId }) : null;
	const itemCount = cart?.lineItems.reduce((sum, lineItem) => sum + lineItem.quantity, 0) ?? 0;

	const cartUrl = cartId ? `${process.env.YNS_API_TENANT}/cart/r/${cartId}` : "#";

	return (
		<Link
			href={cartUrl}
			className="p-2 hover:bg-gray-100 rounded-full transition-colors relative block"
			aria-label="Shopping cart"
		>
			<ShoppingCart className="w-6 h-6" />
			{itemCount > 0 && (
				<span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
					{itemCount}
				</span>
			)}
		</Link>
	);
}
