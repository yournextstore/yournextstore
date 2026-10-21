"use client";

import { useId } from "react";

type QuantitySelectorProps = {
	quantity: number;
	onQuantityChange: (quantity: number) => void;
	min?: number;
	max?: number;
	disabled?: boolean;
};

/** The original's plain number field under the option selects. */
export function QuantitySelector({
	quantity,
	onQuantityChange,
	min = 1,
	max = 99,
	disabled = false,
}: QuantitySelectorProps) {
	const id = useId();
	return (
		<div>
			<label htmlFor={id} className="sr-only">
				Quantity
			</label>
			<input
				id={id}
				type="number"
				inputMode="numeric"
				min={min}
				max={max}
				value={quantity}
				disabled={disabled}
				onChange={(event) => {
					const next = Number.parseInt(event.target.value, 10);
					onQuantityChange(Number.isNaN(next) ? min : Math.min(max, Math.max(min, next)));
				}}
				className="h-10 w-full border border-black/30 bg-white indent-2 text-black/70 outline-none focus-visible:border-black disabled:opacity-50"
			/>
		</div>
	);
}
