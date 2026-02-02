"use client";

import { ArrowRight, ShoppingBag } from "lucide-react";
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
			<SheetContent className="flex flex-col w-full sm:max-w-lg bg-background/95 backdrop-blur-xl border-l border-border">
				<SheetHeader className="border-b border-border pb-4">
					<SheetTitle className="flex items-center gap-3">
						<div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
							<ShoppingBag className="w-5 h-5 text-primary" />
						</div>
						<div>
							<span className="text-lg font-bold">Your Cart</span>
							{itemCount > 0 && (
								<p className="text-sm font-normal text-muted-foreground">{itemCount} items</p>
							)}
						</div>
					</SheetTitle>
				</SheetHeader>

				{items.length === 0 ? (
					<div className="flex-1 flex flex-col items-center justify-center gap-4 py-12">
						<div className="flex h-24 w-24 items-center justify-center rounded-full bg-secondary">
							<ShoppingBag className="h-12 w-12 text-muted-foreground" />
						</div>
						<div className="text-center">
							<p className="text-lg font-bold">Your cart is empty</p>
							<p className="text-sm text-muted-foreground mt-1">Add some products to get started</p>
						</div>
						<Button
							variant="outline"
							onClick={closeCart}
							className="rounded-full px-6 hover:bg-primary hover:text-primary-foreground transition-colors"
						>
							Continue Shopping
						</Button>
					</div>
				) : (
					<>
						<ScrollArea className="flex-1 px-1">
							<div className="space-y-4 py-4">
								{items.map((item) => (
									<CartItem key={item.productVariant.id} item={item} />
								))}
							</div>
						</ScrollArea>

						<SheetFooter className="border-t border-border pt-4 mt-auto">
							<div className="w-full space-y-4">
								{/* Subtotal */}
								<div className="bg-secondary/50 rounded-2xl p-4">
									<div className="flex items-center justify-between text-base">
										<span className="font-medium text-muted-foreground">Subtotal</span>
										<span className="text-xl font-bold">
											{formatMoney({ amount: subtotal, currency: CURRENCY, locale: LOCALE })}
										</span>
									</div>
									<p className="text-xs text-muted-foreground mt-1">
										Shipping and taxes calculated at checkout
									</p>
								</div>

								{/* Checkout Button */}
								<Button
									asChild
									className="w-full h-14 text-base font-bold rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow transition-all hover:scale-[1.02]"
								>
									<YnsLink prefetch={false} href={checkoutUrl} onClick={closeCart}>
										Checkout
										<ArrowRight className="ml-2 w-5 h-5" />
									</YnsLink>
								</Button>

								{/* Continue Shopping */}
								<button
									type="button"
									onClick={closeCart}
									className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
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
