"use client";

type QuantitySelectorProps = {
	quantity: number;
	onQuantityChange: (quantity: number) => void;
	min?: number;
	max?: number;
	disabled?: boolean;
	hideLabel?: boolean;
};

const STEP =
	"flex h-10 w-10 cursor-pointer items-center justify-center border border-border text-lg transition-colors hover:bg-[#111] hover:text-white disabled:pointer-events-none disabled:opacity-40 md:h-8 md:w-8 md:text-sm";

/** The original's picker: QUANTITY label, then "+", the count and "−" in hairline boxes. */
export function QuantitySelector({
	quantity,
	onQuantityChange,
	min = 1,
	max = 99,
	disabled = false,
	hideLabel = false,
}: QuantitySelectorProps) {
	return (
		<div className="flex items-center">
			{!hideLabel && <span className="px-2 text-xs tracking-wide">QUANTITY</span>}
			<button
				type="button"
				className={STEP}
				onClick={() => onQuantityChange(Math.min(max, quantity + 1))}
				disabled={disabled || quantity >= max}
				aria-label="Increase quantity"
			>
				+
			</button>
			<span
				aria-live="polite"
				className="flex h-10 w-10 items-center justify-center border-y border-border text-base tabular-nums md:h-8 md:w-8 md:text-xs"
			>
				{quantity}
			</span>
			<button
				type="button"
				className={STEP}
				onClick={() => onQuantityChange(Math.max(min, quantity - 1))}
				disabled={disabled || quantity <= min}
				aria-label="Decrease quantity"
			>
				−
			</button>
		</div>
	);
}
