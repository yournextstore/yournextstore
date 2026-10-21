"use client";

type QuantitySelectorProps = {
	quantity: number;
	onQuantityChange: (quantity: number) => void;
	min?: number;
	max?: number;
	disabled?: boolean;
};

/** The original cart's boxed "- n +" stepper, beside a Quantity label. */
export function QuantitySelector({
	quantity,
	onQuantityChange,
	min = 1,
	max = 99,
	disabled = false,
}: QuantitySelectorProps) {
	return (
		<div className="flex items-center justify-between gap-4">
			<span className="text-sm text-muted-foreground">Quantity</span>
			<div className="flex h-10 w-[120px] items-center justify-between rounded-md border border-border px-1 text-sm">
				<button
					type="button"
					className="flex size-8 items-center justify-center text-muted-foreground transition-colors hover:text-ink disabled:opacity-40"
					onClick={() => onQuantityChange(Math.max(min, quantity - 1))}
					disabled={disabled || quantity <= min}
					aria-label="Decrease quantity"
				>
					-
				</button>
				<span className="tabular-nums text-ink">{quantity}</span>
				<button
					type="button"
					className="flex size-8 items-center justify-center text-muted-foreground transition-colors hover:text-ink disabled:opacity-40"
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
