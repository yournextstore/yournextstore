"use client";

import { Loader2, ShoppingCartIcon, XIcon } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";
import { CartItem } from "@/app/cart/cart-item";
import { itemKey } from "@/app/cart/cart-math";
import { cartDiscountOf } from "@/app/cart/discount-code";
import { DiscountCodeField } from "@/app/cart/discount-code-field";
import { useStoreConfig } from "@/components/store-config-provider";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { formatMoney } from "@/lib/money";
import { cn } from "@/lib/utils";

export function CartSidebar() {
	const { currency, locale, language, taxBehavior } = useStoreConfig();
	const { cart, isOpen, closeCart, items, itemCount, subtotal, isMutating } = useCart();
	const discount = cartDiscountOf(cart, taxBehavior);

	// `?lang=` tells the platform which language version the shopper is leaving from, so the hosted
	// checkout and everything after it (order, emails) speak it even for a cart made before the
	// language was recorded.
	const checkoutUrl = language ? `/checkout?lang=${encodeURIComponent(language)}` : "/checkout";

	return (
		<Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
			<SheetContent
				showCloseButton={false}
				className="gap-0 bg-card p-0 shadow-none data-[side=right]:w-full data-[side=right]:sm:max-w-[350px]"
			>
				<SheetHeader className="flex min-h-[60px] flex-row items-center justify-between gap-0 border-b border-border px-5 py-0">
					<SheetTitle className="text-uk-h2 font-normal text-foreground">
						Cart
						{itemCount > 0 && <span className="sr-only"> ({itemCount} items)</span>}
					</SheetTitle>
					<SheetDescription className="sr-only">
						Review items in your cart and proceed to checkout.
					</SheetDescription>
					<SheetClose className="-mr-[10px] flex size-10 items-center justify-center text-muted-foreground hover:text-foreground">
						<XIcon aria-hidden className="size-5" strokeWidth={1.25} />
						<span className="sr-only">Close</span>
					</SheetClose>
				</SheetHeader>

				{items.length === 0 ? (
					<div className="flex flex-1 flex-col items-center justify-center gap-5 px-5 py-10 text-center">
						<ShoppingCartIcon aria-hidden className="size-12 text-muted-foreground" strokeWidth={0.9} />
						<div>
							<p className="text-uk-lg text-foreground">Your cart is empty</p>
							<p className="mt-[5px] text-uk-sm text-muted-foreground">Add some products to get started.</p>
						</div>
						<button type="button" onClick={closeCart} className="uk-btn uk-btn-default">
							Continue shopping
						</button>
					</div>
				) : (
					<>
						<ScrollArea className="min-h-0 flex-1">
							<ul className="divide-y divide-border px-5">
								{items.map((item) => (
									<li key={itemKey(item)}>
										<CartItem item={item} />
									</li>
								))}
							</ul>
						</ScrollArea>
						<div className="space-y-[15px] border-t border-border p-5">
							<DiscountCodeField />
							{discount ? (
								<div className="space-y-1 text-uk-sm">
									<div className="flex items-center justify-between text-muted-foreground">
										<span>Subtotal</span>
										<span>{formatMoney({ amount: subtotal, currency, locale })}</span>
									</div>
									<div className="flex items-center justify-between gap-3 text-[#2d7a3e]">
										<span>Discount</span>
										<span className="tabular-nums">
											−{formatMoney({ amount: discount, currency, locale })}
										</span>
									</div>
								</div>
							) : null}
							<div className="flex items-baseline justify-between">
								<span className="text-uk-lg text-muted-foreground">{discount ? "Total" : "Subtotal"}</span>
								<span className="text-uk-h2 font-medium text-foreground">
									{formatMoney({ amount: subtotal - (discount ?? 0n), currency, locale })}
								</span>
							</div>
							<p className="text-uk-xs text-muted-foreground">
								{taxBehavior === "inclusive"
									? "Shipping calculated at checkout"
									: "Shipping and taxes calculated at checkout"}
							</p>
							<div className="grid grid-cols-2 gap-[10px]">
								<button type="button" onClick={closeCart} className="uk-btn uk-btn-default px-[10px]">
									Shop more
								</button>
								{/* Keep this a plain <a>, never <Link>/router.push: /checkout is proxied to a
								    different Next.js zone. While a cart write is in flight, block the link. */}
								<a
									href={checkoutUrl}
									aria-disabled={isMutating}
									tabIndex={isMutating ? -1 : undefined}
									onClick={(e) => {
										if (isMutating) {
											e.preventDefault();
										}
									}}
									className={cn(
										"uk-btn uk-btn-primary px-[10px]",
										isMutating && "pointer-events-none opacity-60",
									)}
								>
									{isMutating ? (
										<>
											<Loader2 aria-hidden className="size-4 animate-spin" />
											Updating
										</>
									) : (
										"Checkout"
									)}
								</a>
							</div>
						</div>
					</>
				)}
			</SheetContent>
		</Sheet>
	);
}
