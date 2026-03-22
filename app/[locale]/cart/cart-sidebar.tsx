"use client";

import { ShoppingBag } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useCart } from "@/app/[locale]/cart/cart-context";
import { CartItem } from "@/app/[locale]/cart/cart-item";
import { useCurrency } from "@/components/currency-provider";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { formatMoney } from "@/lib/money";

export function CartSidebar() {
	const { isOpen, closeCart, items, itemCount, subtotal } = useCart();
	const t = useTranslations("Cart");
	const locale = useLocale();
	const { currency } = useCurrency();

	const checkoutUrl = `/checkout`;

	return (
		<Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
			<SheetContent className="flex flex-col w-full sm:max-w-lg">
				<SheetHeader className="border-b border-border pb-4">
					<SheetTitle className="flex items-center gap-2">
						{t("title")}
						{itemCount > 0 && (
							<span className="text-sm font-normal text-muted-foreground">
								{t("itemCount", { count: itemCount })}
							</span>
						)}
					</SheetTitle>
				</SheetHeader>

				{items.length === 0 ? (
					<div className="flex-1 flex flex-col items-center justify-center gap-4 py-12">
						<div className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
							<ShoppingBag className="h-10 w-10 text-muted-foreground" />
						</div>
						<div className="text-center">
							<p className="text-lg font-medium">{t("empty")}</p>
							<p className="text-sm text-muted-foreground mt-1">{t("emptyDescription")}</p>
						</div>
						<Button variant="outline" onClick={closeCart}>
							{t("continueShopping")}
						</Button>
					</div>
				) : (
					<>
						<ScrollArea className="flex-1 px-4">
							<div className="divide-y divide-border">
								{items.map((item) => (
									<CartItem key={item.productVariant.id} item={item} />
								))}
							</div>
						</ScrollArea>

						<SheetFooter className="border-t border-border pt-4 mt-auto">
							<div className="w-full space-y-4">
								<div className="flex items-center justify-between text-base">
									<span className="font-medium">{t("subtotal")}</span>
									<span className="font-semibold">{formatMoney({ amount: subtotal, currency, locale })}</span>
								</div>
								<p className="text-xs text-muted-foreground">{t("shippingNote")}</p>
								<Button asChild className="w-full h-12 text-base font-medium">
									<a href={checkoutUrl}>{t("checkout")}</a>
								</Button>
								<button
									type="button"
									onClick={closeCart}
									className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
								>
									{t("continueShopping")}
								</button>
							</div>
						</SheetFooter>
					</>
				)}
			</SheetContent>
		</Sheet>
	);
}
