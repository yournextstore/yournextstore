import { getCartFromCookiesAction } from "@/actions/cart-actions";
import { Button } from "@/components/ui/button";
import { getLocale, getTranslations } from "@/i18n/server";
import { formatMoney, formatProductName } from "@/lib/utils";
import { YnsLink } from "@/ui/yns-link";
import { calculateCartTotalNetWithoutShipping } from "commerce-kit";
import Image from "next/image";
import { CartAsideContainer } from "./cart-aside";

export async function CartModalPage() {
	// const searchParams = await props.searchParams;
	const originalCart = await getCartFromCookiesAction();
	// TODO fix type
	// const cart = await Commerce.cartAddOptimistic({ add: searchParams.add, cart: originalCart! });
	const cart = originalCart;

	if (!cart || cart.lines.length === 0) {
		return null;
	}

	const currency = cart.lines[0]!.product.default_price.currency;
	const total = calculateCartTotalNetWithoutShipping(cart);
	const t = await getTranslations("/cart.modal");
	const locale = await getLocale();

	return (
		<CartAsideContainer>
			<div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
				<div className="flex items-center justify-between">
					<h2 className="text-lg font-semibold text-neutral-700">{t("title")}</h2>
					<YnsLink replace href="/cart" className="text-sm text-muted-foreground underline">
						{t("openFullView")}
					</YnsLink>
				</div>

				<div className="mt-8">
					<ul role="list" className="-my-6 divide-y divide-neutral-200">
						{cart.lines.map((line) => (
							<li
								key={line.product.id}
								className="grid grid-cols-[4rem,1fr,max-content] grid-rows-[auto,auto] gap-x-4 gap-y-2 py-6"
							>
								{line.product.images[0] ? (
									<div className="col-span-1 row-span-2 bg-neutral-100">
										<Image
											className="aspect-square rounded-md object-cover"
											src={line.product.images[0]}
											width={80}
											height={80}
											alt=""
										/>
									</div>
								) : (
									<div className="col-span-1 row-span-2" />
								)}

								<h3 className="-mt-1 font-semibold leading-tight">
									{formatProductName(line.product.name, line.product.metadata.variant)}
								</h3>
								<p className="text-sm font-medium leading-none">
									{formatMoney({
										amount: line.product.default_price.unit_amount ?? 0,
										currency: line.product.default_price.currency,
										locale,
									})}
								</p>
								<p className="self-end text-sm font-medium text-muted-foreground">
									{t("quantity", { quantity: line.quantity })}
								</p>
							</li>
						))}
					</ul>
				</div>
			</div>

			<div className="border-t border-neutral-200 px-4 py-6 sm:px-6">
				<div
					id="cart-overlay-description"
					className="flex justify-between text-base font-medium text-neutral-900"
				>
					<p>{t("total")}</p>
					<p>
						{formatMoney({
							amount: total,
							currency,
							locale,
						})}
					</p>
				</div>
				<p className="mt-0.5 text-sm text-neutral-500">{t("shippingAndTaxesInfo")}</p>
				<Button asChild={true} size={"lg"} className="mt-6 w-full rounded-full text-lg">
					<YnsLink href="/cart">{t("goToPaymentButton")}</YnsLink>
				</Button>
			</div>
			{/* {searchParams.add && <CartModalAddSideEffect productId={searchParams.add} />} } */}
		</CartAsideContainer>
	);
}
