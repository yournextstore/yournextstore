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
		<div>
			<span className="mb-4 block text-xs tracking-[0.2em] uppercase text-zinc-400">Quantity</span>
			<div className="inline-flex items-center border border-zinc-200">
				<button
					type="button"
					className="h-12 w-12 flex items-center justify-center text-zinc-400 hover:text-zinc-900 transition-colors disabled:opacity-40"
					onClick={() => onQuantityChange(Math.max(min, quantity - 1))}
					disabled={disabled || quantity <= min}
				>
					<Minus className="h-3 w-3" />
				</button>
				<span className="flex h-12 w-14 items-center justify-center text-sm text-zinc-900 font-light border-x border-zinc-200">
					{quantity}
				</span>
				<button
					type="button"
					className="h-12 w-12 flex items-center justify-center text-zinc-400 hover:text-zinc-900 transition-colors disabled:opacity-40"
					onClick={() => onQuantityChange(Math.min(max, quantity + 1))}
					disabled={disabled || quantity >= max}
				>
					<Plus className="h-3 w-3" />
				</button>
			</div>
		</div>
	);
}
