"use client";

import { MinusIcon, PlusIcon } from "lucide-react";

type QuantitySelectorProps = {
	quantity: number;
	onQuantityChange: (quantity: number) => void;
	min?: number;
	max?: number;
	disabled?: boolean;
};

/** UIkit quantity: borderless − / + icon buttons around a small white number box. */
export function QuantitySelector({
	quantity,
	onQuantityChange,
	min = 1,
	max = 99,
	disabled = false,
}: QuantitySelectorProps) {
	return (
		<div className="flex items-center">
			<button
				type="button"
				className="flex size-10 items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-40"
				onClick={() => onQuantityChange(Math.max(min, quantity - 1))}
				disabled={disabled || quantity <= min}
				aria-label="Decrease quantity"
			>
				<MinusIcon aria-hidden className="size-4" strokeWidth={1.25} />
			</button>
			<output
				aria-label="Quantity"
				className="flex h-10 w-[60px] items-center justify-center rounded-[4px] border border-border bg-card text-uk-md text-foreground"
			>
				{quantity}
			</output>
			<button
				type="button"
				className="flex size-10 items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-40"
				onClick={() => onQuantityChange(Math.min(max, quantity + 1))}
				disabled={disabled || quantity >= max}
				aria-label="Increase quantity"
			>
				<PlusIcon aria-hidden className="size-4" strokeWidth={1.25} />
			</button>
		</div>
	);
}
