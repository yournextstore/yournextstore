"use client";

import { Minus, Plus } from "lucide-react";

type QuantitySelectorProps = {
	quantity: number;
	onQuantityChange: (quantity: number) => void;
	min?: number;
	max?: number;
	disabled?: boolean;
};

/** Horizon's compact counter: "- 1 +" in a field-grey box beside the add-to-bag button. */
export function QuantitySelector({
	quantity,
	onQuantityChange,
	min = 1,
	max = 99,
	disabled = false,
}: QuantitySelectorProps) {
	return (
		<fieldset className="inline-flex h-14 shrink-0 items-center rounded-lg border border-input">
			<legend className="sr-only">Quantity</legend>
			<button
				type="button"
				className="flex h-full w-7 items-center justify-center text-ink disabled:text-field"
				onClick={() => onQuantityChange(Math.max(min, quantity - 1))}
				disabled={disabled || quantity <= min}
				aria-label="Decrease quantity"
			>
				<Minus className="h-3 w-3" />
			</button>
			<span className="w-5 text-center text-base text-ink tabular-nums" aria-live="polite">
				{quantity}
			</span>
			<button
				type="button"
				className="flex h-full w-7 items-center justify-center text-ink disabled:text-field"
				onClick={() => onQuantityChange(Math.min(max, quantity + 1))}
				disabled={disabled || quantity >= max}
				aria-label="Increase quantity"
			>
				<Plus className="h-3 w-3" />
			</button>
		</fieldset>
	);
}
