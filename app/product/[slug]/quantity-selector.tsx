"use client";

type QuantitySelectorProps = {
	quantity: number;
	onQuantityChange: (quantity: number) => void;
	min?: number;
	max?: number;
	disabled?: boolean;
};

/** The original cart's "− 1 +" in plain type, reused on the product page. */
export function QuantitySelector({
	quantity,
	onQuantityChange,
	min = 1,
	max = 99,
	disabled = false,
}: QuantitySelectorProps) {
	return (
		<div className="flex items-center gap-4 text-copy">
			<span className="text-muted-foreground">Quantity</span>
			<div className="inline-flex items-center">
				<button
					type="button"
					className="flex size-8 items-center justify-center disabled:text-muted-foreground"
					onClick={() => onQuantityChange(Math.max(min, quantity - 1))}
					disabled={disabled || quantity <= min}
					aria-label="Decrease quantity"
				>
					−
				</button>
				<span className="w-8 text-center tabular-nums" aria-live="polite">
					{quantity}
				</span>
				<button
					type="button"
					className="flex size-8 items-center justify-center disabled:text-muted-foreground"
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
