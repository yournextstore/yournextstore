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
		<fieldset className="m-0 mb-6 border-0 p-0">
			<legend className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">Purchase</legend>
			<div className="flex flex-col gap-2">
				{options.map((option) => (
					<label
						key={option.id ?? "one-time"}
						className={cn(
							"flex cursor-pointer items-start gap-3 rounded-md border px-4 py-2.5 text-sm transition",
							value === option.id
								? "border-foreground text-foreground"
								: "border-line text-muted-foreground hover:border-foreground",
						)}
					>
						<input
							type="radio"
							name="purchase"
							checked={value === option.id}
							onChange={() => onChange(option.id)}
							className="mt-0.5 size-3.5 shrink-0 accent-foreground"
						/>
						<span className="min-w-0 space-y-0.5">
							<span className="block">{option.label}</span>
							{option.detail && <span className="block text-xs text-faint">{option.detail}</span>}
						</span>
					</label>
				))}
			</div>
		</fieldset>
	);
}
