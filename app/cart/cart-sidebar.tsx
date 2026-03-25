"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";
import { CartItem } from "@/app/cart/cart-item";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { CURRENCY, LOCALE } from "@/lib/constants";
import { formatMoney } from "@/lib/money";

export function CartSidebar() {
	const { isOpen, closeCart, items, itemCount, subtotal } = useCart();

	const checkoutUrl = `/checkout`;

	return (
		<Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
			<SheetContent className="flex w-full flex-col border-l border-border/80 bg-background sm:max-w-lg">
				<SheetHeader className="border-b border-border/80 px-6 pb-4 pt-5">
					<SheetTitle className="flex items-center gap-2 font-editorial text-3xl tracking-[-0.04em]">
						Your Cart
						{itemCount > 0 && (
							<span className="text-sm font-normal text-muted-foreground">({itemCount} items)</span>
						)}
					</SheetTitle>
				</SheetHeader>

				{items.length === 0 ? (
					<div className="flex-1 flex flex-col items-center justify-center gap-4 py-12">
						<div className="flex h-20 w-20 items-center justify-center border border-border/80 bg-[var(--surface-soft)]">
							<ShoppingBag className="h-10 w-10 text-muted-foreground" />
						</div>
						<div className="text-center">
							<p className="font-editorial text-[1.8rem] tracking-[-0.04em] text-foreground">
								Your cart is empty
							</p>
							<p className="mt-2 text-sm text-muted-foreground">Add a few pieces to begin your edit.</p>
						</div>
						<Button
							variant="outline"
							className="h-11 px-5 text-[0.72rem] uppercase tracking-[0.18em]"
							onClick={closeCart}
						>
							Continue Shopping
						</Button>
					</div>
				) : (
					<>
						<ScrollArea className="flex-1 px-6">
							<div className="divide-y divide-border">
								{items.map((item) => (
									<CartItem key={item.productVariant.id} item={item} />
								))}
							</div>
						</ScrollArea>

						<SheetFooter className="mt-auto border-t border-border/80 px-6 pt-4">
							<div className="w-full space-y-4">
								<div className="flex items-center justify-between text-base">
									<span className="font-medium">Subtotal</span>
									<span className="font-semibold">
										{formatMoney({ amount: subtotal, currency: CURRENCY, locale: LOCALE })}
									</span>
								</div>
								<p className="text-xs text-muted-foreground">Shipping and taxes calculated at checkout</p>
								<Button
									asChild
									className="h-12 w-full border border-foreground bg-foreground text-[0.76rem] uppercase tracking-[0.18em] text-primary-foreground"
								>
									<a href={checkoutUrl}>Checkout</a>
								</Button>
								<button
									type="button"
									onClick={closeCart}
									className="w-full text-[0.72rem] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
								>
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
