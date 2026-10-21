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
		<fieldset className="m-0 mb-6 space-y-2 border-0 p-0">
			<legend className="mb-3 text-xs tracking-[0.18em] text-[#a3a3a3] uppercase">Purchase</legend>
			{options.map((option) => (
				<label
					key={option.id ?? "one-time"}
					className={cn(
						"flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-colors",
						value === option.id
							? "border-amber bg-amber/10"
							: "border-white/15 bg-white/[0.02] hover:border-amber/50",
					)}
				>
					<input
						type="radio"
						name="purchase"
						checked={value === option.id}
						onChange={() => onChange(option.id)}
						className="mt-0.5 size-4 shrink-0 accent-amber"
					/>
					<span className="space-y-1">
						<span className={cn("block text-sm", value === option.id ? "text-amber" : "text-bone")}>
							{option.label}
						</span>
						{option.detail && <span className="block text-xs text-[#a3a3a3]">{option.detail}</span>}
					</span>
				</label>
			))}
		</fieldset>
	);
}
