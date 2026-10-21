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
			<legend className="label mb-3">Purchase</legend>
			{options.map((option) => (
				<label
					key={option.id ?? "one-time"}
					className={cn(
						"flex cursor-pointer items-start gap-3 p-4 transition-shadow duration-200",
						value === option.id
							? "shadow-[inset_0_0_0_2px_var(--walnut)]"
							: "shadow-[inset_0_0_0_1px_var(--border)] hover:shadow-[inset_0_0_0_1px_var(--line-strong)]",
					)}
				>
					<input
						type="radio"
						name="purchase"
						checked={value === option.id}
						onChange={() => onChange(option.id)}
						className="mt-0.5 size-4 shrink-0 accent-walnut"
					/>
					<span className="min-w-0 space-y-1">
						<span className="block text-[0.9375rem] font-medium">{option.label}</span>
						{option.detail && (
							<span className="mono block text-[0.6875rem] text-muted-foreground">{option.detail}</span>
						)}
					</span>
				</label>
			))}
		</fieldset>
	);
}
