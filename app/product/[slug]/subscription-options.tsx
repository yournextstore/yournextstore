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

	// Ruled rows under an uppercase title, like the variant option rows above it.
	return (
		<fieldset className="border-t border-border pt-4">
			<legend className="float-left mb-2 w-full text-micro font-semibold tracking-wider uppercase">
				Purchase
			</legend>
			{options.map((option) => (
				<label
					key={option.id ?? "one-time"}
					className={cn(
						"flex cursor-pointer items-start gap-3 border-t border-border py-4 transition-opacity first-of-type:border-t-0 hover:opacity-70",
						value === option.id && "hover:opacity-100",
					)}
				>
					<input
						type="radio"
						name="purchase"
						checked={value === option.id}
						onChange={() => onChange(option.id)}
						className="mt-1 size-4 shrink-0 accent-foreground"
					/>
					<span>
						<span className={cn("block text-body", value === option.id && "font-semibold")}>
							{option.label}
						</span>
						{option.detail && (
							<span className="mt-1 block text-micro text-muted-foreground">{option.detail}</span>
						)}
					</span>
				</label>
			))}
		</fieldset>
	);
}
