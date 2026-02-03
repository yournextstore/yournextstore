import { cacheLife } from "next/cache";
import { notFound } from "next/navigation";
import { MaterialIcon } from "@/components/icons/material-icon";
import { Button } from "@/components/ui/button";
import { YnsLink } from "@/components/yns-link";
import { commerce } from "@/lib/commerce";
import { CURRENCY, LOCALE } from "@/lib/constants";
import { formatMoney } from "@/lib/money";
import { YNSImage } from "@/lib/yns-image";

export default async function OrderSuccessPage(props: { params: Promise<{ id: string }> }) {
	"use cache";
	cacheLife("seconds");

	return <OrderDetails params={props.params} />;
}

const OrderDetails = async ({ params }: { params: Promise<{ id: string }> }) => {
	const { id } = await params;
	const order = await commerce.orderGet({ id });

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
		<div className="bg-background-dark min-h-screen">
			<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				{/* Success Header */}
				<div className="text-center mb-10">
					<div className="flex justify-center mb-4">
						<div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/20">
							<MaterialIcon name="check_circle" className="text-5xl text-primary" />
						</div>
					</div>
					<h1 className="text-3xl font-bold tracking-tight text-white">Thank you for your order!</h1>
					<p className="text-gray-400 mt-2">Order #{order.lookup} has been confirmed</p>
					{customer?.email && (
						<p className="text-sm text-gray-500 mt-1">
							A confirmation email will be sent to {customer.email}
						</p>
					)}
				</div>

				{/* Order Items */}
				<div className="border border-border rounded-xl overflow-hidden bg-dark-accent">
					<div className="bg-background-dark px-6 py-4 border-b border-border">
						<h2 className="font-semibold text-white">Order Items</h2>
					</div>
					<div className="divide-y divide-border">
						{lineItems.map((item) => (
							<OrderItem key={item.id} item={item} />
						))}
					</div>

					{/* Order Summary */}
					<div className="bg-background-dark px-6 py-4 space-y-2">
						<div className="flex items-center justify-between text-sm">
							<span className="text-gray-400">Subtotal</span>
							<span className="text-white">
								{formatMoney({ amount: subtotal, currency: CURRENCY, locale: LOCALE })}
							</span>
						</div>
						{shipping && (
							<div className="flex items-center justify-between text-sm">
								<span className="text-gray-400">Shipping ({shipping.name})</span>
								<span className="text-white">
									{formatMoney({ amount: shippingCost, currency: CURRENCY, locale: LOCALE })}
								</span>
							</div>
						)}
						<div className="flex items-center justify-between font-semibold pt-2 border-t border-border">
							<span className="text-white">Total</span>
							<span className="text-primary text-lg">
								{formatMoney({ amount: total, currency: CURRENCY, locale: LOCALE })}
							</span>
						</div>
					</div>
				</div>

				{/* Shipping Address */}
				{shippingAddress && (
					<div className="border border-border rounded-xl overflow-hidden mt-6 bg-dark-accent">
						<div className="bg-background-dark px-6 py-4 border-b border-border">
							<h2 className="font-semibold text-white">Shipping Address</h2>
						</div>
						<div className="px-6 py-4 text-sm text-gray-400">
							{shippingAddress.name && <p className="text-white font-medium">{shippingAddress.name}</p>}
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
					<Button
						asChild
						className="bg-primary hover:bg-green-600 text-white rounded-full px-8 py-3 shadow-lg shadow-primary/30"
					>
						<YnsLink prefetch="eager" href="/">
							Continue Shopping
						</YnsLink>
					</Button>
				</div>
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

function OrderItem({ item }: { item: OrderLineItem }) {
	const { productVariant, quantity } = item;
	const { product } = productVariant;

	const image = productVariant.images[0] ?? product.images[0];
	const price = BigInt(productVariant.price);
	const lineTotal = price * BigInt(quantity);

	return (
		<div className="flex gap-4 p-6">
			{/* Product Image */}
			<YnsLink
				prefetch="eager"
				href={`/product/${product.slug}`}
				className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg product-card-bg"
			>
				{image && <YNSImage src={image} alt={product.name} fill className="object-cover" sizes="80px" />}
			</YnsLink>

			{/* Product Details */}
			<div className="flex min-w-0 flex-1 flex-col justify-between">
				<div>
					<YnsLink
						prefetch="eager"
						href={`/product/${product.slug}`}
						className="text-sm font-medium leading-tight text-white hover:text-primary transition-colors line-clamp-2"
					>
						{product.name}
					</YnsLink>
					<p className="text-sm text-gray-400 mt-1">Qty: {quantity}</p>
				</div>
				<p className="text-sm font-semibold text-primary">
					{formatMoney({ amount: lineTotal, currency: CURRENCY, locale: LOCALE })}
				</p>
			</div>
		</div>
	);
}
