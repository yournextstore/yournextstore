"use client";

import { Loader2, TicketPercent } from "lucide-react";
import { useId, useState } from "react";
import { applyDiscountCode, removeDiscountCode } from "@/app/cart/actions";
import { type Cart, useCart } from "@/app/cart/cart-context";
import { appliedCouponOf } from "@/app/cart/discount-code";
import { useStoreConfig } from "@/components/store-config-provider";

type DiscountMutationResult =
	| { success: true; cart: Cart | null | undefined }
	| { success: false; error: string };

/** Cart-drawer discount-code field: 44px controls, 16px input, inline results. */
export function DiscountCodeField() {
	const { currency, locale } = useStoreConfig();
	const { cart, itemCount, syncCart, reconcile, isMutating, startMutation } = useCart();
	const inputId = useId();
	const messageId = useId();
	const [code, setCode] = useState("");
	const [error, setError] = useState<string | null>(null);

	const applied = appliedCouponOf(cart, { currency, locale });

	// Runs on the cart-wide transition, so Checkout waits for the re-priced cart.
	const run = (mutation: () => Promise<DiscountMutationResult>, onSuccess: () => void) => {
		startMutation(async () => {
			try {
				const result = await mutation();
				if (!result.success) {
					setError(result.error);
					return;
				}
				setError(null);
				onSuccess();
				if (result.cart) {
					syncCart(result.cart);
				} else {
					await reconcile();
				}
			} catch {
				setError("Something went wrong. Try again.");
			}
		});
	};

	const apply = () => {
		const trimmed = code.trim();
		if (isMutating || !trimmed) {
			return;
		}
		run(
			() => applyDiscountCode(trimmed, itemCount),
			() => setCode(""),
		);
	};

	const errorMessage = error ? (
		<p id={messageId} role="alert" className="field-error">
			{error}
		</p>
	) : null;

	if (applied) {
		return (
			<div className="grid gap-2">
				<div role="status" className="coupon-applied">
					<span className="icon-tile sm" aria-hidden>
						<TicketPercent size={16} aria-hidden />
					</span>
					<div>
						<strong>{applied.code}</strong>
						<small>{applied.label}</small>
					</div>
					<button
						type="button"
						className="text-link"
						aria-label={`Remove discount code ${applied.code}`}
						aria-busy={isMutating || undefined}
						onClick={() => {
							if (!isMutating) {
								run(removeDiscountCode, () => undefined);
							}
						}}
					>
						{isMutating ? <Loader2 className="spin" size={14} aria-hidden /> : "Remove"}
					</button>
				</div>
				{errorMessage}
			</div>
		);
	}

	// Not a <form>: forms cannot nest, and the drawer may sit inside one.
	return (
		<div className="coupon-form">
			<label htmlFor={inputId}>Coupon code</label>
			<div className="coupon-field">
				<span className="input-affix">
					<TicketPercent size={16} aria-hidden />
					<input
						id={inputId}
						name="discountCode"
						type="text"
						autoComplete="off"
						autoCorrect="off"
						spellCheck={false}
						enterKeyHint="done"
						placeholder="Enter code"
						aria-invalid={error ? true : undefined}
						aria-describedby={error ? messageId : undefined}
						value={code}
						readOnly={isMutating}
						onChange={(e) => {
							setCode(e.currentTarget.value.toUpperCase());
							setError(null);
						}}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								e.preventDefault();
								apply();
							}
						}}
					/>
				</span>
				<button
					type="button"
					className="button sm"
					aria-disabled={isMutating || !code.trim() || undefined}
					aria-busy={isMutating || undefined}
					onClick={apply}
				>
					{isMutating ? <Loader2 className="spin" size={14} aria-hidden /> : null}
					Apply
				</button>
			</div>
			{errorMessage}
		</div>
	);
}
