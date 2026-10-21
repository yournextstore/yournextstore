"use client";

import { Minus, Plus } from "lucide-react";

type QuantitySelectorProps = {
	quantity: number;
	onQuantityChange: (quantity: number) => void;
	min?: number;
	max?: number;
	disabled?: boolean;
};

/** Bordered − n + stepper beside the navy add-to-cart bar. */
export function QuantitySelector({
	quantity,
	onQuantityChange,
	min = 1,
	max = 99,
	disabled = false,
}: QuantitySelectorProps) {
	return (
		<div className="inline-flex h-12 shrink-0 items-center rounded-md border border-main text-main">
			<button
				type="button"
				className="flex h-full w-10 items-center justify-center disabled:opacity-40"
				onClick={() => onQuantityChange(Math.max(min, quantity - 1))}
				disabled={disabled || quantity <= min}
				aria-label="Decrease quantity"
			>
				<Minus className="h-4 w-4" />
			</button>
			<span className="flex h-full w-8 items-center justify-center border-x border-dashed border-main/40 text-sm tabular-nums">
				<span className="sr-only">Quantity </span>
				{quantity}
			</span>
			<button
				type="button"
				className="flex h-full w-10 items-center justify-center disabled:opacity-40"
				onClick={() => onQuantityChange(Math.min(max, quantity + 1))}
				disabled={disabled || quantity >= max}
				aria-label="Increase quantity"
			>
				<Plus className="h-4 w-4" />
			</button>
		</div>
	);
}
