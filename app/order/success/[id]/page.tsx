import type { APIOrderGetByIdResult } from "commerce-kit";
import { CheckCircle } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { commerce } from "@/lib/commerce";
import { formatMoney } from "@/lib/money";
import { cartDisplaySubtotal, displayAmount, displayPrice } from "@/lib/pricing";
import { getStoreConfig } from "@/lib/store-config";
import { getProductThumbnail } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";

export const metadata: Metadata = {
	title: "Order Confirmed",
	robots: { index: false, follow: false },
};

function OrderSkeleton() {
	return (
		<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
			<div className="text-center mb-10 flex flex-col items-center">
				<Skeleton className="h-16 w-16 rounded-full" />
				<Skeleton className="mt-4 h-8 w-72" />
				<Skeleton className="mt-3 h-4 w-52" />
			</div>
			<Skeleton className="h-64 rounded-lg" />
		</div>
	);
}

// Awaiting params at the top of the page blocks the static shell — the page
// stays a sync shell and the order details stream inside Suspense. The order
// fetch stays uncached so the confirmation always reflects the latest state.
export default function OrderSuccessPage(props: { params: Promise<{ id: string }> }) {
	return (
		<Suspense fallback={<OrderSkeleton />}>
			<OrderDetails params={props.params} />
		</Suspense>
	);
}

const OrderDetails = async ({ params }: { params: Promise<{ id: string }> }) => {
	const { id } = await params;
	const { currency, locale, taxBehavior } = await getStoreConfig();
	const order = await commerce.orderGet({ id });

	if (!order) {
		notFound();
	}

	const { lineItems, shippingAddress, shipping, customer } = order.orderData;

	// The order's own totals are authoritative — they are what the customer was charged,
	// already net or gross per the store's tax behaviour. Fall back to a line-item sum
	// only when the order predates them (or the store prices through Stripe Tax).
	const apiSubtotal = cartDisplaySubtotal(order.orderData, taxBehavior);
	const subtotal =
		apiSubtotal !== null
			? BigInt(Math.round(apiSubtotal))
			: lineItems.reduce(
					(acc, item) => acc + BigInt(displayPrice(item.productVariant, taxBehavior)) * BigInt(item.quantity),
					BigInt(0),
				);

	// The shipping rate carries its own gross twin, so the row shows what the customer paid for
	// delivery in the same basis as every other price on the page.
	const shippingCost = shipping
		? BigInt(displayAmount(shipping.price, shipping.priceGross, taxBehavior) ?? shipping.price)
		: BigInt(0);

	// Only an exclusive store adds tax on top of what it displayed; an inclusive one has
	// it inside the subtotal already.
	const taxAmount =
		taxBehavior === "exclusive" && order.orderData.totalTax
			? BigInt(Math.round(order.orderData.totalTax))
			: null;

	const apiTotal = order.orderData.total;
	const total =
		apiTotal !== null && apiTotal !== undefined
			? BigInt(Math.round(apiTotal))
			: subtotal + shippingCost + (taxAmount ?? BigInt(0));

	return (
		<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
			{/* Success Header */}
			<div className="text-center mb-10">
				<div className="flex justify-center mb-4">
					<div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
						<CheckCircle className="h-8 w-8 text-green-600" />
					</div>
				</div>
				<h1 className="text-3xl font-semibold tracking-tight">Thank you for your order!</h1>
				<p className="text-muted-foreground mt-2">Order #{order.lookup} has been confirmed</p>
				{customer?.email && (
					<p className="text-sm text-muted-foreground mt-1">
						A confirmation email will be sent to {customer.email}
					</p>
				)}
			</div>

			{/* Order Items */}
			<div className="border border-border rounded-lg overflow-hidden">
				<div className="bg-secondary/50 px-6 py-4 border-b border-border">
					<h2 className="font-medium">Order Items</h2>
				</div>
				<div className="divide-y divide-border">
					{lineItems.map((item) => (
						<OrderItem key={item.id} item={item} />
					))}
				</div>

				{/* Order Summary */}
				<div className="bg-secondary/30 px-6 py-4 space-y-2">
					<div className="flex items-center justify-between text-sm">
						<span className="text-muted-foreground">Subtotal</span>
						<span>{formatMoney({ amount: subtotal, currency, locale })}</span>
					</div>
					{shipping && (
						<div className="flex items-center justify-between text-sm">
							<span className="text-muted-foreground">Shipping ({shipping.name})</span>
							<span>{formatMoney({ amount: shippingCost, currency, locale })}</span>
						</div>
					)}
					{taxAmount !== null && (
						<div className="flex items-center justify-between text-sm">
							<span className="text-muted-foreground">Tax</span>
							<span>{formatMoney({ amount: taxAmount, currency, locale })}</span>
						</div>
					)}
					<div className="flex items-center justify-between font-semibold pt-2 border-t border-border">
						<span>Total</span>
						<span>{formatMoney({ amount: total, currency, locale })}</span>
					</div>
				</div>
			</div>

			{/* Shipping Address */}
			{shippingAddress && (
				<div className="border border-border rounded-lg overflow-hidden mt-6">
					<div className="bg-secondary/50 px-6 py-4 border-b border-border">
						<h2 className="font-medium">Shipping Address</h2>
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
					<Link href="/">Continue Shopping</Link>
				</Button>
			</div>
		</div>
	);
};

// Taken from the API type rather than restated: the line item's variant carries the gross twins
// (`priceGross`, `calculatedPriceGross`, …) that `displayPrice` picks from.
type OrderLineItem = APIOrderGetByIdResult["orderData"]["lineItems"][number];

async function OrderItem({ item }: { item: OrderLineItem }) {
	const { currency, locale, taxBehavior } = await getStoreConfig();
	const { productVariant, quantity } = item;
	const { product } = productVariant;

	const image = getProductThumbnail(productVariant.images) ?? getProductThumbnail(product.images);
	const price = BigInt(displayPrice(productVariant, taxBehavior));
	const lineTotal = price * BigInt(quantity);

	return (
		<div className="flex gap-4 p-6">
			{/* Product Image */}
			<Link
				href={`/product/${product.slug}`}
				className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-secondary"
			>
				{image && <YNSMedia src={image} alt={product.name} fill className="object-cover" sizes="80px" />}
			</Link>

			{/* Product Details */}
			<div className="flex min-w-0 flex-1 flex-col justify-between">
				<div>
					<Link
						href={`/product/${product.slug}`}
						className="text-sm font-medium leading-tight text-foreground hover:underline line-clamp-2"
					>
						{product.name}
					</Link>
					<p className="text-sm text-muted-foreground mt-1">Qty: {quantity}</p>
				</div>
				<p className="text-sm font-semibold">{formatMoney({ amount: lineTotal, currency, locale })}</p>
			</div>
		</div>
	);
}
