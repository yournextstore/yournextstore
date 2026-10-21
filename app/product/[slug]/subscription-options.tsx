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
		<fieldset className="m-0 flex items-start border-0 p-0">
			<legend className="float-left inline-flex h-6 w-20 shrink-0 items-center">Purchase</legend>
			<div className="flex flex-col">
				{options.map((option) => (
					<label
						key={option.id ?? "one-time"}
						className="flex min-h-6 cursor-pointer items-start gap-[1ch] hover:underline"
					>
						<input
							type="radio"
							name="purchase"
							checked={value === option.id}
							onChange={() => onChange(option.id)}
							className="mt-1 size-4 shrink-0 cursor-pointer accent-black"
						/>
						<span>
							<span className={cn("block leading-6", value === option.id && "underline")}>
								{option.label}
							</span>
							{option.detail && <span className="block text-muted-foreground">{option.detail}</span>}
						</span>
					</label>
				))}
			</div>
		</fieldset>
	);
}
