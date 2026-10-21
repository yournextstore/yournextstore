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
		<fieldset className="space-y-2">
			<legend className="mb-2 text-sm font-bold">Purchase</legend>
			{options.map((option) => (
				<label
					key={option.id ?? "one-time"}
					className={cn(
						"flex min-h-11 cursor-pointer items-start gap-3 rounded-md border px-3 py-2 transition-colors",
						value === option.id ? "border-sand bg-sand" : "border-slate-300 bg-white hover:border-slate-400",
					)}
				>
					<input
						type="radio"
						name="purchase"
						checked={value === option.id}
						onChange={() => onChange(option.id)}
						className="mt-0.5 size-4 shrink-0 accent-ink"
					/>
					<span className="space-y-1">
						<span className="block text-sm font-bold">{option.label}</span>
						{option.detail && <span className="block text-sm text-slate-700">{option.detail}</span>}
					</span>
				</label>
			))}
		</fieldset>
	);
}
