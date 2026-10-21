"use client";

import { MinusIcon, PlusIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

type QuantitySelectorProps = {
	quantity: number;
	onQuantityChange: (quantity: number) => void;
	min?: number;
	max?: number;
	disabled?: boolean;
	className?: string;
};

/** Hairline-bordered stepper: thin minus and plus glyphs either side of the count. */
export function QuantitySelector({
	quantity,
	onQuantityChange,
	min = 1,
	max = 99,
	disabled = false,
	className,
}: QuantitySelectorProps) {
	return (
		<fieldset
			className={cn(
				"m-0 flex h-12 items-center justify-between rounded-xs border border-grayscale-200 px-6",
				className,
			)}
		>
			<legend className="sr-only">Quantity</legend>
			<button
				type="button"
				onClick={() => onQuantityChange(Math.max(min, quantity - 1))}
				disabled={disabled || quantity <= min}
				aria-label="Decrease quantity"
				className="inline-flex size-6 shrink-0 items-center justify-center transition-colors disabled:text-grayscale-200"
			>
				<MinusIcon className="size-6" />
			</button>
			<output
				aria-live="polite"
				className={cn("w-7 text-center text-body-lg", disabled && "text-grayscale-200")}
			>
				{quantity}
			</output>
			<button
				type="button"
				onClick={() => onQuantityChange(Math.min(max, quantity + 1))}
				disabled={disabled || quantity >= max}
				aria-label="Increase quantity"
				className="inline-flex size-6 shrink-0 items-center justify-center transition-colors disabled:text-grayscale-200"
			>
				<PlusIcon className="size-6" />
			</button>
		</fieldset>
	);
}
