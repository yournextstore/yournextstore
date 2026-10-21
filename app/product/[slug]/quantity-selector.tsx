"use client";

import { Minus, Plus } from "lucide-react";

type QuantitySelectorProps = {
	quantity: number;
	onQuantityChange: (quantity: number) => void;
	min?: number;
	max?: number;
	disabled?: boolean;
};

/** Fluid's quantity stepper: one outlined pill-cornered box, minus, count, plus. */
export function QuantitySelector({
	quantity,
	onQuantityChange,
	min = 1,
	max = 99,
	disabled = false,
}: QuantitySelectorProps) {
	return (
		<div className="inline-flex h-9 items-center rounded-md border border-foreground">
			<button
				type="button"
				className="flex size-9 items-center justify-center rounded-l-md transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40"
				onClick={() => onQuantityChange(Math.max(min, quantity - 1))}
				disabled={disabled || quantity <= min}
				aria-label="Decrease quantity"
			>
				<Minus className="size-3.5" />
			</button>
			<output
				aria-label="Quantity"
				className="flex h-9 w-10 items-center justify-center text-body tabular-nums"
			>
				{quantity}
			</output>
			<button
				type="button"
				className="flex size-9 items-center justify-center rounded-r-md transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40"
				onClick={() => onQuantityChange(Math.min(max, quantity + 1))}
				disabled={disabled || quantity >= max}
				aria-label="Increase quantity"
			>
				<Plus className="size-3.5" />
			</button>
		</div>
	);
}
