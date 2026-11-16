import type { APIOrderGetByIdResult } from "commerce-kit";
import { CheckCircle } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { commerce } from "@/lib/commerce";
import { apiStructuredData, JsonLdScript } from "@/lib/json-ld";
import { formatMoney } from "@/lib/money";
import { displayPrice } from "@/lib/pricing";
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
	const { currency, locale, taxBehavior: storeTaxBehavior } = await getStoreConfig();
	const order = await commerce.orderGet({ id });

	if (!order) {
		notFound();
	}

	const { lineItems, shippingAddress, shipping, customer } = order.orderData;
	const courses = order.courses ?? [];
	const invoice = orderInvoice(order);
	const money = (amount: number) => formatMoney({ amount: BigInt(Math.round(amount)), currency, locale });

	// The order's own totals, printed as stored: with tax when the store showed prices with tax
	// (as the order recorded it), without otherwise.
	// `shippingNet` and `discountCodes` are newer than the pinned commerce-kit types.
	const orderData: typeof order.orderData & {
		shippingNet?: number | null;
		discountCodes?: Array<{ code: string; amountNet: number; amountGross: number }> | null;
	} = order.orderData;
	const taxIncluded = (orderData.taxBehavior ?? storeTaxBehavior) === "inclusive";
	const pick = <T,>(net: T, gross: T) => (taxIncluded ? gross : net);
	const subtotal = pick(orderData.subtotalNet, orderData.subtotalGross);
	const shippingCost = pick(orderData.shippingNet ?? null, orderData.shippingGross);
	const discountCodes = orderData.discountCodes ?? [];
	const totalTax = orderData.totalTax;
	const charged = orderData.totalGross ?? orderData.total;

	const orderJsonLd = apiStructuredData(order);

	return (
		<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
			{orderJsonLd && <JsonLdScript data={orderJsonLd} />}
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

			{/* Courses (dormant: only an order that grants a course has any). Older platform versions
			    don't send the field, so it may be missing at runtime. */}
			{courses.length > 0 && (
				<div className="mb-10 rounded-lg border border-border p-6 text-center">
					<h2 className="font-medium">
						{courses.length === 1 ? "Your course is ready" : "Your courses are ready"}
					</h2>
					<p className="text-sm text-muted-foreground mt-1">
						Sign in to your account with {customer?.email ?? "the email you ordered with"} to open it.
					</p>
					<div className="mt-4 flex flex-wrap justify-center gap-2">
						{courses.map((course) => (
							<a key={course.url} href={course.url} className={buttonVariants()}>
								{courses.length === 1 ? "Go to course" : course.title}
							</a>
						))}
					</div>
				</div>
			)}

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

				{/* Order Summary: the order's stored totals, printed as they come. */}
				{subtotal !== null && charged !== null && (
					<div className="bg-secondary/30 px-6 py-4 space-y-2">
						<div className="flex items-center justify-between text-sm">
							<span className="text-muted-foreground">Subtotal</span>
							<span>{money(subtotal)}</span>
						</div>
						{discountCodes.map((entry) => (
							<div key={entry.code} className="flex items-center justify-between text-sm">
								<span className="text-muted-foreground">Discount ({entry.code})</span>
								<span>−{money(pick(entry.amountNet, entry.amountGross))}</span>
							</div>
						))}
						{shipping && shippingCost !== null && (
							<div className="flex items-center justify-between text-sm">
								<span className="text-muted-foreground">Shipping ({shipping.name})</span>
								<span>{money(shippingCost)}</span>
							</div>
						)}
						{totalTax !== null && totalTax > 0 && (
							<div className="flex items-center justify-between text-sm">
								<span className="text-muted-foreground">{taxIncluded ? "Includes tax" : "Tax"}</span>
								<span>{money(totalTax)}</span>
							</div>
						)}
						<div className="flex items-center justify-between font-semibold pt-2 border-t border-border">
							<span>Total</span>
							<span>{money(charged)}</span>
						</div>
					</div>
				)}
			</div>

			{/* Invoice (YNS-5560): the store's own invoice once it is issued, usually once the order is
			    paid. Older platform versions don't send the field. The link is a signed download on the
			    platform domain, so it is a plain <a>. */}
			{invoice && (
				<div className="border border-border rounded-lg mt-6 px-6 py-4 flex flex-wrap items-center justify-between gap-3">
					<div className="text-sm">
						<h2 className="font-medium">Invoice</h2>
						<p className="text-muted-foreground mt-1 break-all">{invoice.number}</p>
					</div>
					<a href={invoice.downloadUrl} className={buttonVariants({ variant: "outline", size: "sm" })}>
						Download PDF
					</a>
				</div>
			)}

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
				<Link href="/" className={buttonVariants()}>
					Continue Shopping
				</Link>
			</div>
		</div>
	);
};

/**
 * The order's invoice as the platform sends it (`invoice: { number, issuedAt, downloadUrl } | null`).
 * Read defensively: commerce-kit types and older platform versions don't have the field yet.
 */
function orderInvoice(order: object) {
	const invoice = "invoice" in order ? order.invoice : null;
	if (typeof invoice !== "object" || invoice === null) return null;
	const number = "number" in invoice ? invoice.number : null;
	const downloadUrl = "downloadUrl" in invoice ? invoice.downloadUrl : null;
	return typeof number === "string" && typeof downloadUrl === "string" ? { number, downloadUrl } : null;
}

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
