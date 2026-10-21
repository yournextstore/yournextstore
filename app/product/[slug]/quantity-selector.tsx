"use client";

import { Minus, Plus } from "lucide-react";

type QuantitySelectorProps = {
	quantity: number;
	onQuantityChange: (quantity: number) => void;
	min?: number;
	max?: number;
	disabled?: boolean;
};

/** HiyoRi's pill stepper: minus, count, plus inside a 2px rounded outline. */
export function QuantitySelector({
	quantity,
	onQuantityChange,
	min = 1,
	max = 99,
	disabled = false,
}: QuantitySelectorProps) {
	return (
		<div>
			<span className="mb-2 block text-sm font-medium">Quantity</span>
			<div className="flex h-12 w-36 items-center justify-between rounded-full border-2 border-input px-3">
				<button
					type="button"
					className="flex h-8 w-8 items-center justify-center disabled:opacity-40"
					onClick={() => onQuantityChange(Math.max(min, quantity - 1))}
					disabled={disabled || quantity <= min}
					aria-label="Decrease quantity"
				>
					<Minus className="h-5 w-5" strokeWidth={1.5} />
				</button>
				<span className="text-center text-sm tabular-nums" aria-live="polite">
					{quantity}
				</span>
				<button
					type="button"
					className="flex h-8 w-8 items-center justify-center disabled:opacity-40"
					onClick={() => onQuantityChange(Math.min(max, quantity + 1))}
					disabled={disabled || quantity >= max}
					aria-label="Increase quantity"
				>
					<Plus className="h-5 w-5" strokeWidth={1.5} />
				</button>
			</div>
		</div>
	);
}
