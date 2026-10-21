"use client";

import { planLabel } from "@/app/cart/cart-math";

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
		<fieldset className="size-picker">
			<legend>Purchase</legend>
			<div className="size-options">
				{options.map((option) => (
					<button
						key={option.id ?? "one-time"}
						type="button"
						onClick={() => onChange(option.id)}
						aria-pressed={value === option.id}
					>
						<strong>{option.label}</strong>
						{option.detail && <span>{option.detail}</span>}
					</button>
				))}
			</div>
		</fieldset>
	);
}
