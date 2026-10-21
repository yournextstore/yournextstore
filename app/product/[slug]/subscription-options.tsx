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
		<fieldset className="m-0 min-w-0 border-0 p-0">
			<legend className="mb-2 w-full border-t border-border pt-4 font-semibold">Purchase</legend>
			<div className="flex flex-col">
				{options.map((option) => (
					<label
						key={option.id ?? "one-time"}
						className="flex min-h-11 cursor-pointer items-start gap-3 border-b border-border py-3 text-body-sm transition-colors last:border-b-0 hover:text-primary"
					>
						<input
							type="radio"
							name="purchase"
							checked={value === option.id}
							onChange={() => onChange(option.id)}
							className="mt-0.5 size-5 shrink-0 accent-primary"
						/>
						<span className="space-y-1">
							<span className={cn("block", value === option.id && "font-semibold")}>{option.label}</span>
							{option.detail && (
								<span className="block text-label-sm text-muted-foreground">{option.detail}</span>
							)}
						</span>
					</label>
				))}
			</div>
		</fieldset>
	);
}
