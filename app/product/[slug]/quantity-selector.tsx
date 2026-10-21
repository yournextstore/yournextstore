"use client";

import { Minus, Plus } from "lucide-react";

type QuantitySelectorProps = {
	quantity: number;
	onQuantityChange: (quantity: number) => void;
	min?: number;
	max?: number;
	disabled?: boolean;
};

/** How many, in a pill: fewer, the number, more. */
export function QuantitySelector({
	quantity,
	onQuantityChange,
	min = 1,
	max = 99,
	disabled = false,
}: QuantitySelectorProps) {
	return (
		<fieldset className="m-0 flex min-w-0 items-center justify-between gap-4 border-0 p-0 text-sm">
			<legend className="float-left font-semibold">Quantity</legend>
			<div className="inline-grid grid-cols-[2.5rem_minmax(2rem,auto)_2.5rem] items-center rounded-full border border-strong">
				<button
					type="button"
					className="grid h-10 place-items-center rounded-full transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:text-faint disabled:hover:bg-transparent"
					onClick={() => onQuantityChange(Math.max(min, quantity - 1))}
					disabled={disabled || quantity <= min}
					aria-label="Decrease quantity"
				>
					<Minus aria-hidden="true" className="size-4" />
				</button>
				<output aria-live="polite" className="text-center text-base font-semibold tabular-nums">
					{quantity}
				</output>
				<button
					type="button"
					className="grid h-10 place-items-center rounded-full transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:text-faint disabled:hover:bg-transparent"
					onClick={() => onQuantityChange(Math.min(max, quantity + 1))}
					disabled={disabled || quantity >= max}
					aria-label="Increase quantity"
				>
					<Plus aria-hidden="true" className="size-4" />
				</button>
			</div>
		</fieldset>
	);
}
