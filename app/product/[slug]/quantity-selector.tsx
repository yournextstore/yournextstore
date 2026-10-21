"use client";

import { Minus, Plus } from "lucide-react";

type QuantitySelectorProps = {
	quantity: number;
	onQuantityChange: (quantity: number) => void;
	min?: number;
	max?: number;
	disabled?: boolean;
};

export function QuantitySelector({
	quantity,
	onQuantityChange,
	min = 1,
	max = 99,
	disabled = false,
}: QuantitySelectorProps) {
	return (
		<div className="inline-flex h-14 items-center rounded-md border border-input bg-card">
			<button
				type="button"
				className="flex h-full w-11 items-center justify-center rounded-l-md text-foreground transition-colors hover:bg-secondary disabled:opacity-40"
				onClick={() => onQuantityChange(Math.max(min, quantity - 1))}
				disabled={disabled || quantity <= min}
				aria-label="Decrease quantity"
			>
				<Minus className="h-4 w-4" strokeWidth={1.5} />
			</button>
			<span
				className="flex h-full w-10 items-center justify-center text-base tabular-nums"
				aria-live="polite"
			>
				<span className="sr-only">Quantity </span>
				{quantity}
			</span>
			<button
				type="button"
				className="flex h-full w-11 items-center justify-center rounded-r-md text-foreground transition-colors hover:bg-secondary disabled:opacity-40"
				onClick={() => onQuantityChange(Math.min(max, quantity + 1))}
				disabled={disabled || quantity >= max}
				aria-label="Increase quantity"
			>
				<Plus className="h-4 w-4" strokeWidth={1.5} />
			</button>
		</div>
	);
}
