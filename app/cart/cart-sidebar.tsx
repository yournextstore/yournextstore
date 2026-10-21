"use client";

import { Loader2 } from "lucide-react";
import { setCartQuantity } from "@/app/cart/actions";
import { useCart } from "@/app/cart/cart-context";
import { CartItem } from "@/app/cart/cart-item";
import { cartDiscountOf } from "@/app/cart/discount-code";
import { DiscountCodeField } from "@/app/cart/discount-code-field";
import { useStoreConfig } from "@/components/store-config-provider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { formatMoney } from "@/lib/money";
import { cn } from "@/lib/utils";

export function CartSidebar() {
	const { currency, locale, language, taxBehavior } = useStoreConfig();
	const {
		cart,
		isOpen,
		closeCart,
		items,
		itemCount,
		subtotal,
		isMutating,
		dispatch,
		startMutation,
		syncCart,
		reconcile,
	} = useCart();
	const discount = cartDiscountOf(cart, taxBehavior);

	// `?lang=` tells the platform which language version the shopper is leaving from, so the hosted
	// checkout and everything after it (order, emails) speak it even for a cart made before the
	// language was recorded.
	const checkoutUrl = language ? `/checkout?lang=${encodeURIComponent(language)}` : "/checkout";

	const clearBasket = () => {
		const ids = items.map((item) => item.productVariant.id);
		for (const variantId of ids) {
			dispatch({ type: "REMOVE", variantId });
		}
		startMutation(async () => {
			const results = [];
			for (const variantId of ids) {
				results.push(await setCartQuantity(variantId, 0));
			}
			const last = results.at(-1);
			if (results.every((r) => r.success) && last?.cart) {
				syncCart(last.cart);
			} else {
				await reconcile();
			}
		});
	};

	return (
		<Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
			<SheetContent
				hideClose
				className="flex w-full flex-col gap-0 border-l-0 bg-white p-0 shadow-[0_10px_15px_rgba(0,0,0,0.08)] sm:max-w-[600px]"
			>
				<div className="flex items-center gap-2 px-4 pt-4 pb-3">
					<SheetTitle className="grow text-[1.17rem] font-bold text-foreground">
						My Basket{" "}
						<span className="text-sal-sm font-bold text-paragraph">
							({itemCount} {itemCount === 1 ? "item" : "items"})
						</span>
					</SheetTitle>
					<SheetDescription className="sr-only">Review items in your basket and check out.</SheetDescription>
					<SheetClose className="sal-btn sal-btn-border text-[0.6875rem]">Close</SheetClose>
					<button
						type="button"
						onClick={clearBasket}
						disabled={items.length === 0}
						className="sal-btn sal-btn-border text-[0.6875rem]"
					>
						Clear Basket
					</button>
				</div>

				{items.length === 0 ? (
					<div className="flex flex-1 items-center justify-center p-4">
						<p className="text-sal-base text-muted-foreground">Your basket is empty</p>
					</div>
				) : (
					<ScrollArea className="min-h-0 flex-1">
						<div className="flex flex-col gap-3 px-4 pt-1 pb-4">
							{items.map((item) => (
								<CartItem key={item.productVariant.id} item={item} />
							))}
						</div>
					</ScrollArea>
				)}

				<div className="relative bg-white p-4 before:absolute before:inset-x-0 before:top-0 before:mx-auto before:h-px before:w-[93%] before:bg-border">
					{items.length > 0 && (
						<div className="mb-4">
							<DiscountCodeField />
						</div>
					)}
					<div className="flex items-center justify-between gap-4">
						<div>
							<p className="text-sal-sm font-bold text-paragraph">
								{discount ? "Total after discount:" : "Subtotal Amount:"}
							</p>
							<p className="mt-3 text-[1.5rem] font-bold leading-none text-foreground">
								{formatMoney({ amount: subtotal - (discount ?? 0n), currency, locale })}
							</p>
							<p className="mt-2 text-sal-xs font-bold text-muted-foreground">
								{taxBehavior === "inclusive"
									? "Shipping calculated at checkout"
									: "Shipping and taxes calculated at checkout"}
							</p>
						</div>
						{/* Plain <a>, never <Link>: /checkout is a proxied zone (see AGENTS.md). Blocked while a
						    cart write is in flight, so checkout never opens on a cart that lacks the new item. */}
						<a
							href={checkoutUrl}
							aria-disabled={isMutating || items.length === 0}
							tabIndex={isMutating || items.length === 0 ? -1 : undefined}
							onClick={(e) => {
								if (isMutating || items.length === 0) {
									e.preventDefault();
								}
							}}
							className={cn(
								"sal-btn sal-btn-lg shrink-0 px-8 uppercase",
								(isMutating || items.length === 0) && "pointer-events-none opacity-50",
							)}
						>
							{isMutating ? (
								<>
									<Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
									Updating
								</>
							) : (
								"Check Out"
							)}
						</a>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
}
