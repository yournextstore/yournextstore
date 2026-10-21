"use client";

import { Minus, Plus } from "lucide-react";

type QuantitySelectorProps = {
	quantity: number;
	onQuantityChange: (quantity: number) => void;
	min?: number;
	max?: number;
	disabled?: boolean;
};

/** Compact quantity row in the widget: the cart's grey minus/plus circles around the count. */
export function QuantitySelector({
	quantity,
	onQuantityChange,
	min = 1,
	max = 99,
	disabled = false,
}: QuantitySelectorProps) {
	return (
		<div>
			<span className="mb-2 block text-ui-xs text-darkgray">Quantity</span>
			<div className="flex items-center">
				<button
					type="button"
					className="flex size-8 items-center justify-center rounded-full bg-lightgray duration-150 hover:bg-gray disabled:opacity-40"
					onClick={() => onQuantityChange(Math.max(min, quantity - 1))}
					disabled={disabled || quantity <= min}
					aria-label="Decrease quantity"
				>
					<Minus className="size-3.5" />
				</button>
				<span className="w-10 text-center font-bold tabular-nums" aria-live="polite">
					{quantity}
				</span>
				<button
					type="button"
					className="flex size-8 items-center justify-center rounded-full bg-lightgray duration-150 hover:bg-gray disabled:opacity-40"
					onClick={() => onQuantityChange(Math.min(max, quantity + 1))}
					disabled={disabled || quantity >= max}
					aria-label="Increase quantity"
				>
					<Plus className="size-3.5" />
				</button>
			</div>
		</div>
	);
}
