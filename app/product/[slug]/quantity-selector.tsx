"use client";

import { MinusIcon, PlusIcon } from "lucide-react";

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
		<div>
			<span className="mb-2.5 block text-body-sm font-medium">Quantity</span>
			<div className="inline-flex h-10 items-center rounded-md border border-line">
				<button
					type="button"
					className="inline-flex size-10 items-center justify-center disabled:opacity-40"
					onClick={() => onQuantityChange(Math.max(min, quantity - 1))}
					disabled={disabled || quantity <= min}
					aria-label="Decrease quantity"
				>
					<MinusIcon aria-hidden className="size-4" strokeWidth={1.5} />
				</button>
				<span className="flex w-8 items-center justify-center text-body-sm tabular-nums" aria-live="polite">
					{quantity}
				</span>
				<button
					type="button"
					className="inline-flex size-10 items-center justify-center disabled:opacity-40"
					onClick={() => onQuantityChange(Math.min(max, quantity + 1))}
					disabled={disabled || quantity >= max}
					aria-label="Increase quantity"
				>
					<PlusIcon aria-hidden className="size-4" strokeWidth={1.5} />
				</button>
			</div>
		</div>
	);
}
