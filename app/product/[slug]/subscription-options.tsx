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

	// Reads like the variant selector: a dot and a word per choice, a filled dot for the chosen one.
	return (
		<fieldset className="m-0 border-0 p-0">
			<legend className="mb-2 text-foot text-muted-foreground">Purchase</legend>
			<div className="flex flex-col gap-2">
				{options.map((option) => {
					const isSelected = value === option.id;
					return (
						<label
							key={option.id ?? "one-time"}
							className={cn(
								"flex min-h-8 cursor-pointer items-start gap-2 text-copy transition-colors has-focus-visible:underline",
								isSelected ? "text-snow" : "text-muted-foreground hover:text-snow",
							)}
						>
							<input
								type="radio"
								name="purchase"
								checked={isSelected}
								onChange={() => onChange(option.id)}
								className="sr-only"
							/>
							<span
								aria-hidden="true"
								className={cn(
									"mt-[0.4em] size-3 shrink-0 rounded-full border border-current",
									isSelected && "bg-current",
								)}
							/>
							<span>
								<span className="block">{option.label}</span>
								{option.detail && (
									<span className="block text-foot text-muted-foreground">{option.detail}</span>
								)}
							</span>
						</label>
					);
				})}
			</div>
		</fieldset>
	);
}
