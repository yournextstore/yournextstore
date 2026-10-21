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
		<p id={messageId} role="alert" className="text-[11px] text-destructive">
			{error}
		</p>
	) : null;

	if (applied) {
		return (
			<div className="grid gap-2">
				<div
					role="status"
					className="flex min-h-11 items-center justify-between gap-3 border border-line bg-linesoft pl-3 text-foreground"
				>
					<p className="min-w-0 py-2 text-[11px] tracking-[0.06em]">
						<span className="font-semibold break-all">{applied.code} applied</span>{" "}
						<span className="whitespace-nowrap">{applied.label}</span>
					</p>
					<Button
						type="button"
						variant="ghost"
						className="h-11 shrink-0 px-3 text-[10px] uppercase tracking-[0.16em] underline underline-offset-4 hover:bg-transparent"
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
			<label htmlFor={inputId} className="cap-xs text-faint">
				Discount code
			</label>
			<div className="flex border-b border-foreground">
				<Input
					id={inputId}
					name="discountCode"
					type="text"
					autoComplete="off"
					autoCorrect="off"
					spellCheck={false}
					enterKeyHint="done"
					className="h-10 min-w-0 flex-1 border-0 bg-transparent px-0 text-[12px] tracking-[0.08em] shadow-none focus-visible:ring-0 md:text-[12px]"
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
					variant="ghost"
					className="h-10 shrink-0 px-2 text-[10px] uppercase tracking-[0.18em] hover:bg-transparent"
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
