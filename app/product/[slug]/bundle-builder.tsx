"use client";

import type { APIProductGetByIdResult } from "commerce-kit";
import { CheckIcon, MinusIcon, PlusIcon } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { addBundleToCart } from "@/app/cart/actions";
import { useCart } from "@/app/cart/cart-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CURRENCY, LOCALE } from "@/lib/constants";
import { formatMoney } from "@/lib/money";
import { cn } from "@/lib/utils";

type Bundle = NonNullable<APIProductGetByIdResult["bundle"]>;
type Group = Bundle["groups"][number];
type GroupItem = Group["items"][number];

// quantity chosen per variant, scoped per group
type GroupSelections = Record<string, Record<string, number>>;

// Raw bundle pricing fields off the product (commerce-kit 0.50). `discountPercentage` is already on
// the clean `bundle` object; the mode + fixed/amount values live on the product for now.
// TODO: fold priceMode/fixedPriceAmount/amountOffAmount into `serializeBundleForApi` and read from
// `product.bundle` instead of the raw fields (needs a commerce-kit release) — see YNS-1449.
type Pricing = {
	mode: "fixed" | "percent" | "amount";
	fixedPriceAmount: string | null;
	amountOffAmount: string | null;
};

// Preview total (minor units). The cart response is authoritative; this mirrors the core modes so
// fixed-price and amount-off bundles don't show the full component sum on the PDP.
const priceTotal = (sum: bigint, pricing: Pricing, discountPercentage: number | null): bigint => {
	if (pricing.mode === "fixed") {
		return pricing.fixedPriceAmount != null ? BigInt(pricing.fixedPriceAmount) : sum;
	}
	if (pricing.mode === "amount") {
		const off = BigInt(pricing.amountOffAmount ?? "0");
		return sum > off ? sum - off : 0n;
	}
	// percent: core stores percent × 1000, so pct/100 becomes (sum × round(pct×1000)) / 100000.
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
	const { openCart } = useCart();

	const [selections, setSelections] = useState<GroupSelections>(() => initialSelections(groups));
	const [isAdding, setIsAdding] = useState(false);

	const itemByVariant = useMemo(() => {
		const map = new Map<string, GroupItem>();
		for (const group of groups)
			for (const item of group.items) map.set(`${group.id}:${item.variantId}`, item);
		return map;
	}, [groups]);

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

	// Preview only — the cart response is authoritative for the final (taxed) price.
	const { total, originalTotal } = useMemo(() => {
		let sum = 0n;
		for (const group of groups) {
			const inner = selections[group.id] ?? {};
			for (const [variantId, quantity] of Object.entries(inner)) {
				if (quantity <= 0) continue;
				const item = itemByVariant.get(`${group.id}:${variantId}`);
				if (item) sum += BigInt(item.variant.price) * BigInt(quantity);
			}
		}
		return { total: priceTotal(sum, pricing, discountPercentage), originalTotal: sum };
	}, [groups, selections, itemByVariant, discountPercentage, pricing]);

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
		<div className="grid gap-8">
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
					<section key={group.id} className="grid gap-3">
						<div className="flex items-baseline justify-between gap-3">
							<h3 className="font-semibold text-lg">
								{group.name ?? (isForcedGroup ? "Included" : "Choose your items")}
							</h3>
							{!isForcedGroup && group.maxQuantity != null && (
								<span className="shrink-0 text-muted-foreground text-sm">
									Selected {picked} of {group.maxQuantity}
								</span>
							)}
						</div>

						<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
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
											"relative flex flex-col overflow-hidden rounded-xl border bg-card transition-colors",
											selected ? "border-primary ring-1 ring-primary" : "border-border",
											outOfStock && "opacity-50",
										)}
									>
										{selected && (
											<span className="absolute left-2 top-2 z-10 flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
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
											<div className="aspect-square w-full overflow-hidden rounded-lg bg-muted">
												{image ? (
													<Image
														src={image}
														alt={label}
														width={160}
														height={160}
														className="size-full object-cover"
													/>
												) : null}
											</div>
											<span className="flex items-center gap-1.5 font-medium text-sm">
												{swatchColor && (
													<span
														aria-hidden
														className="inline-block size-3 shrink-0 rounded-full border border-border"
														style={{ backgroundColor: swatchColor }}
													/>
												)}
												<span className="line-clamp-2">{label}</span>
											</span>
											<span className="text-muted-foreground text-sm">
												{formatMoney({
													amount: BigInt(item.variant.price),
													currency: CURRENCY,
													locale: LOCALE,
												})}
											</span>
											{outOfStock && <span className="text-destructive text-xs">Out of stock</span>}
											{item.forced && (
												<Badge variant="secondary" className="w-fit">
													{item.fixedQuantity > 1 ? `Included ×${item.fixedQuantity}` : "Included"}
												</Badge>
											)}
										</button>

										{!isRadio && !item.forced && selected && (
											<div className="flex items-center justify-between border-t px-2 py-1.5">
												<Button
													type="button"
													size="icon"
													variant="ghost"
													className="size-7"
													onClick={() => setQuantity(group.id, item.variantId, qty - 1)}
												>
													<MinusIcon className="size-4" />
												</Button>
												<span className="min-w-6 text-center font-medium text-sm">{qty}</span>
												<Button
													type="button"
													size="icon"
													variant="ghost"
													className="size-7"
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

			<div className="sticky bottom-0 flex flex-col gap-3 border-t bg-background/95 py-4 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
				<div className="flex items-baseline gap-2">
					{hasSavings && (
						<span className="text-muted-foreground text-lg line-through">
							{formatMoney({ amount: originalTotal, currency: CURRENCY, locale: LOCALE })}
						</span>
					)}
					<span className="font-bold text-2xl">
						{formatMoney({ amount: total, currency: CURRENCY, locale: LOCALE })}
					</span>
				</div>
				<Button
					type="button"
					size="lg"
					className="rounded-4xl"
					disabled={!canAdd || isAdding}
					onClick={handleAddToCart}
				>
					{isAdding ? "Adding…" : "Add to cart"}
				</Button>
			</div>
		</div>
	);
}
