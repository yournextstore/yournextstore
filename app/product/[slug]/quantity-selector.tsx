"use client";

type QuantitySelectorProps = {
	quantity: number;
	onQuantityChange: (quantity: number) => void;
	min?: number;
	max?: number;
	disabled?: boolean;
};

const stepClass =
	"flex h-9 w-9 items-center justify-center rounded border border-border bg-muted text-2xl leading-none transition-colors hover:bg-rule disabled:cursor-not-allowed disabled:opacity-50 md:h-10 md:w-10 md:text-3xl";

/** Original -/+ stepper: two small muted keys around the count. */
export function QuantitySelector({
	quantity,
	onQuantityChange,
	min = 1,
	max = 99,
	disabled = false,
}: QuantitySelectorProps) {
	return (
		<fieldset className="flex items-center">
			<legend className="sr-only">Quantity</legend>
			<button
				type="button"
				className={stepClass}
				onClick={() => onQuantityChange(Math.max(min, quantity - 1))}
				disabled={disabled || quantity <= min}
				aria-label="Decrease quantity"
			>
				<span aria-hidden="true" className="-mt-1">
					-
				</span>
			</button>
			<output
				aria-live="polite"
				className="mx-2 min-w-6 text-center text-lg tabular-nums md:mx-4 md:text-2xl"
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
				<span aria-hidden="true" className="-mt-1">
					+
				</span>
			</button>
		</fieldset>
	);
}
