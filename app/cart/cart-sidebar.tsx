"use client";

import { Loader2, XIcon } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";
import { CartItem } from "@/app/cart/cart-item";
import { itemKey } from "@/app/cart/cart-math";
import { cartDiscountOf } from "@/app/cart/discount-code";
import { DiscountCodeField } from "@/app/cart/discount-code-field";
import { useStoreConfig } from "@/components/store-config-provider";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { formatMoney } from "@/lib/money";
import { cn } from "@/lib/utils";

/** The original's bag: a floating paper card inset from the viewport edge, not a full-height sheet. */
export function CartSidebar({ storeName }: { storeName: string }) {
	const { currency, locale, language, taxBehavior } = useStoreConfig();
	const { cart, isOpen, closeCart, items, subtotal, isMutating } = useCart();
	const discount = cartDiscountOf(cart, taxBehavior);

	// `?lang=` tells the platform which language version the shopper is leaving from, so the hosted
	// checkout and everything after it (order, emails) speak it even for a cart made before the
	// language was recorded.
	const checkoutUrl = language ? `/checkout?lang=${encodeURIComponent(language)}` : "/checkout";

	return (
		<Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
			<SheetContent
				showCloseButton={false}
				className="gap-0 overflow-hidden border border-line bg-paper text-foreground shadow-2xl data-[side=right]:inset-y-4 data-[side=right]:right-4 data-[side=right]:h-auto data-[side=right]:w-[calc(100%-2rem)] data-[side=right]:sm:max-w-md"
			>
				<div className="flex items-center justify-between gap-3 border-b border-line px-6 py-5">
					<SheetTitle className="flex min-w-0 items-center gap-2 font-display text-xl font-bold">
						<span
							aria-hidden
							className="inline-flex size-7 shrink-0 items-center justify-center bg-ink text-[16px] font-medium italic text-paper"
						>
							{storeName.charAt(0).toUpperCase()}
						</span>
						<span className="truncate">{storeName}</span>
					</SheetTitle>
					<SheetDescription className="sr-only">Your bag: review pieces and go to checkout.</SheetDescription>
					<SheetClose
						className="p-2 text-muted-foreground transition-colors hover:text-ink"
						aria-label="Close bag"
					>
						<XIcon aria-hidden className="size-5" strokeWidth={1.6} />
					</SheetClose>
				</div>

				<div className="flex-1 overflow-y-auto px-6 py-4">
					{items.length === 0 ? (
						<p className="py-16 text-center text-body text-muted-foreground">
							Your bag is empty.
							<br />
							Pieces you add will wait here.
						</p>
					) : (
						items.map((item) => <CartItem key={itemKey(item)} item={item} />)
					)}
				</div>

				<div className="space-y-4 border-t border-line px-6 py-5">
					{items.length > 0 && <DiscountCodeField />}
					{discount ? (
						<div className="flex items-center justify-between gap-3 text-[14px] text-muted-foreground">
							<span>Discount</span>
							<span className="tabular-nums">−{formatMoney({ amount: discount, currency, locale })}</span>
						</div>
					) : null}
					<div>
						<div className="flex items-center justify-between text-body">
							<span className="text-muted-foreground">{discount ? "Total" : "Subtotal"}</span>
							<span className="font-semibold">
								{formatMoney({ amount: subtotal - (discount ?? 0n), currency, locale })}
							</span>
						</div>
						{/* Tax is already inside the shown subtotal on an inclusive store — promising to
						    "calculate taxes at checkout" there would read as an extra charge to come. */}
						<p className="mt-1 text-small text-muted-foreground">
							{taxBehavior === "inclusive"
								? "Shipping calculated at checkout."
								: "Shipping and taxes calculated at checkout."}
						</p>
					</div>
					{/* Keep this a plain <a>, never <Link>/router.push: /checkout is proxied to a
					    different Next.js zone (yns.store). A soft RSC nav 500s the cross-zone request.
					    While a cart write is in flight, block the link: a full navigation now would
					    load /checkout before the item is committed server-side and show an empty cart. */}
					{items.length > 0 ? (
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
								"flex w-full items-center justify-center gap-2 bg-brand py-3.5 text-body font-semibold text-primary-foreground transition-colors hover:bg-brand-deep",
								isMutating && "pointer-events-none opacity-60",
							)}
						>
							{isMutating ? (
								<>
									<Loader2 aria-hidden className="size-4 animate-spin" />
									Updating…
								</>
							) : (
								"Checkout"
							)}
						</a>
					) : (
						<button
							type="button"
							disabled
							className="w-full bg-brand py-3.5 text-body font-semibold text-primary-foreground opacity-50"
						>
							Checkout
						</button>
					)}
				</div>
			</SheetContent>
		</Sheet>
	);
}
