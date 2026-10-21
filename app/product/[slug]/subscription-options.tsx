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

	// Set like the variant chips: white rows, the chosen one black.
	return (
		<fieldset className="m-0 border-0 p-0">
			<legend className="mb-2">Purchase</legend>
			<div className="flex flex-col gap-1">
				{options.map((option) => (
					<label
						key={option.id ?? "one-time"}
						className={cn(
							"flex min-h-8 cursor-pointer flex-col justify-center rounded-sm px-3 py-1.5 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2",
							value === option.id ? "bg-black text-white" : "bg-white hover:bg-black/5",
						)}
					>
						<input
							type="radio"
							name="purchase"
							checked={value === option.id}
							onChange={() => onChange(option.id)}
							className="sr-only"
						/>
						<span>{option.label}</span>
						{option.detail && <span className="text-copy font-normal">{option.detail}</span>}
					</label>
				))}
			</div>
		</fieldset>
	);
}
