"use client";

import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { addToCart } from "@/app/cart/actions";
import { useCart } from "@/app/cart/cart-context";
import { itemKey, lineKey } from "@/app/cart/cart-math";
import type { Piece } from "@/lib/catalog";
import { trackAddToCart } from "@/lib/track";
import { cn } from "@/lib/utils";

/**
 * The card's "Add to bag": adds a one-variant piece straight to the bag (it reads
 * "In the bag ✓" once there), sends a piece with options to its record, and is spent
 * when the piece is sold out.
 */
export function BagButton({ piece, className }: { piece: Piece; className?: string }) {
	const { items, openCart, dispatch, syncCart, reconcile, startMutation } = useCart();
	const base = cn("btn-keeper flex items-center justify-center gap-2 px-4 py-2.5", className);
	const quick = piece.quickAdd;

	if (piece.stock === "out") {
		return (
			<button type="button" disabled className={base}>
				Sold out
			</button>
		);
	}

	if (!quick) {
		return (
			<Link href={piece.href} className={base}>
				Choose options
			</Link>
		);
	}

	const key = lineKey(quick.variantId);
	const inBag = items.some((item) => itemKey(item) === key);

	const add = () => {
		if (inBag) {
			openCart();
			return;
		}
		trackAddToCart({ id: quick.variantId, sku: quick.sku, price: quick.price }, piece.name, 1);
		openCart();
		// Instant local feedback, then REPLACE with the server-returned cart (never refetch —
		// cartGet reads a replica that can lag the write).
		dispatch({
			type: "ADD_ITEM",
			item: {
				quantity: 1,
				productVariant: {
					id: quick.variantId,
					price: quick.price,
					priceGross: quick.priceGross,
					images: quick.images,
					product: { id: piece.id, name: piece.name, slug: piece.slug, images: piece.images },
				},
			},
		});
		startMutation(async () => {
			const result = await addToCart(quick.variantId, 1);
			const line = result.cart?.lineItems.find((item) => itemKey(item) === key);
			if (result.success && result.cart && line) {
				syncCart(result.cart);
			} else {
				await reconcile();
				toast.error("This piece is out of stock");
			}
		});
	};

	return (
		<button
			type="button"
			onClick={add}
			aria-label={inBag ? `In the bag: ${piece.name}` : `Add to bag: ${piece.name}`}
			className={cn(base, inBag && "is-on")}
		>
			<ShoppingBag aria-hidden className="size-[13px]" strokeWidth={1.5} />
			<span>{inBag ? "In the bag ✓" : "Add to bag"}</span>
		</button>
	);
}
