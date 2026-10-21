"use client";

type QuantitySelectorProps = {
	quantity: number;
	onQuantityChange: (quantity: number) => void;
	min?: number;
	max?: number;
	disabled?: boolean;
};

/** The original's bag stepper: "Quantity:" with two small outlined squares. */
export function QuantitySelector({
	quantity,
	onQuantityChange,
	min = 1,
	max = 99,
	disabled = false,
}: QuantitySelectorProps) {
	return (
		<div className="inline-flex items-center">
			<span className="pr-2">Quantity:</span>
			<button
				type="button"
				className="inline-flex h-6 w-6 items-center justify-center rounded-lg border border-ink text-xs transition hover:bg-ink hover:text-ecru disabled:opacity-40"
				onClick={() => onQuantityChange(Math.max(min, quantity - 1))}
				disabled={disabled || quantity <= min}
				aria-label="Decrease quantity"
			>
				-
			</button>
			<span className="min-w-8 px-2 text-center tabular-nums md:text-lg">{quantity}</span>
			<button
				type="button"
				className="inline-flex h-6 w-6 items-center justify-center rounded-lg border border-ink text-xs transition hover:bg-ink hover:text-ecru disabled:opacity-40"
				onClick={() => onQuantityChange(Math.min(max, quantity + 1))}
				disabled={disabled || quantity >= max}
				aria-label="Increase quantity"
			>
				+
			</button>
		</div>
	);
}
