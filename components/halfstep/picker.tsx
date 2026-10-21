"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { addToCart } from "@/app/cart/actions";
import { useCart } from "@/app/cart/cart-context";
import { useStoreConfig } from "@/components/store-config-provider";
import { formatMoney } from "@/lib/money";
import { trackAddToCart } from "@/lib/track";
import { YNSMedia } from "@/lib/yns-media";

export type PickItem = {
	id: string;
	slug: string;
	name: string;
	summary: string | null;
	image: string | null;
	/** Display amount in minor units, as a string (bigint does not cross the server boundary). */
	amount: string | null;
	variantCount: number;
	/** The one buyable variant of a single-variant product; null sends the shopper to the product page. */
	variant: {
		id: string;
		sku: string | null;
		price: string;
		priceGross: string | null;
		images: string[];
		stock: number | null;
	} | null;
};

/**
 * The original's configurator ("Three decisions. We made the rest.") as a product picker: real
 * products as option cards, a summary card with the live price count-up and a working add to cart.
 */
export function Picker({ items, shipping }: { items: PickItem[]; shipping: string | null }) {
	const { currency, locale } = useStoreConfig();
	const { openCart, dispatch, syncCart, reconcile, startMutation } = useCart();
	const [selectedId, setSelectedId] = useState(items[0]?.id ?? "");
	const selected = items.find((item) => item.id === selectedId) ?? items[0];
	const target = selected?.amount ? Number(selected.amount) : 0;
	const [shown, setShown] = useState(target);
	const shownRef = useRef(target);

	useEffect(() => {
		const from = shownRef.current;
		if (from === target || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			shownRef.current = target;
			setShown(target);
			return;
		}
		const start = performance.now();
		let raf = 0;
		const tick = (now: number) => {
			const p = Math.min(1, (now - start) / 450);
			const value = Math.round(from + (target - from) * (1 - (1 - p) ** 3));
			shownRef.current = value;
			setShown(value);
			if (p < 1) raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	}, [target]);

	if (!selected) return null;

	const fmt = (amount: number) => formatMoney({ amount: BigInt(amount), currency, locale });
	const variant = selected.variant;
	const outOfStock = variant?.stock === 0;

	const add = () => {
		if (!variant || outOfStock) return;
		trackAddToCart({ id: variant.id, sku: variant.sku, price: variant.price }, selected.name, 1);
		openCart();
		const product = {
			id: selected.id,
			name: selected.name,
			slug: selected.slug,
			images: selected.image ? [selected.image] : [],
		};
		dispatch({
			type: "ADD_ITEM",
			item: {
				quantity: 1,
				productVariant: {
					id: variant.id,
					price: variant.price,
					priceGross: variant.priceGross,
					images: variant.images,
					product,
				},
			},
		});
		startMutation(async () => {
			const result = await addToCart(variant.id, 1);
			const line = result.cart?.lineItems.find((item) => item.productVariant.id === variant.id);
			if (result.success && result.cart && line) {
				syncCart(result.cart);
			} else {
				await reconcile();
				toast.error("This item is out of stock");
			}
		});
	};

	return (
		<div className="grid items-start gap-6 md:gap-10 lg:grid-cols-[1.15fr_0.85fr]">
			<fieldset className="m-0 min-w-0 border-0 p-0" data-reveal="">
				<legend className="hs-label mb-3 p-0">01 · Pick a part</legend>
				<div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
					{items.map((item) => (
						<label key={item.id} className="hs-opt-wrap">
							<input
								type="radio"
								name="pick"
								value={item.id}
								checked={item.id === selected.id}
								onChange={() => setSelectedId(item.id)}
								className="hs-opt-input"
							/>
							<span className="hs-opt h-full">
								<strong>{item.name}</strong>
								<small>{item.amount ? fmt(Number(item.amount)) : "—"}</small>
							</span>
						</label>
					))}
				</div>
				<p className="hs-mono mt-4 text-[0.7rem] text-faint">
					Prices are live from the catalogue. Every summary on the right is the product's own.
				</p>
			</fieldset>

			<aside className="hs-panel p-5 sm:p-6 lg:sticky lg:top-24" aria-label="Your pick" data-reveal="">
				<div className="hs-plate relative mb-4 aspect-[4/3] overflow-hidden rounded-[12px]">
					{selected.image && (
						<YNSMedia
							key={selected.image}
							src={selected.image}
							alt=""
							fill
							sizes="(max-width: 1024px) 100vw, 420px"
							className="object-cover"
						/>
					)}
				</div>
				<p className="hs-label">Your pick</p>
				<h3 className="hs-display mb-3 mt-1 text-[1.25rem]">{selected.name}</h3>
				{selected.summary && (
					<p className="mb-3 line-clamp-3 text-[0.9rem] text-muted-foreground">{selected.summary}</p>
				)}
				<dl className="mb-4">
					<div className="flex items-baseline justify-between gap-4 border-b border-line-soft py-2.5">
						<dt className="hs-label">Options</dt>
						<dd className="text-[0.92rem] font-bold">
							{selected.variantCount > 1 ? `${selected.variantCount} variants` : "One finish"}
						</dd>
					</div>
					<div className="flex items-baseline justify-between gap-4 border-b border-line-soft py-2.5">
						<dt className="hs-label">Shipping</dt>
						<dd className="text-right text-[0.92rem] font-bold">{shipping ?? "Calculated at checkout"}</dd>
					</div>
					<div className="flex items-baseline justify-between gap-4 border-b border-line-soft py-2.5">
						<dt className="hs-label">Availability</dt>
						<dd className="text-[0.92rem] font-bold">{outOfStock ? "Out of stock" : "In stock"}</dd>
					</div>
				</dl>
				<div className="mb-4 flex items-baseline justify-between gap-4">
					<span className="hs-label">Price</span>
					<strong className="hs-display text-[2rem] normal-case tracking-[-0.02em]">
						<span aria-hidden="true">{fmt(shown)}</span>
						<span className="sr-only">{selected.amount ? fmt(Number(selected.amount)) : ""}</span>
					</strong>
				</div>
				{variant ? (
					<button
						type="button"
						onClick={add}
						disabled={outOfStock}
						className="hs-btn hs-btn-primary hs-btn-block"
					>
						{outOfStock ? "Out of stock" : `Add ${selected.name} to cart`}
					</button>
				) : (
					<Link href={`/product/${selected.slug}`} className="hs-btn hs-btn-primary hs-btn-block">
						Choose options
					</Link>
				)}
				<Link
					href={`/product/${selected.slug}`}
					className="hs-mono mt-3 block text-center text-[0.72rem] text-muted-foreground hover:text-signal"
				>
					Full details →
				</Link>
			</aside>
		</div>
	);
}
