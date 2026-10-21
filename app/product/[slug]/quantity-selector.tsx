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
		<fieldset className="-mt-px m-0 border-y border-black p-0 py-1.5 text-t14 uppercase">
			<legend className="float-left mr-6 py-1">Qty</legend>
			<div className="flex items-center">
				<button
					type="button"
					className="flex h-7 w-7 cursor-pointer items-center justify-center hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
					onClick={() => onQuantityChange(Math.max(min, quantity - 1))}
					disabled={disabled || quantity <= min}
					aria-label="Decrease quantity"
				>
					<Minus className="h-3.5 w-3.5" aria-hidden />
				</button>
				<span className="flex h-7 w-8 items-center justify-center tabular-nums" aria-live="polite">
					{quantity}
				</span>
				<button
					type="button"
					className="flex h-7 w-7 cursor-pointer items-center justify-center hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
					onClick={() => onQuantityChange(Math.min(max, quantity + 1))}
					disabled={disabled || quantity >= max}
					aria-label="Increase quantity"
				>
					<Plus className="h-3.5 w-3.5" aria-hidden />
				</button>
			</div>
		</fieldset>
	);
}
