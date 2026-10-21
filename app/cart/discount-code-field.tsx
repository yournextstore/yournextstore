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
		<p id={messageId} role="alert" className="bg-white px-1 text-t14 text-destructive">
			{error}
		</p>
	) : null;

	if (applied) {
		return (
			<div className="grid gap-2">
				<div
					role="status"
					className="flex min-h-10 items-center justify-between gap-3 bg-black pl-3 text-white"
				>
					<p className="min-w-0 py-2 text-t14">
						Discount applied: <span className="font-sans font-bold break-all">{applied.code}</span>{" "}
						<span className="whitespace-nowrap">{applied.label}</span>
					</p>
					<Button
						type="button"
						variant="ghost"
						className="h-10 shrink-0 px-3 text-t14 uppercase text-white underline underline-offset-2 hover:bg-transparent hover:text-swag-yellow"
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
			<label htmlFor={inputId} className="sr-only">
				Discount code
			</label>
			<div className="flex">
				<Input
					id={inputId}
					name="discountCode"
					type="text"
					autoComplete="off"
					autoCorrect="off"
					spellCheck={false}
					enterKeyHint="done"
					placeholder="DISCOUNT CODE"
					className="h-10 min-w-0 flex-1 rounded-none border-black bg-white font-mono text-t14 uppercase shadow-none placeholder:text-black/60 md:text-t14"
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
					className="h-10 shrink-0 rounded-none bg-black px-4 font-mono text-t14 uppercase text-white hover:bg-black hover:text-swag-yellow"
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
