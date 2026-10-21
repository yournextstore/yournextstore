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
		<fieldset className="m-0 flex flex-col gap-1.5 border-0 p-0">
			<legend className="mb-2.5 text-[13px]">Purchase</legend>
			{options.map((option) => (
				<label
					key={option.id ?? "one-time"}
					className={cn(
						"press flex cursor-pointer items-start gap-3 rounded-[22px] border px-5 py-3.5 transition-colors duration-200",
						value === option.id ? "border-foreground" : "border-line hover:border-foreground",
					)}
				>
					<input
						type="radio"
						name="purchase"
						checked={value === option.id}
						onChange={() => onChange(option.id)}
						className="mt-0.5 size-4 shrink-0 accent-foreground"
					/>
					<span className="flex flex-col gap-1">
						<span className="text-sm font-medium">{option.label}</span>
						{option.detail && <span className="text-[13px] text-muted-foreground">{option.detail}</span>}
					</span>
				</label>
			))}
		</fieldset>
	);
}
