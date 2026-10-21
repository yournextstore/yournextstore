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
		<div>
			<h3 className="text-sm font-medium text-gray-900">Quantity</h3>
			<div className="mt-4 inline-flex items-center rounded-md border border-gray-300 bg-white shadow-sm">
				<button
					type="button"
					className="flex h-10 w-10 items-center justify-center text-gray-500 hover:text-gray-700 disabled:text-gray-300"
					onClick={() => onQuantityChange(Math.max(min, quantity - 1))}
					disabled={disabled || quantity <= min}
					aria-label="Decrease quantity"
				>
					<Minus className="h-4 w-4" aria-hidden="true" />
				</button>
				<span className="flex h-10 w-12 items-center justify-center text-sm font-medium text-gray-900 tabular-nums">
					{quantity}
				</span>
				<button
					type="button"
					className="flex h-10 w-10 items-center justify-center text-gray-500 hover:text-gray-700 disabled:text-gray-300"
					onClick={() => onQuantityChange(Math.min(max, quantity + 1))}
					disabled={disabled || quantity >= max}
					aria-label="Increase quantity"
				>
					<Plus className="h-4 w-4" aria-hidden="true" />
				</button>
			</div>
		</div>
	);
}
