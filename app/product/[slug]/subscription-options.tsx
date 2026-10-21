"use client";

import { planLabel } from "@/app/cart/cart-math";
import { cn } from "@/lib/utils";

export type SubscriptionPlan = {
	id: string;
	name: string;
	discountPercent: number;
	benefits: string | null;
};

type SubscriptionOptionsProps = {
	plans: SubscriptionPlan[];
	/** The chosen plan, or null for a one-time purchase. */
	value: string | null;
	onChange: (planId: string | null) => void;
	/** False when the product is sold on a plan only. */
	allowOneTime: boolean;
};

// The plan price itself is the platform's: the cart prices a plan line and shows the saving,
// so this only names each choice.
export function SubscriptionOptions({ plans, value, onChange, allowOneTime }: SubscriptionOptionsProps) {
	const options = [
		...(allowOneTime ? [{ id: null, label: "One-time purchase", detail: null }] : []),
		...plans.map((plan) => ({ id: plan.id, label: planLabel(plan), detail: plan.benefits })),
	];

	return (
		<fieldset className="m-0 border-0 border-t border-border p-0 pt-5">
			<legend className="sr-only">Purchase</legend>
			<p className="bp-label mb-3 text-sm font-bold" aria-hidden>
				Purchase
			</p>
			<div className="flex flex-col gap-2">
				{options.map((option) => (
					<label
						key={option.id ?? "one-time"}
						className={cn(
							"flex cursor-pointer items-start gap-3 rounded border bg-white p-4 text-black transition-colors",
							value === option.id ? "border-black" : "border-border hover:bg-neutral-lightest",
						)}
					>
						<input
							type="radio"
							name="purchase"
							checked={value === option.id}
							onChange={() => onChange(option.id)}
							className="mt-0.5 size-4 shrink-0 accent-black"
						/>
						<span className="flex flex-col gap-1">
							<span className="text-sm font-bold">{option.label}</span>
							{option.detail && <span className="text-sm text-muted-foreground">{option.detail}</span>}
						</span>
					</label>
				))}
			</div>
		</fieldset>
	);
}
