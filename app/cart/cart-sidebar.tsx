"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";
import { CartItem } from "@/app/cart/cart-item";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { YnsLink } from "@/components/yns-link";
import { CURRENCY, LOCALE } from "@/lib/constants";
import { formatMoney } from "@/lib/money";

export function CartSidebar() {
	const { isOpen, closeCart, items, itemCount, subtotal } = useCart();

	const checkoutUrl = `/checkout`;

	return (
		<Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
			<SheetContent className="flex flex-col w-full sm:max-w-lg border-l border-border/50">
				<SheetHeader className="border-b border-border/50 pb-6">
					<SheetTitle className="flex items-center gap-3 text-lg font-serif font-light tracking-wide">
						Shopping Bag
						{itemCount > 0 && (
							<span className="text-xs font-sans tracking-[0.1em] uppercase text-muted-foreground">({itemCount} items)</span>
						)}
					</SheetTitle>
				</SheetHeader>

				{items.length === 0 ? (
					<div className="flex-1 flex flex-col items-center justify-center gap-6 py-16">
						<div className="flex h-24 w-24 items-center justify-center border border-border/50">
							<ShoppingBag className="h-10 w-10 text-primary/50" />
						</div>
						<div className="text-center">
							<p className="text-lg font-serif font-light">Your bag is empty</p>
							<p className="text-sm text-muted-foreground mt-2">Discover our exquisite collections</p>
						</div>
						<Button variant="outline" onClick={closeCart} className="tracking-[0.1em] uppercase text-xs h-12 px-8 border-primary/30 hover:bg-primary hover:text-primary-foreground">
							Continue Shopping
						</Button>
					</div>
				) : (
					<>
						<ScrollArea className="flex-1 px-4">
							<div className="divide-y divide-border/50">
								{items.map((item) => (
									<CartItem key={item.productVariant.id} item={item} />
								))}
							</div>
						</ScrollArea>

						<SheetFooter className="border-t border-border/50 pt-6 mt-auto">
							<div className="w-full space-y-6">
								<div className="flex items-center justify-between">
									<span className="text-xs tracking-[0.15em] uppercase text-muted-foreground">Subtotal</span>
									<span className="text-lg font-light text-primary">
										{formatMoney({ amount: subtotal, currency: CURRENCY, locale: LOCALE })}
									</span>
								</div>
								<p className="text-xs text-muted-foreground">Complimentary shipping on orders over $500</p>
								<Button asChild className="w-full h-14 text-xs tracking-[0.15em] uppercase font-medium">
									<YnsLink prefetch={false} href={checkoutUrl} onClick={closeCart}>
										Proceed to Checkout
									</YnsLink>
								</Button>
								<button
									type="button"
									onClick={closeCart}
									className="w-full text-xs tracking-[0.1em] uppercase text-muted-foreground hover:text-primary transition-colors duration-300"
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
