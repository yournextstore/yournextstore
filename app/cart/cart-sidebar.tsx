"use client";

import { Loader2, ShoppingBag, XIcon } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";
import { CartItem } from "@/app/cart/cart-item";
import { cartDiscountOf } from "@/app/cart/discount-code";
import { DiscountCodeField } from "@/app/cart/discount-code-field";
import { BtnLabel } from "@/components/grilli/btn-label";
import { useStoreConfig } from "@/components/store-config-provider";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
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
			<SheetContent className="flex w-full flex-col gap-0 border-l-0 bg-smoky p-0 sm:max-w-[440px] [&>button:last-child]:hidden">
				<SheetHeader className="relative border-b border-line px-[30px] pt-[30px] pb-6 text-center">
					<SheetClose
						aria-label="Close cart"
						className="absolute top-[30px] right-[30px] z-10 flex size-9 cursor-pointer items-center justify-center rounded-full border border-current text-white transition-colors hover:text-gold"
					>
						<XIcon className="size-5" aria-hidden="true" />
					</SheetClose>
					<p aria-hidden="true" className="section-subtitle mb-1!">
						Your order
					</p>
					<SheetTitle className="font-display text-headline-2 font-normal text-white">Your Cart</SheetTitle>
					<SheetDescription className="text-label-1 text-silver">
						{itemCount > 0
							? `${itemCount} ${itemCount === 1 ? "item" : "items"} in your cart`
							: "Your cart is empty"}
					</SheetDescription>
				</SheetHeader>

				{items.length === 0 ? (
					<div className="flex flex-1 flex-col items-center justify-center gap-6 px-[30px] py-12 text-center">
						<div className="flex size-20 rotate-45 items-center justify-center border border-gold">
							<ShoppingBag className="size-8 -rotate-45 text-gold" strokeWidth={1.25} aria-hidden="true" />
						</div>
						<div>
							<p className="font-display text-title-1 text-white">Your cart is empty</p>
							<p className="mt-1 text-body-4 text-silver">Add something you love from the shop.</p>
						</div>
						<button type="button" onClick={closeCart} className="btn-g">
							<BtnLabel>Continue Shopping</BtnLabel>
						</button>
					</div>
				) : (
					<>
						<ScrollArea className="min-h-0 flex-1 px-[30px]">
							<div className="divide-y divide-line">
								{items.map((item) => (
									<CartItem key={item.productVariant.id} item={item} />
								))}
							</div>
						</ScrollArea>

						<SheetFooter className="mt-auto border-t border-line bg-smoky-2 px-[30px] pt-6 pb-[30px]">
							<div className="w-full space-y-4">
								<DiscountCodeField />
								{discount ? (
									<div className="space-y-1">
										<div className="flex items-center justify-between text-sm text-silver">
											<span>Subtotal</span>
											<span>{formatMoney({ amount: subtotal, currency, locale })}</span>
										</div>
										<div className="flex items-center justify-between gap-3 text-sm font-medium text-[#8fd19e]">
											<span>Discount</span>
											<span className="tabular-nums">
												−{formatMoney({ amount: discount, currency, locale })}
											</span>
										</div>
									</div>
								) : null}
								<div className="flex items-baseline justify-between">
									<span className="text-label-2 font-bold tracking-3 text-white uppercase">
										{discount ? "Total" : "Subtotal"}
									</span>
									<span className="font-display text-title-1 text-gold">
										{formatMoney({ amount: subtotal - (discount ?? 0n), currency, locale })}
									</span>
								</div>
								{/* Tax is already inside the shown subtotal on an inclusive store — promising to
								    "calculate taxes at checkout" there would read as an extra charge to come. */}
								<p className="text-label-1 text-silver">
									{taxBehavior === "inclusive"
										? "Shipping calculated at checkout"
										: "Shipping and taxes calculated at checkout"}
								</p>
								{/* Keep this a plain <a>, never <Link>/router.push: /checkout is proxied to a
								    different Next.js zone (yns.store). A soft RSC nav 500s the cross-zone request.
								    While a cart write is in flight, block the link: a full navigation now would
								    load /checkout before the item is committed server-side and show an empty cart. */}
								<a
									href={checkoutUrl}
									data-variant="solid"
									aria-disabled={isMutating}
									tabIndex={isMutating ? -1 : undefined}
									onClick={(e) => {
										if (isMutating) {
											e.preventDefault();
										}
									}}
									className={cn(
										"btn-g h-14 w-full max-w-none",
										isMutating && "pointer-events-none opacity-60",
									)}
								>
									{isMutating ? (
										<span className="flex items-center gap-2">
											<Loader2 className="size-4 animate-spin" aria-hidden="true" />
											Updating…
										</span>
									) : (
										<BtnLabel>Proceed to checkout</BtnLabel>
									)}
								</a>
								<button type="button" onClick={closeCart} className="btn-text hover-underline mx-auto block">
									Continue Shopping
								</button>
							</div>
						</SheetFooter>
					</>
				)}
			</SheetContent>
		</Sheet>
	);
}
