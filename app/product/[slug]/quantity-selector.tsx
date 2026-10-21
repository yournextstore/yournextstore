"use client";

import { MinusIcon, PlusIcon } from "lucide-react";

type QuantitySelectorProps = {
	quantity: number;
	onQuantityChange: (quantity: number) => void;
	min?: number;
	max?: number;
	disabled?: boolean;
};

/** The original kit's input spinner: one bordered pill, hairlines between − value +. */
export function QuantitySelector({
	quantity,
	onQuantityChange,
	min = 1,
	max = 99,
	disabled = false,
}: QuantitySelectorProps) {
	const buttonClass =
		"flex h-9 w-9 items-center justify-center text-gray-800 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40";
	return (
		<div className="inline-flex items-center rounded-lg border border-gray-300">
			<span className="sr-only">Quantity</span>
			<button
				type="button"
				className={`${buttonClass} rounded-l-lg border-r border-gray-300`}
				onClick={() => onQuantityChange(Math.max(min, quantity - 1))}
				disabled={disabled || quantity <= min}
				aria-label="Decrease quantity"
			>
				<MinusIcon className="size-3.5" aria-hidden />
			</button>
			<span
				aria-live="polite"
				className="flex h-9 w-12 items-center justify-center text-gray-900 tabular-nums"
			>
				{quantity}
			</span>
			<button
				type="button"
				className={`${buttonClass} rounded-r-lg border-l border-gray-300`}
				onClick={() => onQuantityChange(Math.min(max, quantity + 1))}
				disabled={disabled || quantity >= max}
				aria-label="Increase quantity"
			>
				<PlusIcon className="size-3.5" aria-hidden />
			</button>
		</div>
	);
}
