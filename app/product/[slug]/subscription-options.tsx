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
		<fieldset className="m-0 flex flex-col gap-3 border-0 border-t border-line p-0 py-3">
			<legend className="contents">
				<span className="eti text-faint">Purchase</span>
			</legend>
			<div className="flex flex-col gap-2">
				{options.map((option) => (
					<label
						key={option.id ?? "one-time"}
						className={cn(
							"flex cursor-pointer items-start gap-3 rounded-[2px] border px-3 py-2.5 transition",
							value === option.id ? "border-acc" : "border-rule hover:border-faint",
						)}
					>
						<input
							type="radio"
							name="purchase"
							checked={value === option.id}
							onChange={() => onChange(option.id)}
							className="mt-0.5 size-4 shrink-0 accent-acc"
						/>
						<span className="flex flex-col gap-1">
							<span className="text-[13.5px] text-ink">{option.label}</span>
							{option.detail && <span className="text-[12.5px] leading-[1.6] text-dim">{option.detail}</span>}
						</span>
					</label>
				))}
			</div>
		</fieldset>
	);
}
