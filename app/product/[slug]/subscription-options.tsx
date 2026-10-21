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
		<fieldset className="m-0 space-y-2 border-0 p-0">
			<legend className="plate-label mb-3">Purchase</legend>
			{options.map((option) => (
				<label
					key={option.id ?? "one-time"}
					className={cn(
						"flex cursor-pointer items-start gap-3 rounded-[10px] border p-4 transition-colors duration-200",
						value === option.id ? "border-signal bg-line-2" : "border-line hover:border-signal",
					)}
				>
					<input
						type="radio"
						name="purchase"
						checked={value === option.id}
						onChange={() => onChange(option.id)}
						className="mt-0.5 size-4 shrink-0 accent-signal"
					/>
					<span className="space-y-1">
						<span className="font-plate block text-[0.8rem] tracking-[0.06em] text-ink uppercase">
							{option.label}
						</span>
						{option.detail && <span className="block text-xs text-dim">{option.detail}</span>}
					</span>
				</label>
			))}
		</fieldset>
	);
}
