import type { Cart } from "@/app/cart/cart-math";
import { formatMoney } from "@/lib/money";
import { cartDisplaySubtotal, type TaxBehavior } from "@/lib/pricing";

export type AppliedCoupon = { code: string; label: string };

/** What the API knows about a coupon, enough to say why it was refused. */
export type CouponFacts = {
	startDate: string | null;
	endDate: string | null;
	maxUses: number | null;
	timesRedeemed: number;
	minProductCount: number | null;
	maxProductCount: number | null;
};

// Percent coupons are stored in thousandths of a percent: "10000" is 10%.
const PERCENT_PRECISION = 1000;

/** The coupon on a server cart, labelled for the cart drawer ("LATO10", "10% off"). */
export function appliedCouponOf(
	cart: Cart | null,
	{ currency, locale }: { currency: string; locale: string },
): AppliedCoupon | null {
	const coupon = cart?.coupon;
	if (!coupon) {
		return null;
	}
	const value = Number(coupon.value);
	if (!Number.isFinite(value)) {
		return { code: coupon.code, label: "" };
	}
	return {
		code: coupon.code,
		label:
			coupon.type === "percentage"
				? `${value / PERCENT_PRECISION}% off`
				: `${formatMoney({ amount: value, currency, locale })} off`,
	};
}

/**
 * How much the discount takes off the subtotal, from the API's own totals: the subtotal before
 * discounts minus the discounted one. `null` whenever the totals are absent (Stripe Tax, or an
 * optimistic cart mid-mutation) or nothing is taken off.
 */
export function cartDiscountOf(cart: Cart | null, taxBehavior: TaxBehavior): bigint | null {
	const before = cartDisplaySubtotal(cart, taxBehavior);
	const after = cart?.subtotal;
	if (before == null || after == null) {
		return null;
	}
	const discount = BigInt(Math.round(before)) - BigInt(Math.round(after));
	return discount > 0n ? discount : null;
}

/** Why a code was refused, worded for the shopper; null coupon = unknown code. */
export function refusedCodeMessage(coupon: CouponFacts | null, itemCount: number, now: Date): string {
	if (!coupon) {
		return "This code doesn't exist";
	}
	if (coupon.endDate && new Date(coupon.endDate) < now) {
		return "This code has expired";
	}
	if (coupon.startDate && new Date(coupon.startDate) > now) {
		return "This code isn't active yet";
	}
	if (coupon.maxUses !== null && coupon.timesRedeemed >= coupon.maxUses) {
		return "This code has already been used up";
	}
	if (coupon.minProductCount !== null && itemCount < coupon.minProductCount) {
		return `Add at least ${coupon.minProductCount} items to your cart to use this code`;
	}
	if (coupon.maxProductCount !== null && itemCount > coupon.maxProductCount) {
		return `This code works with up to ${coupon.maxProductCount} items in your cart`;
	}
	return "This code doesn't apply to the items in your cart";
}
