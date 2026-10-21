"use client";

import { Minus, Plus } from "lucide-react";

type QuantitySelectorProps = {
	quantity: number;
	onQuantityChange: (quantity: number) => void;
	min?: number;
	max?: number;
	disabled?: boolean;
};

/** Bordered stepper the height of Blueprint's 50px buttons, sitting beside Add to cart. */
export function QuantitySelector({
	quantity,
	onQuantityChange,
	min = 1,
	max = 99,
	disabled = false,
}: QuantitySelectorProps) {
	return (
		<fieldset className="m-0 flex h-[3.125rem] shrink-0 items-center rounded border border-border p-0">
			<legend className="sr-only">Quantity</legend>
			<button
				type="button"
				className="flex h-full w-10 items-center justify-center disabled:opacity-40"
				onClick={() => onQuantityChange(Math.max(min, quantity - 1))}
				disabled={disabled || quantity <= min}
				aria-label="Decrease quantity"
			>
				<Minus className="size-4" aria-hidden />
			</button>
			<span className="w-6 text-center text-base tabular-nums" aria-live="polite">
				{quantity}
			</span>
			<button
				type="button"
				className="flex h-full w-10 items-center justify-center disabled:opacity-40"
				onClick={() => onQuantityChange(Math.min(max, quantity + 1))}
				disabled={disabled || quantity >= max}
				aria-label="Increase quantity"
			>
				<Plus className="size-4" aria-hidden />
			</button>
		</fieldset>
	);
}
