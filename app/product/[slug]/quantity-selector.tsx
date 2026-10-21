"use client";

import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

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
			<span className="font-readout mb-3 block text-[0.74rem] tracking-[0.1em] text-faint uppercase">
				Quantity
			</span>
			<div className="inline-flex items-center rounded-[4px] border border-line bg-panel">
				<Button
					variant="ghost"
					size="icon"
					className="h-10 w-10 rounded-r-none"
					onClick={() => onQuantityChange(Math.max(min, quantity - 1))}
					disabled={disabled || quantity <= min}
					aria-label="Decrease quantity"
				>
					<Minus className="h-4 w-4" />
				</Button>
				<span className="font-readout flex h-10 w-14 items-center justify-center text-sm font-medium tabular-nums">
					{quantity}
				</span>
				<Button
					variant="ghost"
					size="icon"
					className="h-10 w-10 rounded-l-none"
					onClick={() => onQuantityChange(Math.min(max, quantity + 1))}
					disabled={disabled || quantity >= max}
					aria-label="Increase quantity"
				>
					<Plus className="h-4 w-4" />
				</Button>
			</div>
		</div>
	);
}
