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
			<legend className="mb-2">Purchase :</legend>
			{options.map((option) => (
				<label
					key={option.id ?? "one-time"}
					className={cn(
						"flex cursor-pointer items-start gap-3 rounded-sm border border-rule bg-background px-3 py-2 transition-colors hover:bg-muted",
						value === option.id && "bg-muted ring-2 ring-mint",
					)}
				>
					<input
						type="radio"
						name="purchase"
						checked={value === option.id}
						onChange={() => onChange(option.id)}
						className="mt-1 size-4 shrink-0 accent-foreground"
					/>
					<span className="space-y-0.5">
						<span className="block font-medium">{option.label}</span>
						{option.detail && (
							<span className="block text-sm italic text-muted-foreground">{option.detail}</span>
						)}
					</span>
				</label>
			))}
		</fieldset>
	);
}
