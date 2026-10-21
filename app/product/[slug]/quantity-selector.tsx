"use client";

type QuantitySelectorProps = {
	quantity: number;
	onQuantityChange: (quantity: number) => void;
	min?: number;
	max?: number;
	disabled?: boolean;
};

/** The original purchase card's hairline − n + stepper. */
export function QuantitySelector({
	quantity,
	onQuantityChange,
	min = 1,
	max = 99,
	disabled = false,
}: QuantitySelectorProps) {
	const step =
		"px-4 py-3 text-muted-foreground transition-colors hover:bg-[var(--premium-bg)] hover:text-foreground disabled:pointer-events-none disabled:opacity-40";
	return (
		<div>
			<span className="block text-micro font-medium uppercase tracking-[0.28em] text-muted-foreground">
				Quantity
			</span>
			<div className="mt-4 inline-grid grid-cols-[auto_auto_auto] items-stretch border border-hairline-strong">
				<button
					type="button"
					className={step}
					onClick={() => onQuantityChange(Math.max(min, quantity - 1))}
					disabled={disabled || quantity <= min}
					aria-label="Decrease quantity"
				>
					−
				</button>
				<span className="flex min-w-12 items-center justify-center px-4 text-center text-sm tabular-nums text-foreground">
					{quantity}
				</span>
				<button
					type="button"
					className={step}
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
