"use client";

type QuantitySelectorProps = {
	quantity: number;
	onQuantityChange: (quantity: number) => void;
	min?: number;
	max?: number;
	disabled?: boolean;
};

const step =
	"inline-flex h-6 w-6 cursor-pointer items-center justify-center hover:underline disabled:cursor-not-allowed disabled:opacity-40";

/** Photon's options line: a fixed label column, then the controls as bare text. */
export function QuantitySelector({
	quantity,
	onQuantityChange,
	min = 1,
	max = 99,
	disabled = false,
}: QuantitySelectorProps) {
	return (
		<div className="flex items-center">
			<span className="w-20 shrink-0">Quantity</span>
			<button
				type="button"
				className={step}
				onClick={() => onQuantityChange(Math.max(min, quantity - 1))}
				disabled={disabled || quantity <= min}
				aria-label="Decrease quantity"
			>
				−
			</button>
			<span className="inline-flex h-6 min-w-6 items-center justify-center tabular-nums" aria-live="polite">
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
	);
}
