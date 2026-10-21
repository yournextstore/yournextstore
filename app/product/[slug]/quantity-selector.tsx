"use client";

type QuantitySelectorProps = {
	quantity: number;
	onQuantityChange: (quantity: number) => void;
	min?: number;
	max?: number;
	disabled?: boolean;
};

/** "Quantity − 1 +": a line of text like the facts above it, with 24px buttons. */
export function QuantitySelector({
	quantity,
	onQuantityChange,
	min = 1,
	max = 99,
	disabled = false,
}: QuantitySelectorProps) {
	return (
		<div className="flex items-center gap-3">
			<span>Quantity</span>
			<div className="flex items-center">
				<button
					type="button"
					className="flex size-6 items-center justify-center rounded-sm hover:bg-black/5 disabled:opacity-40"
					onClick={() => onQuantityChange(Math.max(min, quantity - 1))}
					disabled={disabled || quantity <= min}
					aria-label="Decrease quantity"
				>
					−
				</button>
				<span className="w-6 text-center tabular-nums" aria-live="polite">
					{quantity}
				</span>
				<button
					type="button"
					className="flex size-6 items-center justify-center rounded-sm hover:bg-black/5 disabled:opacity-40"
					onClick={() => onQuantityChange(Math.min(max, quantity + 1))}
					disabled={disabled || quantity >= max}
					aria-label="Increase quantity"
				>
					+
				</button>
			</div>
		</div>
	);
}
