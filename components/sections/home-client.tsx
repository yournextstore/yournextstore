"use client";

import { ChevronLeft, ChevronRight, Minus, Plus, X } from "lucide-react";
import Link from "next/link";
import { type ReactNode, useEffect, useId, useState } from "react";
import { toast } from "sonner";
import { addToCart } from "@/app/cart/actions";
import { useCart } from "@/app/cart/cart-context";
import { useStoreConfig } from "@/components/store-config-provider";
import { formatMoney } from "@/lib/money";
import { displayPrice } from "@/lib/pricing";
import { trackAddToCart } from "@/lib/track";
import { cn } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";

/**
 * The original's hero slideshow: full-bleed slides that cross-fade, a progress line under the
 * copy that fills while a slide is shown, and two square arrow chips bottom-right. Slides are
 * server-rendered; this only decides which one is visible.
 */
export function Slideshow({ slides, interval = 6000 }: { slides: ReactNode[]; interval?: number }) {
	const [index, setIndex] = useState(0);
	const [paused, setPaused] = useState(false);
	const count = slides.length;

	useEffect(() => {
		if (count < 2 || paused) return;
		const timer = window.setTimeout(() => setIndex((i) => (i + 1) % count), interval);
		return () => window.clearTimeout(timer);
	}, [count, interval, paused]);

	const chip =
		"flex h-10 w-10 items-center justify-center rounded-md bg-white/90 text-foreground transition-colors hover:bg-white";

	return (
		<section
			aria-label="Featured"
			className="relative h-[calc(100svh-5.75rem)] max-h-[52.5rem] min-h-[32rem] overflow-hidden bg-ink lg:h-[calc(100svh-8.5rem)]"
			onFocusCapture={() => setPaused(true)}
			onBlurCapture={() => setPaused(false)}
		>
			{slides.map((slide, i) => (
				<div
					key={i}
					aria-hidden={i !== index}
					inert={i !== index}
					className={cn(
						"absolute inset-0 transition-opacity duration-700",
						i === index ? "opacity-100" : "pointer-events-none opacity-0",
					)}
				>
					{slide}
				</div>
			))}
			{count > 1 && (
				<>
					<div className="pointer-events-none absolute inset-x-0 bottom-10 z-10">
						<div className="shell">
							<div className="flex w-40 gap-1" aria-hidden="true">
								{slides.map((_, i) => (
									<span key={i} className="relative h-0.5 flex-1 overflow-hidden bg-white/35">
										<span
											key={i === index ? `on-${index}` : "off"}
											className={cn(
												"absolute inset-0 origin-left bg-white",
												i < index && "scale-x-100",
												i > index && "scale-x-0",
												i === index && !paused && "animate-[slide-progress_linear_forwards]",
											)}
											style={i === index ? { animationDuration: `${interval}ms` } : undefined}
										/>
									</span>
								))}
							</div>
						</div>
					</div>
					<div className="absolute right-5 bottom-20 z-10 hidden gap-2 md:right-10 md:flex">
						<button
							type="button"
							aria-label="Previous slide"
							className={chip}
							onClick={() => setIndex((i) => (i - 1 + count) % count)}
						>
							<ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
						</button>
						<button
							type="button"
							aria-label="Next slide"
							className={chip}
							onClick={() => setIndex((i) => (i + 1) % count)}
						>
							<ChevronRight className="h-4 w-4" strokeWidth={1.5} />
						</button>
					</div>
				</>
			)}
		</section>
	);
}

export type HotspotProduct = {
	slug: string;
	name: string;
	image: string | null;
	price: string | null;
	x: number;
	y: number;
};

/**
 * Shop-the-look pin: a white dot in a breathing ring; pressing it opens a small product card
 * next to it (above or below depending on where the pin sits).
 */
export function Hotspot({ product }: { product: HotspotProduct }) {
	const [open, setOpen] = useState(false);
	const id = useId();
	const below = product.y < 50;
	const alignRight = product.x > 60;

	return (
		<div className="absolute z-10" style={{ left: `${product.x}%`, top: `${product.y}%` }}>
			<button
				type="button"
				aria-expanded={open}
				aria-controls={id}
				aria-label={`${open ? "Hide" : "Show"} ${product.name}`}
				onClick={() => setOpen((o) => !o)}
				className="relative -mt-4 -ml-4 flex h-8 w-8 items-center justify-center"
			>
				<span
					aria-hidden="true"
					className="hotspot-ring absolute inset-0 rounded-full border border-white/90"
				/>
				<span aria-hidden="true" className="absolute inset-1 rounded-full border border-white/70" />
				<span aria-hidden="true" className="h-2 w-2 rounded-full bg-white shadow" />
			</button>
			<div
				id={id}
				hidden={!open}
				className={cn(
					"absolute w-60 rounded-md bg-white p-3 text-left shadow-[0_8px_24px_rgb(0_0_0/0.16)]",
					below ? "top-6" : "bottom-6",
					alignRight ? "right-0 translate-x-4" : "left-0 -translate-x-4",
				)}
			>
				<div className="flex gap-3">
					<div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xs bg-stage">
						{product.image && (
							<YNSMedia src={product.image} alt="" fill sizes="64px" className="object-cover" />
						)}
					</div>
					<div className="min-w-0 flex-1">
						<Link
							href={`/product/${product.slug}`}
							className="line-clamp-2 text-[13px] leading-snug uppercase hover:underline"
						>
							{product.name}
						</Link>
						{product.price && <p className="mt-1 text-[13px] tabular-nums">{product.price}</p>}
					</div>
					<button
						type="button"
						aria-label="Close"
						onClick={() => setOpen(false)}
						className="-mt-1 -mr-1 flex h-6 w-6 shrink-0 items-center justify-center text-muted-foreground hover:text-foreground"
					>
						<X className="h-3.5 w-3.5" strokeWidth={1.5} />
					</button>
				</div>
			</div>
		</div>
	);
}

/**
 * The original's dark "tabbed collections" band: large Tenor tab labels over a darkened room
 * photo; the active tab carries a hairline above it and swaps the photo and the copy.
 */
export function CollectionTabs({ tabs }: { tabs: { label: string; image: ReactNode; body: ReactNode }[] }) {
	const [active, setActive] = useState(0);
	const baseId = useId();

	return (
		<section
			aria-label="Collections"
			className="relative min-h-[34rem] overflow-hidden bg-ink text-white md:min-h-[52rem]"
		>
			{tabs.map((tab, i) => (
				<div
					key={tab.label}
					aria-hidden="true"
					className={cn(
						"absolute inset-0 transition-opacity duration-700",
						i === active ? "opacity-100" : "opacity-0",
					)}
				>
					{tab.image}
				</div>
			))}
			<div className="absolute inset-0 bg-black/55" />
			<div className="shell relative z-10 flex min-h-[34rem] flex-col items-center py-14 md:min-h-[52rem] md:py-28">
				<div
					role="tablist"
					aria-label="Collections"
					className="scrollbar-none -mx-5 flex max-w-[calc(100%+2.5rem)] gap-6 overflow-x-auto px-5 md:mx-0 md:gap-16 md:px-0"
				>
					{tabs.map((tab, i) => (
						<button
							key={tab.label}
							type="button"
							role="tab"
							id={`${baseId}-tab-${i}`}
							aria-selected={i === active}
							aria-controls={`${baseId}-panel-${i}`}
							onClick={() => setActive(i)}
							className={cn(
								"shrink-0 border-t-2 pt-4 font-serif text-[1.625rem] whitespace-nowrap transition-colors md:px-10 md:text-[2.75rem]",
								i === active
									? "border-white text-white"
									: "border-transparent text-white/75 hover:text-white",
							)}
						>
							{tab.label}
						</button>
					))}
				</div>
				{tabs.map((tab, i) => (
					<div
						key={tab.label}
						role="tabpanel"
						id={`${baseId}-panel-${i}`}
						aria-labelledby={`${baseId}-tab-${i}`}
						hidden={i !== active}
						className="mt-auto max-w-2xl pt-16 text-center"
					>
						{tab.body}
					</div>
				))}
			</div>
		</section>
	);
}

type BuyVariant = {
	id: string;
	price: string;
	priceGross?: string;
	originalPrice: string;
	originalPriceGross?: string | null;
	sku: string | null;
	images: string[];
	stock: number | null;
	combinations: {
		variantValue: {
			value: string;
			colorValue: string | null;
			variantType: { label: string; type: "string" | "color" };
		};
	}[];
};

/**
 * Featured product's inline buy box: price, option chips, the grey quantity stepper and
 * "Add to bag". Keeps the chosen variant in local state so the home URL stays clean.
 */
export function FeaturedBuyBox({
	product,
	variants,
}: {
	product: { id: string; name: string; slug: string; images: string[] };
	variants: BuyVariant[];
}) {
	const { currency, locale, taxBehavior } = useStoreConfig();
	const { openCart, dispatch, startMutation, syncCart, reconcile } = useCart();
	const [selectedId, setSelectedId] = useState(variants.find((v) => v.stock !== 0)?.id ?? variants[0]?.id);
	const [quantity, setQuantity] = useState(1);
	const selected = variants.find((v) => v.id === selectedId) ?? variants[0];
	if (!selected) return null;

	const fmt = (amount: bigint) => formatMoney({ amount, currency, locale });
	const price = BigInt(displayPrice(selected, taxBehavior));
	const list = BigInt(
		displayPrice(selected, taxBehavior, "originalPrice") ?? displayPrice(selected, taxBehavior),
	);
	const outOfStock = selected.stock === 0;
	const max = Math.max(1, Math.min(99, selected.stock ?? 99));
	const optionLabel = selected.combinations[0]?.variantValue.variantType.label;

	const add = () => {
		if (outOfStock) return;
		const qty = Math.min(quantity, max);
		trackAddToCart(selected, product.name, qty);
		openCart();
		setQuantity(1);
		dispatch({
			type: "ADD_ITEM",
			item: {
				quantity: qty,
				productVariant: {
					id: selected.id,
					price: selected.price,
					priceGross: selected.priceGross,
					images: selected.images,
					product,
				},
			},
		});
		startMutation(async () => {
			const result = await addToCart(selected.id, qty);
			if (result.success && result.cart) {
				syncCart(result.cart);
			} else {
				await reconcile();
				toast.error("This item is out of stock");
			}
		});
	};

	return (
		<div className="space-y-6">
			<p className="flex items-baseline gap-2 text-xl tabular-nums md:text-2xl">
				{list > price && (
					<span className="text-muted-foreground line-through">
						<span className="sr-only">Was </span>
						{fmt(list)}
					</span>
				)}
				<span>{fmt(price)}</span>
			</p>
			{variants.length > 1 && optionLabel && (
				<fieldset>
					<legend className="mb-3 text-xs font-semibold tracking-[0.02em] uppercase">
						{optionLabel}
						<span className="font-normal text-muted-foreground normal-case">
							{" "}
							· {selected.combinations.map((c) => c.variantValue.value).join(" / ")}
						</span>
					</legend>
					<div className="flex flex-wrap gap-2">
						{variants.map((v) => {
							const value = v.combinations.map((c) => c.variantValue.value).join(" / ");
							const color = v.combinations.find((c) => c.variantValue.variantType.type === "color")
								?.variantValue.colorValue;
							const isSelected = v.id === selected.id;
							return color ? (
								<button
									key={v.id}
									type="button"
									aria-pressed={isSelected}
									aria-label={value}
									title={value}
									onClick={() => setSelectedId(v.id)}
									className={cn(
										"h-8 w-8 rounded-xs border p-0.5 transition-colors",
										isSelected ? "border-foreground" : "border-input hover:border-foreground",
									)}
								>
									<span className="block h-full w-full rounded-[2px]" style={{ backgroundColor: color }} />
								</button>
							) : (
								<button
									key={v.id}
									type="button"
									aria-pressed={isSelected}
									onClick={() => setSelectedId(v.id)}
									className={cn(
										"h-10 rounded-xs border px-4 text-sm transition-colors",
										isSelected ? "border-foreground" : "border-input hover:border-foreground",
									)}
								>
									{value}
								</button>
							);
						})}
					</div>
				</fieldset>
			)}
			<div className="flex gap-3">
				<div className="inline-flex h-12 items-center rounded-xs bg-muted">
					<button
						type="button"
						aria-label="Decrease quantity"
						disabled={quantity <= 1}
						onClick={() => setQuantity((q) => Math.max(1, q - 1))}
						className="flex h-full w-11 items-center justify-center disabled:opacity-40"
					>
						<Minus className="h-3.5 w-3.5" strokeWidth={1.5} />
					</button>
					<span className="w-8 text-center text-sm tabular-nums" aria-live="polite">
						<span className="sr-only">Quantity </span>
						{quantity}
					</span>
					<button
						type="button"
						aria-label="Increase quantity"
						disabled={quantity >= max}
						onClick={() => setQuantity((q) => Math.min(max, q + 1))}
						className="flex h-full w-11 items-center justify-center disabled:opacity-40"
					>
						<Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
					</button>
				</div>
				<button
					type="button"
					onClick={add}
					disabled={outOfStock}
					className="h-12 flex-1 rounded-xs bg-primary px-6 text-sm font-medium tracking-[0.02em] text-primary-foreground uppercase transition-colors hover:bg-[#6d6966] disabled:cursor-not-allowed disabled:opacity-60"
				>
					{outOfStock ? "Sold out" : "Add to bag"}
				</button>
			</div>
		</div>
	);
}
