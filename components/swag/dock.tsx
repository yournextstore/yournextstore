"use client";

import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "@/app/cart/cart-context";
import { CartItem } from "@/app/cart/cart-item";
import { itemKey } from "@/app/cart/cart-math";
import { cartDiscountOf } from "@/app/cart/discount-code";
import { DiscountCodeField } from "@/app/cart/discount-code-field";
import { useStoreConfig } from "@/components/store-config-provider";
import { SwagMark } from "@/components/swag/mark";
import { formatMoney } from "@/lib/money";
import type { CartBucket } from "@/lib/swag";
import { cn } from "@/lib/utils";

export type DockLink = {
	href: string;
	label: string;
	short?: string;
	desktopOnly?: boolean;
	plain?: boolean;
};

function PlusIcon({ open }: { open: boolean }) {
	return (
		<svg
			viewBox="0 0 24 24"
			className={cn("h-6 w-6 transition-transform duration-300", open && "rotate-45")}
			aria-hidden="true"
		>
			<path d="M21.5 12H2.5M12 21.5V2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
		</svg>
	);
}

/**
 * The bottom dock: the original's sticky bar that carries the brand blocks and navigation on
 * the left two thirds, and the yellow cart panel with its black Total / Checkout bar on the
 * right third. Above `lg` the panel stands the full viewport height (collapsed to its toggle on
 * listing pages, which mark themselves with `data-wide`); on phones it is a bar that slides up.
 */
export function SwagDock({
	storeName,
	buckets,
	links,
}: {
	storeName: string;
	buckets: CartBucket[];
	links: DockLink[];
}) {
	const { currency, locale, language, taxBehavior } = useStoreConfig();
	const { cart, items, itemCount, subtotal, isMutating, isOpen, openCart, closeCart } = useCart();
	const discount = cartDiscountOf(cart, taxBehavior);
	const total = subtotal - (discount ?? 0n);
	const checkoutUrl = language ? `/checkout?lang=${encodeURIComponent(language)}` : "/checkout";

	useEffect(() => {
		if (!isOpen) {
			return;
		}
		const onKey = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				closeCart();
			}
		};
		document.addEventListener("keydown", onKey);
		return () => document.removeEventListener("keydown", onKey);
	}, [isOpen, closeCart]);

	const named = buckets.filter((b) => b.productIds !== null);
	const bucketOf = (productId: string) => {
		const index = named.findIndex((b) => b.productIds?.includes(productId));
		return index === -1 ? buckets.length - 1 : index;
	};
	const grouped = buckets.map((bucket, index) => ({
		bucket,
		lines: items.filter((item) => bucketOf(item.productVariant.product.id) === index),
	}));

	return (
		<div className="sticky bottom-0 z-40 flex w-full flex-col">
			<section
				aria-label="Cart"
				data-open={isOpen}
				className="swag-cart halftone flex w-full flex-col overflow-hidden bg-swag-yellow"
			>
				<button
					type="button"
					aria-expanded={isOpen}
					aria-controls="swag-cart-body"
					onClick={() => (isOpen ? closeCart() : openCart())}
					className="swag-cart-toggle flex h-10 w-full shrink-0 cursor-pointer items-center justify-between bg-swag-yellow px-2 text-t14 lg:px-5"
				>
					<span>
						Cart <span className="tabular-nums">({itemCount})</span>
					</span>
					<PlusIcon open={isOpen} />
				</button>
				<div id="swag-cart-body" className="swag-cart-body min-h-0 flex-col gap-4 p-4 lg:p-5">
					{grouped.map(({ bucket, lines }) => (
						<div key={bucket.label} className="relative flex min-h-0 flex-1 items-center bg-swag-yellow">
							<p className="absolute top-0 left-0 z-10 bg-black px-1 text-t14 text-white uppercase">
								{bucket.label} <span className="tabular-nums">({lines.length})</span>
							</p>
							{lines.length > 0 ? (
								<ul className="flex h-full w-full gap-2 overflow-x-auto pt-6">
									{lines.map((item) => (
										<CartItem key={itemKey(item)} item={item} />
									))}
								</ul>
							) : (
								<Link
									href={bucket.href}
									onClick={closeCart}
									className="flex h-full w-full items-center justify-center border border-transparent px-4 pt-6 text-center text-t14 uppercase hover:border-black"
								>
									Select {bucket.label}
								</Link>
							)}
						</div>
					))}
					{items.length > 0 && <DiscountCodeField />}
				</div>
				{/* Plain <a>: /checkout is another zone, a soft navigation would 500. Blocked while
				    a cart write is in flight so the checkout never opens on a stale cart. */}
				<a
					href={checkoutUrl}
					aria-disabled={isMutating}
					tabIndex={isMutating ? -1 : undefined}
					onClick={(e) => {
						if (isMutating) {
							e.preventDefault();
						}
					}}
					className={cn(
						"group flex h-10 w-full shrink-0 items-center justify-between bg-black px-5 text-white",
						isMutating && "pointer-events-none",
					)}
				>
					<span className="text-t14 group-hover:text-swag-yellow">
						Total <span className="tabular-nums">({itemCount})</span>:{" "}
						{discount ? (
							<span className="mr-2 line-through opacity-75">
								{formatMoney({ amount: subtotal, currency, locale })}
							</span>
						) : null}
						<span className="tabular-nums">{formatMoney({ amount: total, currency, locale })}</span>
					</span>
					<span className="inline-flex items-center gap-2 font-sans text-t16 font-bold group-hover:text-swag-yellow">
						{isMutating && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
						Checkout
					</span>
				</a>
			</section>

			<header className="flex h-10 w-full items-center justify-between bg-white lg:w-2/3">
				<Link href="/" className="flex h-full min-w-0 items-center" onClick={closeCart}>
					<span className="hidden h-full min-w-[100px] items-center justify-center bg-swag-orange px-3 font-sans text-t18 font-bold tracking-tight text-black lg:inline-flex">
						{storeName}
					</span>
					<span className="halftone inline-flex h-full w-[45px] shrink-0 items-center justify-center bg-white">
						<SwagMark className="h-[26px] w-[26px] text-black" />
					</span>
					<span className="inline-flex h-full min-w-0 items-center bg-black px-3 font-sans text-t18 text-white lg:w-60 lg:px-4">
						<span className="truncate lg:hidden">{storeName}</span>
						<span className="hidden lg:inline">Shop</span>
					</span>
				</Link>
				<nav
					aria-label="Main"
					className="flex shrink-0 items-center gap-4 pr-3 pl-3 text-t14 uppercase lg:gap-6 lg:pr-6"
				>
					{links.map((link) => {
						const className = cn("hover:underline", link.desktopOnly && "hidden lg:inline");
						const label = link.short ? (
							<>
								<span className="lg:hidden">{link.short}</span>
								<span className="hidden lg:inline">{link.label}</span>
							</>
						) : (
							link.label
						);
						// Account is another zone: a plain <a>, never a soft navigation.
						return link.plain ? (
							<a key={link.href} href={link.href} className={className}>
								{label}
							</a>
						) : (
							<Link key={link.href} href={link.href} className={className} onClick={closeCart}>
								{label}
							</Link>
						);
					})}
				</nav>
			</header>
		</div>
	);
}
