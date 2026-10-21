"use client";

import { Minus, Plus } from "lucide-react";

type QuantitySelectorProps = {
	quantity: number;
	onQuantityChange: (quantity: number) => void;
	min?: number;
	max?: number;
	disabled?: boolean;
};

/** The original's "Qty" box beside the add-to-cart pill, as a stepper. */
export function QuantitySelector({
	quantity,
	onQuantityChange,
	min = 1,
	max = 99,
	disabled = false,
}: QuantitySelectorProps) {
	return (
		<div className="inline-flex h-11 shrink-0 items-center rounded-md border border-slate-300 bg-white text-sm">
			<button
				type="button"
				className="flex h-full w-9 items-center justify-center rounded-l-md text-slate-600 transition-colors hover:bg-cream disabled:opacity-40"
				onClick={() => onQuantityChange(Math.max(min, quantity - 1))}
				disabled={disabled || quantity <= min}
				aria-label="Decrease quantity"
			>
				<Minus className="size-3.5" aria-hidden="true" />
			</button>
			<span className="flex min-w-14 items-center justify-center gap-1.5 tabular-nums" aria-live="polite">
				<span className="text-muted-foreground">Qty</span>
				<span className="sr-only">:</span>
				{quantity}
			</span>
			<button
				type="button"
				className="flex h-full w-9 items-center justify-center rounded-r-md text-slate-600 transition-colors hover:bg-cream disabled:opacity-40"
				onClick={() => onQuantityChange(Math.min(max, quantity + 1))}
				disabled={disabled || quantity >= max}
				aria-label="Increase quantity"
			>
				<Plus className="size-3.5" aria-hidden="true" />
			</button>
		</div>
	);
}
