"use client";

import { addToCartAction } from "@/actions/cart-actions";
import { useRouter } from "next/navigation";
import { startTransition, useEffect, useRef } from "react";

// This is a side effect that is triggered when the user clicks on the "Add to cart" button.
// It will add the product to the cart in the background while the cart renders optimistically updated UI
export const CartModalAddSideEffect = ({ productId }: { productId: string }) => {
	const router = useRouter();
	const pendingRef = useRef(false);

	useEffect(() => {
		if (pendingRef.current || !productId) {
			return;
		}
		pendingRef.current = true;
		startTransition(async () => {
			const formData = new FormData();
			formData.append("productId", productId);
			await addToCartAction(formData);
			pendingRef.current = false;

			// use `document.location.pathname` because `usePathname` returns stale value
			// while the router is transitioning
			if (document.location.pathname === "/cart-overlay") {
				// if user is still on the cart page, remove the query params and rerender
				router.replace("/cart-overlay", { scroll: false });
				router.refresh();
			}
		});
	}, [productId, router]);

	return null;
};
