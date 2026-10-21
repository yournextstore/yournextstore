"use client";

import { MinusIcon, PlusIcon } from "@/components/mandala/icons";

type QuantitySelectorProps = {
	quantity: number;
	onQuantityChange: (quantity: number) => void;
	min?: number;
	max?: number;
	disabled?: boolean;
};

/** The original's quantity box: a bordered strip with a pale minus, the count and a dark plus. */
export function QuantitySelector({
	quantity,
	onQuantityChange,
	min = 1,
	max = 99,
	disabled = false,
}: QuantitySelectorProps) {
	return (
		<div className="flex h-12 w-fit items-stretch border border-border bg-white">
			<button
				type="button"
				className="flex w-12 items-center justify-center text-[#111827] transition-colors hover:bg-secondary disabled:text-[#d1d5db] disabled:hover:bg-transparent"
				onClick={() => onQuantityChange(Math.max(min, quantity - 1))}
				disabled={disabled || quantity <= min}
				aria-label="Decrease quantity"
			>
				<MinusIcon className="size-5" />
			</button>
			<output aria-live="polite" className="flex w-10 items-center justify-center text-base tabular-nums">
				{quantity}
			</output>
			<button
				type="button"
				className="flex w-12 items-center justify-center text-[#111827] transition-colors hover:bg-secondary disabled:text-[#d1d5db] disabled:hover:bg-transparent"
				onClick={() => onQuantityChange(Math.min(max, quantity + 1))}
				disabled={disabled || quantity >= max}
				aria-label="Increase quantity"
			>
				<PlusIcon className="size-5" />
			</button>
		</div>
	);
}
