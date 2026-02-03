"use client";

import { useCart } from "@/app/cart/cart-context";
import { CartItem } from "@/app/cart/cart-item";
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
			<SheetContent className="flex flex-col w-full sm:max-w-md bg-[#FAFAF8] border-l border-zinc-200">
				<SheetHeader className="border-b border-zinc-200 pb-6">
					<SheetTitle className="text-xs tracking-[0.3em] uppercase text-zinc-900 font-normal">
						Cart
						{itemCount > 0 && (
							<span className="text-zinc-400 ml-2">({itemCount})</span>
						)}
					</SheetTitle>
				</SheetHeader>

				{items.length === 0 ? (
					<div className="flex-1 flex flex-col items-center justify-center gap-8 py-16">
						<div className="text-center">
							<p className="text-sm text-zinc-900 font-light">Your cart is empty</p>
							<p className="text-xs text-zinc-400 mt-2">Add some products to get started</p>
						</div>
						<button
							type="button"
							onClick={closeCart}
							className="text-xs tracking-[0.15em] uppercase text-zinc-400 hover:text-zinc-900 transition-colors"
						>
							Continue Shopping
						</button>
					</div>
				) : (
					<>
						<ScrollArea className="flex-1">
							<div className="divide-y divide-zinc-200">
								{items.map((item) => (
									<CartItem key={item.productVariant.id} item={item} />
								))}
							</div>
						</ScrollArea>

						<SheetFooter className="border-t border-zinc-200 pt-6 mt-auto">
							<div className="w-full space-y-6">
								<div className="flex items-center justify-between">
									<span className="text-xs tracking-[0.2em] uppercase text-zinc-400">Subtotal</span>
									<span className="text-sm text-zinc-900 font-light">
										{formatMoney({ amount: subtotal, currency: CURRENCY, locale: LOCALE })}
									</span>
								</div>
								<p className="text-xs text-zinc-400">Shipping and taxes calculated at checkout</p>
								<YnsLink
									prefetch={false}
									href={checkoutUrl}
									onClick={closeCart}
									className="block w-full py-4 bg-zinc-900 text-white text-xs tracking-[0.15em] uppercase text-center hover:bg-zinc-800 transition-colors"
								>
									Checkout
								</YnsLink>
								<button
									type="button"
									onClick={closeCart}
									className="w-full text-xs tracking-[0.15em] uppercase text-zinc-400 hover:text-zinc-900 transition-colors"
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
