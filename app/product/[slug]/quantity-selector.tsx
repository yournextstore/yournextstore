"use client";

type QuantitySelectorProps = {
	quantity: number;
	onQuantityChange: (quantity: number) => void;
	min?: number;
	max?: number;
	disabled?: boolean;
};

const stepClass =
	"flex size-11 items-center justify-center text-lg text-foreground/70 transition-colors hover:text-foreground disabled:opacity-40";

export function QuantitySelector({
	quantity,
	onQuantityChange,
	min = 1,
	max = 99,
	disabled = false,
}: QuantitySelectorProps) {
	return (
		<fieldset className="flex shrink-0 items-center rounded-full border border-border">
			<legend className="sr-only">Quantity</legend>
			<button
				type="button"
				className={stepClass}
				onClick={() => onQuantityChange(Math.max(min, quantity - 1))}
				disabled={disabled || quantity <= min}
				aria-label="Decrease quantity"
			>
				−
			</button>
			<output
				aria-live="polite"
				className="min-w-8 text-center font-price text-sm font-semibold text-foreground"
			>
				{quantity}
			</output>
			<button
				type="button"
				className={stepClass}
				onClick={() => onQuantityChange(Math.min(max, quantity + 1))}
				disabled={disabled || quantity >= max}
				aria-label="Increase quantity"
			>
				+
			</button>
		</fieldset>
	);
}
