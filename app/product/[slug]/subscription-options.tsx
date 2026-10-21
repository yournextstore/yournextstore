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
// so this only names each choice. Laid out like the variant rows: label left, choices inline,
// the chosen one inverted.
export function SubscriptionOptions({ plans, value, onChange, allowOneTime }: SubscriptionOptionsProps) {
	const options = [
		...(allowOneTime ? [{ id: null, label: "One-time purchase", detail: null }] : []),
		...plans.map((plan) => ({ id: plan.id, label: planLabel(plan), detail: plan.benefits })),
	];
	const detail = options.find((option) => option.id === value)?.detail;

	return (
		<fieldset className="-mt-px m-0 border-y border-black p-0 py-1.5 text-t14 uppercase">
			<legend className="float-left mr-6 max-w-[45%] py-1">Purchase</legend>
			<div className="flex flex-wrap gap-1">
				{options.map((option) => (
					<label
						key={option.id ?? "one-time"}
						className={cn(
							"inline-flex min-h-7 cursor-pointer items-center px-1.5 has-[:focus-visible]:outline has-[:focus-visible]:outline-black",
							value === option.id ? "bg-black text-white" : "hover:bg-black/10",
						)}
					>
						<input
							type="radio"
							name="purchase"
							checked={value === option.id}
							onChange={() => onChange(option.id)}
							className="sr-only"
						/>
						{option.label}
					</label>
				))}
			</div>
			{detail && <p className="clear-left pt-1 normal-case">{detail}</p>}
		</fieldset>
	);
}
