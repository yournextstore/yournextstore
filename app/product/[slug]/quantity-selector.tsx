"use client";

type QuantitySelectorProps = {
	quantity: number;
	onQuantityChange: (quantity: number) => void;
	min?: number;
	max?: number;
	disabled?: boolean;
};

function Glyph({ plus }: { plus?: boolean }) {
	return (
		<svg
			aria-hidden
			viewBox="0 0 16 16"
			className="size-4"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
		>
			<path d="M2 8h12" />
			{plus && <path d="M8 2v12" />}
		</svg>
	);
}

/** The original's .counter: a ruled pill with round − and + buttons around a tabular number. */
export function QuantitySelector({
	quantity,
	onQuantityChange,
	min = 1,
	max = 99,
	disabled = false,
}: QuantitySelectorProps) {
	const step =
		"flex size-8 cursor-pointer items-center justify-center rounded-full transition-colors duration-300 hover:bg-foreground/20 disabled:cursor-not-allowed disabled:opacity-40";
	return (
		<div className="hidden items-center rounded-full border border-border bg-background p-2 sm:inline-flex">
			<button
				type="button"
				className={step}
				onClick={() => onQuantityChange(Math.max(min, quantity - 1))}
				disabled={disabled || quantity <= min}
				aria-label="Decrease quantity"
			>
				<Glyph />
			</button>
			<output aria-label="Quantity" aria-live="polite" className="w-12 text-center text-body tabular-nums">
				{quantity}
			</output>
			<button
				type="button"
				className={step}
				onClick={() => onQuantityChange(Math.min(max, quantity + 1))}
				disabled={disabled || quantity >= max}
				aria-label="Increase quantity"
			>
				<Glyph plus />
			</button>
		</div>
	);
}
