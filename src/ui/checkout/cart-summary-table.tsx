"use client";

import {
	Table,
	TableBody,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useTranslations } from "@/i18n/client";
import { calculateCartTotalPossiblyWithTax, formatMoney, formatProductName } from "@/lib/utils";
import { CartAmountWithSpinner, CartItemLineTotal, CartItemQuantity } from "@/ui/checkout/cart-items.client";
import { FormatDeliveryEstimate } from "@/ui/checkout/shipping-rates-section";
import { YnsLink } from "@/ui/yns-link";
import type * as Commerce from "commerce-kit";
import Image from "next/image";
import { useOptimistic } from "react";

export const CartSummaryTable = ({ cart, locale }: { cart: Commerce.Cart; locale: string }) => {
	const t = useTranslations("/cart.page.summaryTable");

	const [optimisticCart, dispatchOptimisticCartAction] = useOptimistic(
		cart,
		(prevCart, action: { productId: string; action: "INCREASE" | "DECREASE" }) => {
			const modifier = action.action === "INCREASE" ? 1 : -1;

			return {
				...prevCart,
				lines: prevCart.lines.map((line) => {
					if (line.product.id === action.productId) {
						return { ...line, quantity: line.quantity + modifier };
					}
					return line;
				}),
			};
		},
	);

	const currency = optimisticCart.lines[0]!.product.default_price.currency;
	const total = calculateCartTotalPossiblyWithTax(optimisticCart);

	return (
		<form>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="hidden w-24 sm:table-cell">
							<span className="sr-only">{t("imageCol")}</span>
						</TableHead>
						<TableHead className="">{t("productCol")}</TableHead>
						<TableHead className="w-1/6 min-w-32">{t("priceCol")}</TableHead>
						<TableHead className="w-1/6 min-w-32">{t("quantityCol")}</TableHead>
						<TableHead className="w-1/6 min-w-32 text-right">{t("totalCol")}</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{optimisticCart.lines.map((line) => {
						// @todo figure out what to do with this object; how to diplay it nicely
						// do some research
						// const _taxLine = optimisticCart.taxCalculation?.line_items?.data.find(
						// 	(taxLine) => taxLine.product === line.product.id,
						// );
						return (
							<TableRow key={line.product.id}>
								<TableCell className="hidden sm:table-cell sm:w-24">
									{line.product.images[0] && (
										<Image
											className="aspect-square rounded-md object-cover"
											src={line.product.images[0]}
											width={96}
											height={96}
											alt=""
										/>
									)}
								</TableCell>
								<TableCell className="font-medium">
									<YnsLink
										className="transition-colors hover:text-muted-foreground"
										href={`/product/${line.product.metadata.slug}`}
									>
										{formatProductName(line.product.name, line.product.metadata.variant)}
									</YnsLink>
								</TableCell>
								<TableCell>
									{formatMoney({
										amount: line.product.default_price.unit_amount ?? 0,
										currency: line.product.default_price.currency,
										locale,
									})}
								</TableCell>
								<TableCell>
									<CartItemQuantity
										cartId={cart.cart.id}
										quantity={line.quantity}
										productId={line.product.id}
										onChange={dispatchOptimisticCartAction}
									/>
								</TableCell>
								<TableCell className="text-right">
									<CartItemLineTotal
										currency={line.product.default_price.currency}
										quantity={line.quantity}
										unitAmount={line.product.default_price.unit_amount ?? 0}
										productId={line.product.id}
										locale={locale}
									/>
								</TableCell>
							</TableRow>
						);
					})}
					{cart.shippingRate && (
						<TableRow>
							<TableCell className="hidden sm:table-cell sm:w-24"></TableCell>
							<TableCell className="font-medium" colSpan={3}>
								{cart.shippingRate.display_name}{" "}
								<span className="text-muted-foreground">
									<FormatDeliveryEstimate estimate={cart.shippingRate.delivery_estimate} />
								</span>
							</TableCell>
							<TableCell className="text-right">
								{cart.shippingRate.fixed_amount &&
									formatMoney({
										amount: cart.shippingRate.fixed_amount.amount,
										currency: cart.shippingRate.fixed_amount.currency,
										locale,
									})}
							</TableCell>
						</TableRow>
					)}
				</TableBody>
				<TableFooter>
					{optimisticCart.cart.taxBreakdown.map((tax, idx) => (
						<TableRow key={idx + tax.taxAmount} className="font-normal">
							<TableCell className="hidden w-24 sm:table-cell"></TableCell>
							<TableCell colSpan={3} className="text-right">
								{tax.taxType.toString().toLocaleUpperCase()} {tax.taxPercentage}%
							</TableCell>
							<TableCell className="text-right">
								<CartAmountWithSpinner total={tax.taxAmount} currency={currency} locale={locale} />
							</TableCell>
						</TableRow>
					))}
					<TableRow className="text-lg font-bold">
						<TableCell className="hidden w-24 sm:table-cell"></TableCell>
						<TableCell colSpan={3} className="text-right">
							{t("totalSummary")}
						</TableCell>
						<TableCell className="text-right">
							<CartAmountWithSpinner total={total} currency={currency} locale={locale} />
						</TableCell>
					</TableRow>
				</TableFooter>
			</Table>
		</form>
	);
};
