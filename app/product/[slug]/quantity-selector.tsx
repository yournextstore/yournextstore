"use client";

type QuantitySelectorProps = {
	quantity: number;
	onQuantityChange: (quantity: number) => void;
	min?: number;
	max?: number;
	disabled?: boolean;
};

export function QuantitySelector({
	quantity,
	onQuantityChange,
	min = 1,
	max = 99,
	disabled = false,
}: QuantitySelectorProps) {
	return (
		<div className="flex flex-col gap-2">
			<span>Quantity</span>
			<div className="flex w-44 border-2 border-border py-3">
				<button
					type="button"
					className="h-full w-20 cursor-pointer font-semibold text-2xl disabled:cursor-not-allowed disabled:opacity-40"
					onClick={() => onQuantityChange(Math.max(min, quantity - 1))}
					disabled={disabled || quantity <= min}
					aria-label="Decrease quantity"
				>
					-
				</button>
				<span className="flex w-full items-center justify-center text-xl tabular-nums" aria-live="polite">
					{quantity}
				</span>
				<button
					type="button"
					className="h-full w-20 cursor-pointer font-semibold text-2xl disabled:cursor-not-allowed disabled:opacity-40"
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
