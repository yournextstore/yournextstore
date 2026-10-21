"use client";

import { Loader2 } from "lucide-react";
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
		<p id={messageId} role="alert" className="mono text-[0.6875rem] text-destructive">
			{error}
		</p>
	) : null;

	if (applied) {
		return (
			<div className="grid gap-2">
				<div role="status" className="flex items-center justify-between gap-3 border-b border-border pb-3">
					<p className="mono min-w-0 text-[0.6875rem] uppercase tracking-[0.05em] text-walnut">
						<span className="break-all">{applied.code} applied</span>{" "}
						<span className="whitespace-nowrap">{applied.label}</span>
					</p>
					<button
						type="button"
						className="link link-mono min-h-6 shrink-0 text-muted-foreground"
						aria-label={`Remove discount code ${applied.code}`}
						aria-busy={isMutating || undefined}
						onClick={() => {
							if (!isMutating) {
								run(removeDiscountCode, () => undefined);
							}
						}}
					>
						{isMutating ? <Loader2 className="size-4 animate-spin" /> : "Remove"}
					</button>
				</div>
				{errorMessage}
			</div>
		);
	}

	return (
		<div className="grid gap-1">
			<label htmlFor={inputId} className="label">
				Discount code
			</label>
			<div className="flex items-center gap-3 border-b border-line-strong transition-colors focus-within:border-walnut">
				<input
					id={inputId}
					name="discountCode"
					type="text"
					autoComplete="off"
					autoCorrect="off"
					spellCheck={false}
					enterKeyHint="done"
					className="mono min-w-0 flex-1 bg-transparent py-2.5 text-base uppercase tracking-[0.04em] outline-none sm:text-[0.8125rem]"
					aria-invalid={error ? true : undefined}
					aria-describedby={error ? messageId : undefined}
					value={code}
					readOnly={isMutating}
					onChange={(e) => {
						setCode(e.currentTarget.value);
						setError(null);
					}}
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							e.preventDefault();
							apply();
						}
					}}
				/>
				<button
					type="button"
					className="link link-mono inline-flex min-h-10 shrink-0 items-center gap-2 text-foreground"
					aria-disabled={isMutating || !code.trim() || undefined}
					aria-busy={isMutating || undefined}
					onClick={apply}
				>
					{isMutating ? <Loader2 className="size-3.5 animate-spin" /> : null}
					Apply
				</button>
			</div>
			{errorMessage}
		</div>
	);
}
