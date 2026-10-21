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
		<div className="inline-flex h-[52px] shrink-0 items-center rounded-[2px] border-2 border-gold/40 px-1">
			<button
				type="button"
				className="inline-flex size-10 items-center justify-center text-dim transition-colors hover:text-gold disabled:opacity-40"
				onClick={() => onQuantityChange(Math.max(min, quantity - 1))}
				disabled={disabled || quantity <= min}
				aria-label="Decrease quantity"
			>
				<Minus className="size-4" aria-hidden="true" />
			</button>
			<span
				aria-live="polite"
				className="mono flex w-8 items-center justify-center text-sm tabular-nums text-cream"
			>
				<span className="sr-only">Quantity </span>
				{quantity}
			</span>
			<button
				type="button"
				className="inline-flex size-10 items-center justify-center text-dim transition-colors hover:text-gold disabled:opacity-40"
				onClick={() => onQuantityChange(Math.min(max, quantity + 1))}
				disabled={disabled || quantity >= max}
				aria-label="Increase quantity"
			>
				<Plus className="size-4" aria-hidden="true" />
			</button>
		</div>
	);
}
