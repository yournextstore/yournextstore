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
		<fieldset className="m-0 border-0 p-0">
			<legend className="hs-label mb-3">Purchase</legend>
			<div className="grid gap-2">
				{options.map((option) => (
					<label key={option.id ?? "one-time"} className="hs-opt-wrap block">
						<input
							type="radio"
							name="purchase"
							checked={value === option.id}
							onChange={() => onChange(option.id)}
							className="hs-opt-input"
						/>
						<span className="hs-opt">
							<strong>{option.label}</strong>
							{option.detail && <small>{option.detail}</small>}
						</span>
					</label>
				))}
			</div>
		</fieldset>
	);
}
