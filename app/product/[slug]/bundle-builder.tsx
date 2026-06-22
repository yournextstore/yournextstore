"use client";

import type { APIProductGetByIdResult } from "commerce-kit";
import { CheckIcon, MinusIcon, PlusIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { addBundleToCart } from "@/app/cart/actions";
import { useCart } from "@/app/cart/cart-context";
import { useStoreConfig } from "@/components/store-config-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/lib/money";
import { displayAmount, displayPrice, type TaxBehavior } from "@/lib/pricing";
import { cn } from "@/lib/utils";

type Bundle = NonNullable<APIProductGetByIdResult["bundle"]>;
type Group = Bundle["groups"][number];
type GroupItem = Group["items"][number];

// quantity chosen per variant, scoped per group
type GroupSelections = Record<string, Record<string, number>>;

// Raw bundle pricing fields off the product (commerce-kit 0.50). `discountPercentage` is already on
// the clean `bundle` object; the mode + fixed/amount values live on the product for now.
// TODO: fold priceMode/fixedPriceAmount/amountOffAmount (and their gross twins) into
// `serializeBundleForApi` and read from `product.bundle` instead of the raw fields — see YNS-1449.
type Pricing = {
	mode: "fixed" | "percent" | "amount";
	fixedPriceAmount: string | null;
	fixedPriceAmountGross: string | null;
	amountOffAmount: string | null;
	amountOffAmountGross: string | null;
};

// Preview total (minor units), in the basis the shopper sees: `sum` already comes in gross for an
// inclusive store, so the fixed/amount-off operands must match it. The cart response is
// authoritative; this mirrors the core modes so fixed-price and amount-off bundles don't show the
// full component sum on the PDP.
const priceTotal = (
	sum: bigint,
	pricing: Pricing,
	discountPercentage: number | null,
	taxBehavior: TaxBehavior,
): bigint => {
	if (pricing.mode === "fixed") {
		const fixed = displayAmount(pricing.fixedPriceAmount, pricing.fixedPriceAmountGross, taxBehavior);
		return fixed != null ? BigInt(fixed) : sum;
	}
	if (pricing.mode === "amount") {
		const off = BigInt(
			displayAmount(pricing.amountOffAmount, pricing.amountOffAmountGross, taxBehavior) ?? "0",
		);
		return sum > off ? sum - off : 0n;
	}
	// percent: core stores percent × 1000, so pct/100 becomes (sum × round(pct×1000)) / 100000.
	// A ratio needs no gross twin — scaling a gross sum gives the gross discounted total.
	const pct = discountPercentage ?? 0;
	return pct > 0 ? sum - (sum * BigInt(Math.round(pct * 1000))) / 100_000n : sum;
};

const groupTotal = (sel: Record<string, number> | undefined) =>
	sel ? Object.values(sel).reduce((sum, q) => sum + q, 0) : 0;

const initialSelections = (groups: Group[]): GroupSelections => {
	const out: GroupSelections = {};
	for (const group of groups) {
		const inner: Record<string, number> = {};
		for (const item of group.items) {
			if (item.forced) inner[item.variantId] = item.fixedQuantity;
			else if (item.defaultSelected) inner[item.variantId] = 1;
		}
		out[group.id] = inner;
	}
	return out;
};

export function BundleBuilder({
	bundleId,
	bundle,
	pricing,
}: {
	bundleId: string;
	bundle: Bundle;
	pricing: Pricing;
}) {
	const { groups, discountPercentage } = bundle;
	const { currency, locale, taxBehavior } = useStoreConfig();
	const { openCart, syncCart } = useCart();

	const [selections, setSelections] = useState<GroupSelections>(() => initialSelections(groups));
	const [isAdding, setIsAdding] = useState(false);

	const itemByVariant = new Map<string, GroupItem>(
		groups.flatMap((group) => group.items.map((item) => [`${group.id}:${item.variantId}`, item] as const)),
	);

	const setQuantity = (groupId: string, variantId: string, next: number) => {
		setSelections((prev) => {
			const group = { ...(prev[groupId] ?? {}) };
			if (next <= 0) delete group[variantId];
			else group[variantId] = next;
			return { ...prev, [groupId]: group };
		});
	};

	// Radio groups (pick exactly one): selecting an item replaces the current pick.
	const pickRadio = (group: Group, variantId: string) => {
		setSelections((prev) => ({ ...prev, [group.id]: { [variantId]: 1 } }));
	};

	// Preview only — the cart response is authoritative for the final (taxed) price. Component
	// prices and the fixed/amount-off pricing fields both carry gross twins, so an inclusive store
	// previews the bundle inc-tax throughout.
	const originalTotal = groups
		.flatMap((group) =>
			Object.entries(selections[group.id] ?? {}).map(([variantId, quantity]) => {
				const item = quantity > 0 ? itemByVariant.get(`${group.id}:${variantId}`) : undefined;
				return item ? BigInt(displayPrice(item.variant, taxBehavior)) * BigInt(quantity) : 0n;
			}),
		)
		.reduce((sum, line) => sum + line, 0n);
	const total = priceTotal(originalTotal, pricing, discountPercentage, taxBehavior);

	const hasSavings = total < originalTotal;

	const unmetGroup = groups.find((group) => groupTotal(selections[group.id]) < group.minQuantity);
	const hasAnySelection = groups.some((group) => groupTotal(selections[group.id]) > 0);
	const canAdd = !unmetGroup && hasAnySelection;

	const handleAddToCart = async () => {
		if (unmetGroup) {
			toast.error(`Select at least ${unmetGroup.minQuantity} from ${unmetGroup.name ?? "each group"}`);
			return;
		}
		setIsAdding(true);
		try {
			const payload = groups.flatMap((group) =>
				Object.entries(selections[group.id] ?? {})
					.filter(([, quantity]) => quantity > 0)
					.map(([variantId, quantity]) => ({ variantId, groupId: group.id, quantity })),
			);
			const result = await addBundleToCart(bundleId, payload);
			if (!result.success) {
				toast.error(result.error ?? "Could not add to cart");
				return;
			}
			syncCart(result.cart);
			openCart();
			toast.success("Bundle added to cart");
		} catch (error) {
			console.error("Failed to add bundle to cart:", error);
			toast.error("Failed to add to cart");
		} finally {
			setIsAdding(false);
		}
	};

	return (
		<div className="grid gap-10">
			{groups.map((group) => {
				const inner = selections[group.id] ?? {};
				const picked = groupTotal(inner);
				const isRadio = group.maxQuantity === 1 && !group.allowDuplicates;
				const atGroupMax = group.maxQuantity != null && picked >= group.maxQuantity;
				const isForcedGroup = group.items.every((i) => i.forced);
				// A "swatch group" is a choice among variants of one product (e.g. colors): label the
				// options by their variant value instead of the repeated product name. Groups made of
				// distinct products keep their product names.
				const isSwatchGroup =
					group.items.length > 1 && new Set(group.items.map((i) => i.variant.productSlug)).size === 1;

				return (
					<section key={group.id} className="grid gap-4">
						<div className="flex items-baseline justify-between gap-3">
							<h3 className="text-xs tracking-[0.2em] uppercase text-zinc-900 font-normal">
								{group.name ?? (isForcedGroup ? "Included" : "Choose your items")}
							</h3>
							{!isForcedGroup && group.maxQuantity != null && (
								<span className="shrink-0 text-xs font-light text-zinc-400">
									Selected {picked} of {group.maxQuantity}
								</span>
							)}
						</div>

						<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
							{group.items.map((item) => {
								const qty = inner[item.variantId] ?? 0;
								const selected = qty > 0;
								const image = item.variant.images[0] ?? item.variant.productImages[0];
								const stock = item.variant.stock;
								const outOfStock = stock != null && stock <= 0;
								// Without duplicates, each option caps at 1 unit (distinct picks); with
								// duplicates the only limit is the group total. Mirrors the editor.
								const itemCap = item.maxQuantity ?? (group.allowDuplicates ? Number.POSITIVE_INFINITY : 1);
								const canIncrement =
									!item.forced &&
									!outOfStock &&
									qty < itemCap &&
									(stock == null || qty < stock) &&
									!atGroupMax;
								// Variant option values (e.g. "Charcoal"). In a swatch group they become the
								// card label; a color option also renders a swatch dot. Guard against an
								// older API deployment that doesn't send `options` yet (version skew).
								const options = item.variant.options ?? [];
								const optionText = options.map((o) => o.value).join(" / ");
								const swatchColor = options.find((o) => o.colorValue)?.colorValue ?? null;
								const label = isSwatchGroup && optionText ? optionText : item.variant.productName;

								return (
									<div
										key={item.variantId}
										className={cn(
											"relative flex flex-col overflow-hidden border bg-white transition-colors",
											selected ? "border-zinc-900" : "border-zinc-200",
											outOfStock && "opacity-50",
										)}
									>
										{selected && (
											<span className="absolute left-2 top-2 z-10 flex size-6 items-center justify-center bg-zinc-900 text-white">
												<CheckIcon className="size-4" />
											</span>
										)}

										<button
											type="button"
											disabled={item.forced || outOfStock || (isRadio ? false : !selected && atGroupMax)}
											onClick={() => {
												if (item.forced || outOfStock) return;
												if (isRadio) pickRadio(group, item.variantId);
												else setQuantity(group.id, item.variantId, selected ? 0 : 1);
											}}
											className="flex flex-1 flex-col gap-2 p-2 text-left disabled:cursor-not-allowed"
										>
											<div className="aspect-[3/4] w-full overflow-hidden bg-zinc-100">
												{image ? (
													<Image
														src={image}
														alt={label}
														width={160}
														height={213}
														className="size-full object-cover"
													/>
												) : null}
											</div>
											<span className="flex items-center gap-1.5 text-sm font-light text-zinc-900">
												{swatchColor && (
													<span
														aria-hidden
														className="inline-block size-3 shrink-0 rounded-full border border-zinc-200"
														style={{ backgroundColor: swatchColor }}
													/>
												)}
												<span className="line-clamp-2">{label}</span>
											</span>
											<span className="text-sm font-light text-zinc-500">
												{formatMoney({
													amount: BigInt(displayPrice(item.variant, taxBehavior)),
													currency,
													locale,
												})}
											</span>
											{outOfStock && <span className="text-destructive text-xs">Out of stock</span>}
											{item.forced && (
												<Badge
													variant="secondary"
													className="w-fit rounded-none bg-zinc-100 font-normal text-zinc-900"
												>
													{item.fixedQuantity > 1 ? `Included ×${item.fixedQuantity}` : "Included"}
												</Badge>
											)}
										</button>

										{!isRadio && !item.forced && selected && (
											<div className="flex items-center justify-between border-t border-zinc-200 px-2 py-1.5">
												<Button
													type="button"
													size="icon"
													variant="ghost"
													className="size-7 rounded-none text-zinc-400 hover:bg-transparent hover:text-zinc-900"
													onClick={() => setQuantity(group.id, item.variantId, qty - 1)}
												>
													<MinusIcon className="size-4" />
												</Button>
												<span className="min-w-6 text-center text-sm font-light text-zinc-900">{qty}</span>
												<Button
													type="button"
													size="icon"
													variant="ghost"
													className="size-7 rounded-none text-zinc-400 hover:bg-transparent hover:text-zinc-900"
													disabled={!canIncrement}
													onClick={() => setQuantity(group.id, item.variantId, qty + 1)}
												>
													<PlusIcon className="size-4" />
												</Button>
											</div>
										)}
									</div>
								);
							})}
						</div>
					</section>
				);
			})}

			<div className="sticky bottom-0 flex flex-col gap-4 border-t border-zinc-200 bg-[#FAFAF8]/95 py-4 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
				<div className="flex items-baseline gap-2">
					{hasSavings && (
						<span className="text-lg font-light text-zinc-400 line-through">
							{formatMoney({ amount: originalTotal, currency, locale })}
						</span>
					)}
					<span className="text-2xl font-light text-zinc-900">
						{formatMoney({ amount: total, currency, locale })}
					</span>
				</div>
				<Button
					type="button"
					size="lg"
					className="h-12 rounded-none bg-zinc-900 px-8 text-xs tracking-[0.15em] uppercase text-white hover:bg-zinc-800"
					disabled={!canAdd || isAdding}
					onClick={handleAddToCart}
				>
					{isAdding ? "Adding…" : "Add to cart"}
				</Button>
			</div>
		</div>
	);
}
