"use client";

import { Minus, Plus } from "lucide-react";

type QuantitySelectorProps = {
	quantity: number;
	onQuantityChange: (quantity: number) => void;
	min?: number;
	max?: number;
	disabled?: boolean;
};

/** The original's bordered stepper that sits beside the add-to-cart button. */
export function QuantitySelector({
	quantity,
	onQuantityChange,
	min = 1,
	max = 99,
	disabled = false,
}: QuantitySelectorProps) {
	return (
		<div className="inline-flex h-12 shrink-0 items-center rounded-md border border-foreground/70 bg-card">
			<button
				type="button"
				className="flex h-full w-10 items-center justify-center text-foreground transition-opacity disabled:opacity-40"
				onClick={() => onQuantityChange(Math.max(min, quantity - 1))}
				disabled={disabled || quantity <= min}
				aria-label="Decrease quantity"
			>
				<Minus className="size-3.5" aria-hidden="true" />
			</button>
			<span className="w-8 text-center text-sm tabular-nums" aria-live="polite">
				{quantity}
			</span>
			<button
				type="button"
				className="flex h-full w-10 items-center justify-center text-foreground transition-opacity disabled:opacity-40"
				onClick={() => onQuantityChange(Math.min(max, quantity + 1))}
				disabled={disabled || quantity >= max}
				aria-label="Increase quantity"
			>
				<Plus className="size-3.5" aria-hidden="true" />
			</button>
		</div>
	);
}
