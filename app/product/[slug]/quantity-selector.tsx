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
		<div className="inline-flex h-12 shrink-0 items-center rounded-xs bg-muted">
			<button
				type="button"
				className="flex h-full w-11 items-center justify-center text-foreground transition-colors hover:bg-accent disabled:opacity-40"
				onClick={() => onQuantityChange(Math.max(min, quantity - 1))}
				disabled={disabled || quantity <= min}
				aria-label="Decrease quantity"
			>
				<Minus className="h-3.5 w-3.5" strokeWidth={1.5} />
			</button>
			<span className="flex h-full w-8 items-center justify-center text-sm tabular-nums" aria-live="polite">
				<span className="sr-only">Quantity </span>
				{quantity}
			</span>
			<button
				type="button"
				className="flex h-full w-11 items-center justify-center text-foreground transition-colors hover:bg-accent disabled:opacity-40"
				onClick={() => onQuantityChange(Math.min(max, quantity + 1))}
				disabled={disabled || quantity >= max}
				aria-label="Increase quantity"
			>
				<Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
			</button>
		</div>
	);
}
