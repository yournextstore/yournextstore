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
		<div className="flex h-11 w-[110px] shrink-0 items-center justify-between rounded-full bg-pill px-4 sm:w-[170px] sm:px-5 md:h-[52px]">
			<button
				type="button"
				className="flex size-6 items-center justify-center disabled:opacity-30"
				onClick={() => onQuantityChange(Math.max(min, quantity - 1))}
				disabled={disabled || quantity <= min}
				aria-label="Decrease quantity"
			>
				<Minus className="size-5" strokeWidth={2.5} />
			</button>
			<span className="text-sm font-medium tabular-nums sm:text-base" aria-live="polite">
				{quantity}
			</span>
			<button
				type="button"
				className="flex size-6 items-center justify-center disabled:opacity-30"
				onClick={() => onQuantityChange(Math.min(max, quantity + 1))}
				disabled={disabled || quantity >= max}
				aria-label="Increase quantity"
			>
				<Plus className="size-5" strokeWidth={2.5} />
			</button>
		</div>
	);
}
