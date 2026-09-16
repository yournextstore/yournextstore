"use client";

import { Loader2 } from "lucide-react";
import { useId, useState } from "react";
import { applyDiscountCode, removeDiscountCode } from "@/app/cart/actions";
import { type Cart, useCart } from "@/app/cart/cart-context";
import { appliedCouponOf } from "@/app/cart/discount-code";
import { useStoreConfig } from "@/components/store-config-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
		<p id={messageId} role="alert" className="text-sm text-destructive">
			{error}
		</p>
	) : null;

	if (applied) {
		return (
			<div className="grid gap-2">
				<div
					role="status"
					className="flex min-h-11 items-center justify-between gap-3 rounded-md border border-green-700/30 bg-green-50 pl-3 text-green-900"
				>
					<p className="min-w-0 py-2 text-sm">
						<span className="font-semibold break-all">{applied.code} applied</span>{" "}
						<span className="whitespace-nowrap">{applied.label}</span>
					</p>
					<Button
						type="button"
						variant="ghost"
						className="h-11 shrink-0 px-3 text-sm text-green-900 underline underline-offset-2 hover:bg-green-100 hover:text-green-950"
						aria-label={`Remove discount code ${applied.code}`}
						aria-busy={isMutating || undefined}
						onClick={() => {
							if (!isMutating) {
								run(removeDiscountCode, () => undefined);
							}
						}}
					>
						{isMutating ? <Loader2 className="size-4 animate-spin" /> : "Remove"}
					</Button>
				</div>
				{errorMessage}
			</div>
		);
	}

	return (
		<div className="grid gap-2">
			<label htmlFor={inputId} className="text-sm font-medium">
				Discount code
			</label>
			<div className="flex gap-2">
				<Input
					id={inputId}
					name="discountCode"
					type="text"
					autoComplete="off"
					autoCorrect="off"
					spellCheck={false}
					enterKeyHint="done"
					className="h-11 min-w-0 flex-1 text-base md:text-base"
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
				<Button
					type="button"
					variant="outline"
					className="h-11 shrink-0 px-4 text-base"
					aria-disabled={isMutating || !code.trim() || undefined}
					aria-busy={isMutating || undefined}
					onClick={apply}
				>
					{isMutating ? <Loader2 className="size-4 animate-spin" /> : null}
					Apply
				</Button>
			</div>
			{errorMessage}
		</div>
	);
}
