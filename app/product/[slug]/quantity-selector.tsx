"use client";

import { Minus, Plus } from "lucide-react";

type QuantitySelectorProps = {
	quantity: number;
	onQuantityChange: (quantity: number) => void;
	min?: number;
	max?: number;
	disabled?: boolean;
};

/** "QTY" with round minus/plus buttons either side of the number, as in the original. */
export function QuantitySelector({
	quantity,
	onQuantityChange,
	min = 1,
	max = 99,
	disabled = false,
}: QuantitySelectorProps) {
	return (
		<div>
			<span className="mb-3 block text-sm/6 uppercase">Qty</span>
			<div className="flex items-center gap-2">
				<button
					type="button"
					className="flex h-8 w-8 items-center justify-center rounded-full border border-border transition-colors hover:bg-secondary disabled:opacity-40"
					onClick={() => onQuantityChange(Math.max(min, quantity - 1))}
					disabled={disabled || quantity <= min}
					aria-label="Decrease quantity"
				>
					<Minus className="h-4 w-4" strokeWidth={1.5} />
				</button>
				<span className="w-8 text-center text-base tabular-nums" aria-live="polite">
					{quantity}
				</span>
				<button
					type="button"
					className="flex h-8 w-8 items-center justify-center rounded-full border border-border transition-colors hover:bg-secondary disabled:opacity-40"
					onClick={() => onQuantityChange(Math.min(max, quantity + 1))}
					disabled={disabled || quantity >= max}
					aria-label="Increase quantity"
				>
					<Plus className="h-4 w-4" strokeWidth={1.5} />
				</button>
			</div>
		</div>
	);
}
