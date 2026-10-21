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
		<fieldset className="m-0 space-y-2.5 border-0 p-0">
			<legend className="ledger mb-3 text-[0.64rem] tracking-[0.2em] text-faint">Purchase</legend>
			{options.map((option) => (
				<label
					key={option.id ?? "one-time"}
					className={cn(
						"flex cursor-pointer items-start gap-3 rounded-[4px] border border-line bg-panel p-4 transition-colors duration-300 hover:border-gold/45",
						value === option.id && "border-gold bg-panel-2",
					)}
				>
					<input
						type="radio"
						name="purchase"
						checked={value === option.id}
						onChange={() => onChange(option.id)}
						className="mt-1 size-4 shrink-0 accent-gold"
					/>
					<span className="space-y-1">
						<span className="serif block text-[1.2rem] font-medium leading-tight text-cream">
							{option.label}
						</span>
						{option.detail && (
							<span className="mono block text-[0.75rem] tracking-[0.04em] text-dim">{option.detail}</span>
						)}
					</span>
				</label>
			))}
		</fieldset>
	);
}
