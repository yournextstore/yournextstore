"use client";

type QuantitySelectorProps = {
	quantity: number;
	onQuantityChange: (quantity: number) => void;
	min?: number;
	max?: number;
	disabled?: boolean;
};

/** The original's square stepper: "−", the count between hairlines, "+". */
export function QuantitySelector({
	quantity,
	onQuantityChange,
	min = 1,
	max = 99,
	disabled = false,
}: QuantitySelectorProps) {
	return (
		<div>
			<span className="mb-2 block font-body text-xs uppercase tracking-widest text-earth-soft">Quantity</span>
			<div className="flex w-fit items-center border border-earth/20">
				<button
					type="button"
					className="px-4 py-3 font-body text-lg leading-none text-earth transition-colors hover:text-crimson disabled:opacity-40"
					onClick={() => onQuantityChange(Math.max(min, quantity - 1))}
					disabled={disabled || quantity <= min}
					aria-label="Decrease quantity"
				>
					−
				</button>
				<span className="min-w-12 border-x border-earth/20 px-6 py-3 text-center font-body text-sm tabular-nums">
					{quantity}
				</span>
				<button
					type="button"
					className="px-4 py-3 font-body text-lg leading-none text-earth transition-colors hover:text-crimson disabled:opacity-40"
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
