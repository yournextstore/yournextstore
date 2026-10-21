"use client";

import { Minus, Plus } from "lucide-react";

type QuantitySelectorProps = {
	quantity: number;
	onQuantityChange: (quantity: number) => void;
	min?: number;
	max?: number;
	disabled?: boolean;
};

/** Soul's number input: a squared stepper with thin minus/plus glyphs either side. */
export function QuantitySelector({
	quantity,
	onQuantityChange,
	min = 1,
	max = 99,
	disabled = false,
}: QuantitySelectorProps) {
	return (
		<fieldset className="inline-flex h-12 items-center rounded-lg border border-contrast-100 bg-background">
			<legend className="sr-only">Quantity</legend>
			<button
				type="button"
				className="flex h-full items-center rounded-l-lg px-3 text-contrast-300 transition-colors hover:bg-contrast-100 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime disabled:pointer-events-none disabled:opacity-40"
				onClick={() => onQuantityChange(Math.max(min, quantity - 1))}
				disabled={disabled || quantity <= min}
				aria-label="Decrease quantity"
			>
				<Minus className="size-4" strokeWidth={1.5} />
			</button>
			<output aria-live="polite" className="w-8 text-center text-base font-medium tabular-nums">
				{quantity}
			</output>
			<button
				type="button"
				className="flex h-full items-center rounded-r-lg px-3 text-contrast-300 transition-colors hover:bg-contrast-100 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime disabled:pointer-events-none disabled:opacity-40"
				onClick={() => onQuantityChange(Math.min(max, quantity + 1))}
				disabled={disabled || quantity >= max}
				aria-label="Increase quantity"
			>
				<Plus className="size-4" strokeWidth={1.5} />
			</button>
		</fieldset>
	);
}
