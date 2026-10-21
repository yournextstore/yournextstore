"use client";

import { MinusIcon, PlusIcon } from "lucide-react";

type QuantitySelectorProps = {
	quantity: number;
	onQuantityChange: (quantity: number) => void;
	min?: number;
	max?: number;
	disabled?: boolean;
};

/** The original's quantity row: label left, a small pill stepper right. */
export function QuantitySelector({
	quantity,
	onQuantityChange,
	min = 1,
	max = 99,
	disabled = false,
}: QuantitySelectorProps) {
	return (
		<div className="flex min-h-11 items-center justify-between gap-4 font-semibold">
			<span>Quantity</span>
			<div className="inline-grid grid-cols-[36px_36px_36px] items-center overflow-hidden rounded-full border border-border bg-card">
				<button
					type="button"
					className="inline-flex h-9 items-center justify-center disabled:text-muted-foreground/60"
					onClick={() => onQuantityChange(Math.max(min, quantity - 1))}
					disabled={disabled || quantity <= min}
					aria-label="Decrease quantity"
				>
					<MinusIcon aria-hidden="true" className="size-4" />
				</button>
				<output aria-live="polite" className="text-center tabular-nums">
					{quantity}
				</output>
				<button
					type="button"
					className="inline-flex h-9 items-center justify-center disabled:text-muted-foreground/60"
					onClick={() => onQuantityChange(Math.min(max, quantity + 1))}
					disabled={disabled || quantity >= max}
					aria-label="Increase quantity"
				>
					<PlusIcon aria-hidden="true" className="size-4" />
				</button>
			</div>
		</div>
	);
}
