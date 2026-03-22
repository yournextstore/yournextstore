import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { commerce } from "@/lib/commerce";
import { getActiveCurrency } from "@/lib/currency";
import { formatMoney } from "@/lib/money";
import { getCachedTranslations, localePath } from "@/lib/translations";
import { getProductThumbnail } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";

export default async function OrderSuccessPage(props: { params: Promise<{ id: string; locale: string }> }) {
	const { locale } = await props.params;
	const currency = await getActiveCurrency(locale);
	return <OrderDetails params={props.params} locale={locale} currency={currency} />;
}

const OrderDetails = async ({
	params,
	locale,
	currency,
}: {
	params: Promise<{ id: string }>;
	locale: string;
	currency: string;
}) => {
	const { id } = await params;
	const [order, t] = await Promise.all([commerce.orderGet({ id }), getCachedTranslations(locale, "Order")]);

	if (!order) {
		notFound();
	}

	const lineItems = order.orderData.lineItems;
	const shippingAddress = order.orderData.shippingAddress;
	const shipping = order.orderData.shipping;
	const customer = order.orderData.customer;

	const subtotal = lineItems.reduce((acc, item) => {
		return acc + BigInt(item.productVariant.price) * BigInt(item.quantity);
	}, BigInt(0));

	const shippingCost = shipping ? BigInt(shipping.price) : BigInt(0);
	const total = subtotal + shippingCost;

	return (
		<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
			{/* Success Header */}
			<div className="text-center mb-10">
				<div className="flex justify-center mb-4">
					<div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
						<CheckCircle className="h-8 w-8 text-green-600" />
					</div>
				</div>
				<h1 className="text-3xl font-semibold tracking-tight">{t("thankYou")}</h1>
				<p className="text-muted-foreground mt-2">{t("orderConfirmed", { lookup: order.lookup })}</p>
				{customer?.email && (
					<p className="text-sm text-muted-foreground mt-1">
						{t("confirmationEmail", { email: customer.email })}
					</p>
				)}
			</div>

			{/* Order Items */}
			<div className="border border-border rounded-lg overflow-hidden">
				<div className="bg-secondary/50 px-6 py-4 border-b border-border">
					<h2 className="font-medium">{t("orderItems")}</h2>
				</div>
				<div className="divide-y divide-border">
					{lineItems.map((item) => (
						<OrderItem key={item.id} item={item} locale={locale} currency={currency} t={t} />
					))}
				</div>

				{/* Order Summary */}
				<div className="bg-secondary/30 px-6 py-4 space-y-2">
					<div className="flex items-center justify-between text-sm">
						<span className="text-muted-foreground">{t("subtotal")}</span>
						<span>{formatMoney({ amount: subtotal, currency, locale })}</span>
					</div>
					{shipping && (
						<div className="flex items-center justify-between text-sm">
							<span className="text-muted-foreground">{t("shipping", { name: shipping.name })}</span>
							<span>{formatMoney({ amount: shippingCost, currency, locale })}</span>
						</div>
					)}
					<div className="flex items-center justify-between font-semibold pt-2 border-t border-border">
						<span>{t("total")}</span>
						<span>{formatMoney({ amount: total, currency, locale })}</span>
					</div>
				</div>
			</div>

			{/* Shipping Address */}
			{shippingAddress && (
				<div className="border border-border rounded-lg overflow-hidden mt-6">
					<div className="bg-secondary/50 px-6 py-4 border-b border-border">
						<h2 className="font-medium">{t("shippingAddress")}</h2>
					</div>
					<div className="px-6 py-4 text-sm text-muted-foreground">
						{shippingAddress.name && <p className="text-foreground font-medium">{shippingAddress.name}</p>}
						{shippingAddress.line1 && <p>{shippingAddress.line1}</p>}
						{shippingAddress.line2 && <p>{shippingAddress.line2}</p>}
						<p>
							{[shippingAddress.city, shippingAddress.state, shippingAddress.postalCode]
								.filter(Boolean)
								.join(", ")}
						</p>
						{shippingAddress.country && <p>{shippingAddress.country}</p>}
					</div>
				</div>
			)}

			{/* Continue Shopping Button */}
			<div className="mt-8 text-center">
				<Button asChild>
					<Link prefetch={true} href={localePath(locale, "/")}>
						{t("continueShopping")}
					</Link>
				</Button>
			</div>
		</div>
	);
};

type OrderLineItem = {
	id: string;
	quantity: number;
	productVariant: {
		id: string;
		price: string;
		images: string[];
		product: {
			id: string;
			name: string;
			slug: string;
			images: string[];
		};
	};
};

function OrderItem({
	item,
	locale,
	currency,
	t,
}: {
	item: OrderLineItem;
	locale: string;
	currency: string;
	t: (key: string, values?: Record<string, string | number>) => string;
}) {
	const { productVariant, quantity } = item;
	const { product } = productVariant;

	const image = getProductThumbnail(productVariant.images) ?? getProductThumbnail(product.images);
	const price = BigInt(productVariant.price);
	const lineTotal = price * BigInt(quantity);

	return (
		<div className="flex gap-4 p-6">
			{/* Product Image */}
			<Link
				prefetch={true}
				href={localePath(locale, `/product/${product.slug}`)}
				className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-secondary"
			>
				{image && <YNSMedia src={image} alt={product.name} fill className="object-cover" sizes="80px" />}
			</Link>

			{/* Product Details */}
			<div className="flex min-w-0 flex-1 flex-col justify-between">
				<div>
					<Link
						prefetch={true}
						href={localePath(locale, `/product/${product.slug}`)}
						className="text-sm font-medium leading-tight text-foreground hover:underline line-clamp-2"
					>
						{product.name}
					</Link>
					<p className="text-sm text-muted-foreground mt-1">{t("qty", { quantity })}</p>
				</div>
				<p className="text-sm font-semibold">{formatMoney({ amount: lineTotal, currency, locale })}</p>
			</div>
		</div>
	);
}
