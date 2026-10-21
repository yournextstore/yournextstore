"use client";

import { Minus, Plus } from "lucide-react";

type QuantitySelectorProps = {
	quantity: number;
	onQuantityChange: (quantity: number) => void;
	min?: number;
	max?: number;
	disabled?: boolean;
};

const step =
	"inline-flex size-8 shrink-0 items-center justify-center border border-input bg-transparent shadow-sm transition-colors hover:bg-accent disabled:pointer-events-none disabled:opacity-50";

/** The original's joined stepper: two square outline buttons around a borderless count. */
export function QuantitySelector({
	quantity,
	onQuantityChange,
	min = 1,
	max = 99,
	disabled = false,
}: QuantitySelectorProps) {
	return (
		<fieldset className="flex shrink-0 items-center">
			<legend className="sr-only">Quantity</legend>
			<button
				type="button"
				className={`${step} rounded-l-md`}
				onClick={() => onQuantityChange(Math.max(min, quantity - 1))}
				disabled={disabled || quantity <= min}
				aria-label="Decrease quantity"
			>
				<Minus aria-hidden="true" className="size-3" />
			</button>
			<output
				aria-live="polite"
				className="flex h-8 w-14 items-center justify-center border-y border-input text-sm tabular-nums shadow-sm"
			>
				{quantity}
			</output>
			<button
				type="button"
				className={`${step} rounded-r-md`}
				onClick={() => onQuantityChange(Math.min(max, quantity + 1))}
				disabled={disabled || quantity >= max}
				aria-label="Increase quantity"
			>
				<Plus aria-hidden="true" className="size-3" />
			</button>
		</fieldset>
	);
}
