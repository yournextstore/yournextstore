"use client";

import { Star } from "lucide-react";
import { useTransition } from "react";
import { addToCart } from "@/app/cart/actions";
import { useCart } from "@/app/cart/cart-context";
import { CURRENCY, LOCALE } from "@/lib/constants";
import { formatMoney } from "@/lib/money";
import { cn } from "@/lib/utils";

type TicketCardProps = {
	product: {
		id: string;
		name: string;
		slug: string;
		summary: string | null;
		images: string[];
		variants: {
			id: string;
			price: string;
			images: string[];
		}[];
	};
	featured?: boolean;
	tierLabel?: string;
};

function parseFeatures(summary: string | null): { text: string; included: boolean }[] {
	if (!summary) return [];
	return summary
		.split("\n")
		.filter(Boolean)
		.map((line) => {
			const isExcluded = line.startsWith("-");
			return {
				text: isExcluded ? line.slice(1).trim() : line.trim(),
				included: !isExcluded,
			};
		});
}

export function TicketCard({ product, featured = false, tierLabel = "Standard" }: TicketCardProps) {
	const [isPending, startTransition] = useTransition();
	const { openCart, dispatch } = useCart();

	const variant = product.variants[0];
	if (!variant) return null;

	const price = formatMoney({ amount: BigInt(variant.price), currency: CURRENCY, locale: LOCALE });
	const features = parseFeatures(product.summary);

	const handleAddToCart = () => {
		openCart();
		startTransition(async () => {
			dispatch({
				type: "ADD_ITEM",
				item: {
					quantity: 1,
					productVariant: {
						id: variant.id,
						price: variant.price,
						images: variant.images.length > 0 ? variant.images : product.images,
						product: {
							id: product.id,
							name: product.name,
							slug: product.slug,
							images: product.images,
						},
					},
				},
			});
			await addToCart(variant.id, 1);
		});
	};

	return (
		<button
			type="button"
			onClick={handleAddToCart}
			disabled={isPending}
			className={cn(
				"p-6 md:p-8 border-b md:border-b-0 md:border-r border-foreground/10 transition-all group cursor-pointer text-left relative",
				featured ? "bg-primary/5 hover:bg-primary hover:text-white" : "hover:bg-secondary/50",
			)}
		>
			{/* Star icon on hover (non-featured) */}
			{!featured && (
				<div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
					<Star className="w-5 h-5 text-primary" />
				</div>
			)}

			{/* Most Popular badge */}
			{featured && (
				<div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-white text-[10px] uppercase font-bold px-3 py-1 border-x border-b border-white/20 z-20">
					Most Popular
				</div>
			)}

			<h4 className="font-mono text-xs uppercase tracking-widest opacity-60 mb-2 group-hover:text-current/80">
				{tierLabel}
			</h4>
			<h3 className="text-2xl font-bold uppercase mb-4">{product.name}</h3>

			<ul className="text-sm space-y-2 mb-8 font-mono opacity-80 group-hover:text-current/90">
				{features.map((feature) => (
					<li
						key={feature.text}
						className={cn("flex items-center", !feature.included && "text-muted-foreground/50 line-through")}
					>
						<span
							className={cn(
								"w-1 h-1 rounded-full mr-2",
								feature.included ? "bg-primary group-hover:bg-current" : "bg-muted-foreground/50",
							)}
						/>
						{feature.text}
					</li>
				))}
			</ul>

			<div
				className={cn(
					"text-3xl font-bold",
					featured ? "text-primary group-hover:text-white" : "text-primary",
				)}
			>
				{isPending ? "Adding..." : price}
			</div>
		</button>
	);
}
