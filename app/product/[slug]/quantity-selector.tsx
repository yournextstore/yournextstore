"use client";

type QuantitySelectorProps = {
	quantity: number;
	onQuantityChange: (quantity: number) => void;
	min?: number;
	max?: number;
	disabled?: boolean;
};

/** Bordered −/n/+ stepper that sits beside the add-to-cart button. */
export function QuantitySelector({
	quantity,
	onQuantityChange,
	min = 1,
	max = 99,
	disabled = false,
}: QuantitySelectorProps) {
	return (
		<div className="flex shrink-0 items-center rounded-md border border-border">
			<button
				type="button"
				className="px-3.5 py-3 text-muted-foreground transition hover:text-foreground disabled:opacity-40"
				onClick={() => onQuantityChange(Math.max(min, quantity - 1))}
				disabled={disabled || quantity <= min}
				aria-label="Decrease quantity"
			>
				−
			</button>
			<output aria-label="Quantity" className="w-8 text-center text-[15px] tabular-nums">
				{quantity}
			</output>
			<button
				type="button"
				className="px-3.5 py-3 text-muted-foreground transition hover:text-foreground disabled:opacity-40"
				onClick={() => onQuantityChange(Math.min(max, quantity + 1))}
				disabled={disabled || quantity >= max}
				aria-label="Increase quantity"
			>
				+
			</button>
		</div>
	);
}
