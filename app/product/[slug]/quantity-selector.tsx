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
			<span className="mb-3 block font-serif text-heading-xl font-bold text-brand">Quantity</span>
			<div className="inline-flex items-center rounded-md border border-line bg-surface">
				<Button
					variant="ghost"
					size="icon"
					className="h-12 w-12 rounded-r-none hover:bg-line-soft"
					onClick={() => onQuantityChange(Math.max(min, quantity - 1))}
					disabled={disabled || quantity <= min}
					aria-label="Decrease quantity"
				>
					<Minus className="h-4 w-4" />
				</Button>
				<span className="flex h-12 w-14 items-center justify-center font-serif text-body-lg tabular-nums">
					{quantity}
				</span>
				<Button
					variant="ghost"
					size="icon"
					className="h-12 w-12 rounded-l-none hover:bg-line-soft"
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
