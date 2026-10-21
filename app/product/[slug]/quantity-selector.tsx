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
	const step =
		"inline-flex size-8 items-center justify-center rounded-xs bg-tonal transition-colors hover:bg-tonal-hover disabled:cursor-not-allowed disabled:opacity-40";
	return (
		<div className="flex items-center gap-3">
			<span className="text-label-sm">Quantity:</span>
			<div className="inline-flex items-center gap-1">
				<button
					type="button"
					className={step}
					onClick={() => onQuantityChange(Math.max(min, quantity - 1))}
					disabled={disabled || quantity <= min}
					aria-label="Decrease quantity"
				>
					<Minus aria-hidden className="h-3.5 w-3.5" />
				</button>
				<span className="flex h-8 w-8 items-center justify-center text-label tabular-nums">{quantity}</span>
				<button
					type="button"
					className={step}
					onClick={() => onQuantityChange(Math.min(max, quantity + 1))}
					disabled={disabled || quantity >= max}
					aria-label="Increase quantity"
				>
					<Plus aria-hidden className="h-3.5 w-3.5" />
				</button>
			</div>
		</div>
	);
}
