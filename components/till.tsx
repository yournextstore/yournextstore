"use client";

import { useId, useState } from "react";
import { toast } from "sonner";
import { addToCart } from "@/app/cart/actions";
import { useCart } from "@/app/cart/cart-context";
import { useStoreConfig } from "@/components/store-config-provider";
import { formatMoney } from "@/lib/money";
import { trackAddToCart } from "@/lib/track";

export type TillItem = {
	variantId: string;
	sku: string | null;
	price: string;
	priceGross: string | null;
	/** What the shopper pays per unit in the store's tax basis, minor units. */
	unit: string;
	images: string[];
	product: { id: string; name: string; slug: string; images: string[] };
};

/**
 * The original's till receipt, made real: pick a piece and a quantity, the receipt totals it, and
 * "Ring it up" puts it in the basket.
 */
export function Till({ storeName, items }: { storeName: string; items: TillItem[] }) {
	const { currency, locale } = useStoreConfig();
	const { openCart, dispatch, syncCart, reconcile, startMutation } = useCart();
	const id = useId();
	const [selected, setSelected] = useState(items[0]?.variantId ?? "");
	const [qty, setQty] = useState("1");
	const [rung, setRung] = useState<string | null>(null);

	const item = items.find((i) => i.variantId === selected) ?? items[0];
	const count = Math.min(99, Math.max(0, Math.round(Number(qty) || 0)));
	const total = item ? BigInt(item.unit) * BigInt(count) : 0n;
	const fmt = (amount: bigint) => formatMoney({ amount, currency, locale });

	const ring = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!item || count < 1) return;
		trackAddToCart({ id: item.variantId, sku: item.sku, price: item.price }, item.product.name, count);
		openCart();
		dispatch({
			type: "ADD_ITEM",
			item: {
				quantity: count,
				productVariant: {
					id: item.variantId,
					price: item.price,
					priceGross: item.priceGross,
					images: item.images,
					product: item.product,
				},
			},
		});
		setRung(fmt(total));
		startMutation(async () => {
			const result = await addToCart(item.variantId, count);
			const line = result.cart?.lineItems.find((l) => l.productVariant.id === item.variantId);
			if (result.success && result.cart && line) {
				syncCart(result.cart);
			} else {
				await reconcile();
				setRung(null);
				toast.error("This item is out of stock");
			}
		});
	};

	if (!item) return null;

	return (
		<div aria-live="polite">
			<form onSubmit={ring} className="receipt" noValidate>
				<p className="receipt-head mb-5">
					<strong>{storeName}</strong> the counter · till no. 1
				</p>
				{rung ? (
					<div className="px-2 py-6 text-center">
						<strong className="block font-display text-[1.5rem] font-[480]">In the basket.</strong>
						<span className="stamp mt-4">received — till no. 1</span>
						<span className="mt-4 block text-[0.7rem] text-faint">
							{rung} · {count} × {item.product.name}
						</span>
						<button
							type="button"
							className="tool-btn mt-5"
							onClick={() => {
								setRung(null);
								setQty("1");
							}}
						>
							Ring up another
						</button>
					</div>
				) : (
					<>
						<div className="mb-4">
							<label htmlFor={`${id}-item`} className="label-mono mb-1.5 block text-[0.68rem]">
								The item
							</label>
							<select
								id={`${id}-item`}
								className="field"
								value={item.variantId}
								onChange={(e) => setSelected(e.target.value)}
							>
								{items.map((i) => (
									<option key={i.variantId} value={i.variantId}>
										{i.product.name} — {fmt(BigInt(i.unit))}
									</option>
								))}
							</select>
						</div>
						<div className="grid grid-cols-[1fr_auto] items-end gap-4">
							<p className="mb-4 text-[0.7rem] text-faint">
								Delivery is worked out at checkout — nothing extra before then.
							</p>
							<div className="mb-4">
								<label htmlFor={`${id}-qty`} className="label-mono mb-1.5 block text-[0.68rem]">
									Qty
								</label>
								<input
									id={`${id}-qty`}
									type="number"
									inputMode="numeric"
									min={1}
									max={99}
									step={1}
									value={qty}
									onChange={(e) => setQty(e.target.value)}
									className="field w-[5.5rem] text-center"
								/>
							</div>
						</div>
						<div className="mb-5 flex items-baseline justify-between gap-4 border-y border-dashed border-line py-4">
							<span className="label-mono tracking-[0.16em]">Total</span>
							<output htmlFor={`${id}-item ${id}-qty`} className="font-display text-[1.7rem] font-[480]">
								{fmt(total)}
							</output>
						</div>
						<button type="submit" className="btn btn-primary w-full" disabled={count < 1}>
							Ring it up
						</button>
						<p className="mt-3.5 text-center text-[0.68rem] text-faint">
							Goes straight into your basket — pay when you’re ready.
						</p>
					</>
				)}
			</form>
		</div>
	);
}
