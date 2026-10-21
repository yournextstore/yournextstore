"use client";

import { Minus, Plus } from "lucide-react";

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
		<div className="flex flex-col gap-3">
			<span className="text-lg font-semibold text-slate-800">Quantity</span>
			<div className="inline-flex items-center gap-1 rounded border border-slate-200 px-3 py-1 text-slate-600 sm:gap-3">
				<button
					type="button"
					className="flex size-8 items-center justify-center rounded transition hover:bg-slate-100 disabled:opacity-40"
					onClick={() => onQuantityChange(Math.max(min, quantity - 1))}
					disabled={disabled || quantity <= min}
					aria-label="Decrease quantity"
				>
					<Minus className="size-4" aria-hidden />
				</button>
				<span className="min-w-6 text-center tabular-nums" aria-live="polite">
					{quantity}
				</span>
				<button
					type="button"
					className="flex size-8 items-center justify-center rounded transition hover:bg-slate-100 disabled:opacity-40"
					onClick={() => onQuantityChange(Math.min(max, quantity + 1))}
					disabled={disabled || quantity >= max}
					aria-label="Increase quantity"
				>
					<Plus className="size-4" aria-hidden />
				</button>
			</div>
		</div>
	);
}
