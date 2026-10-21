"use client";

import { MinusIcon, PlusIcon } from "@/components/icons";

type QuantitySelectorProps = {
	quantity: number;
	onQuantityChange: (quantity: number) => void;
	min?: number;
	max?: number;
	disabled?: boolean;
};

/** Minus, count, plus: the cart drawer's quantity row, reused where volume pricing needs it. */
export function QuantitySelector({
	quantity,
	onQuantityChange,
	min = 1,
	max = 99,
	disabled = false,
}: QuantitySelectorProps) {
	return (
		<div className="flex items-center gap-4">
			<span className="font-semibold">Quantity</span>
			<div className="flex items-center">
				<button
					type="button"
					className="inline-flex size-6 items-center justify-center disabled:opacity-40"
					onClick={() => onQuantityChange(Math.max(min, quantity - 1))}
					disabled={disabled || quantity <= min}
					aria-label="Decrease quantity"
				>
					<MinusIcon className="size-5" />
				</button>
				<span className="w-8 text-center tabular-nums">{quantity}</span>
				<button
					type="button"
					className="inline-flex size-6 items-center justify-center disabled:opacity-40"
					onClick={() => onQuantityChange(Math.min(max, quantity + 1))}
					disabled={disabled || quantity >= max}
					aria-label="Increase quantity"
				>
					<PlusIcon className="size-5" />
				</button>
			</div>
		</div>
	);
}
