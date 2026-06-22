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
	const baseBtn =
		"h-11 w-11 flex items-center justify-center transition-colors hover:bg-[var(--color-secondary-container)] hover:text-[var(--color-on-secondary-container)] disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-foreground";

	return (
		<div>
			<span className="label-caps mb-3 block text-foreground">Quantity</span>
			<div className="inline-flex items-stretch neo-border bg-[var(--color-surface-container-lowest)] divide-x divide-foreground">
				<button
					type="button"
					className={baseBtn}
					onClick={() => onQuantityChange(Math.max(min, quantity - 1))}
					disabled={disabled || quantity <= min}
					aria-label="Decrease quantity"
				>
					<Minus className="h-4 w-4" />
				</button>
				<span className="flex h-11 w-14 items-center justify-center font-sans text-base font-semibold tabular-nums">
					{quantity}
				</span>
				<button
					type="button"
					className={baseBtn}
					onClick={() => onQuantityChange(Math.min(max, quantity + 1))}
					disabled={disabled || quantity >= max}
					aria-label="Increase quantity"
				>
					<Plus className="h-4 w-4" />
				</button>
			</div>
		</div>
	);
}
