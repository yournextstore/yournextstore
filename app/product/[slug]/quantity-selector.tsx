"use client";

type QuantitySelectorProps = {
	quantity: number;
	onQuantityChange: (quantity: number) => void;
	min?: number;
	max?: number;
	disabled?: boolean;
};

/** The original's bordered − 1 + stepper, sized to sit beside the bag button. */
export function QuantitySelector({
	quantity,
	onQuantityChange,
	min = 1,
	max = 99,
	disabled = false,
}: QuantitySelectorProps) {
	const step = "px-3.5 py-3 text-muted-foreground hover:text-ink disabled:opacity-40";
	return (
		<fieldset className="flex shrink-0 items-center border border-line">
			<legend className="sr-only">Quantity</legend>
			<button
				type="button"
				className={step}
				onClick={() => onQuantityChange(Math.max(min, quantity - 1))}
				disabled={disabled || quantity <= min}
				aria-label="Decrease quantity"
			>
				−
			</button>
			<output aria-live="polite" className="w-8 text-center text-body tabular-nums">
				{quantity}
			</output>
			<button
				type="button"
				className={step}
				onClick={() => onQuantityChange(Math.min(max, quantity + 1))}
				disabled={disabled || quantity >= max}
				aria-label="Increase quantity"
			>
				+
			</button>
		</fieldset>
	);
}
