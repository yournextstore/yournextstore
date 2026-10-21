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
		<div className="inline-flex h-[2.9rem] shrink-0 items-center rounded-[11px] border border-line bg-panel px-1">
			<button
				type="button"
				className="inline-flex size-9 items-center justify-center text-ink transition-colors hover:text-ochre disabled:opacity-40"
				onClick={() => onQuantityChange(Math.max(min, quantity - 1))}
				disabled={disabled || quantity <= min}
				aria-label="Decrease quantity"
			>
				<Minus className="size-4" aria-hidden="true" />
			</button>
			<span
				aria-live="polite"
				className="mono flex w-8 items-center justify-center text-[0.85rem] tabular-nums"
			>
				<span className="sr-only">Quantity </span>
				{quantity}
			</span>
			<button
				type="button"
				className="inline-flex size-9 items-center justify-center text-ink transition-colors hover:text-ochre disabled:opacity-40"
				onClick={() => onQuantityChange(Math.min(max, quantity + 1))}
				disabled={disabled || quantity >= max}
				aria-label="Increase quantity"
			>
				<Plus className="size-4" aria-hidden="true" />
			</button>
		</div>
	);
}
