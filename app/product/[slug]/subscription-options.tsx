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
		<fieldset className="m-0 grid gap-3 border-0 p-0 text-sm">
			<legend className="mb-3 font-semibold">Purchase</legend>
			{options.map((option) => (
				<label
					key={option.id ?? "one-time"}
					className={cn(
						"flex cursor-pointer items-start gap-3 rounded-control px-4 py-3.5 shadow-[inset_0_0_0_1px_var(--input)] transition-[box-shadow,background-color] hover:shadow-[inset_0_0_0_1px_var(--stroke-strong)]",
						value === option.id &&
							"bg-copper-wash shadow-[inset_0_0_0_2px_var(--copper)] hover:shadow-[inset_0_0_0_2px_var(--copper)]",
					)}
				>
					<input
						type="radio"
						name="purchase"
						checked={value === option.id}
						onChange={() => onChange(option.id)}
						className="mt-1 size-4 shrink-0 accent-copper"
					/>
					<span className="grid gap-0.5">
						<span className="text-base font-semibold">{option.label}</span>
						{option.detail && <span className="text-[0.8125rem] text-muted-foreground">{option.detail}</span>}
					</span>
				</label>
			))}
		</fieldset>
	);
}
