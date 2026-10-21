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
			<span className="mb-3 block text-sm font-semibold uppercase">Quantity</span>
			<div className="inline-flex items-center border-2 border-ink bg-background shadow-brut-sm">
				<Button
					variant="ghost"
					size="icon"
					className="h-11 w-11 rounded-none hover:bg-gainsboro"
					onClick={() => onQuantityChange(Math.max(min, quantity - 1))}
					disabled={disabled || quantity <= min}
					aria-label="Decrease quantity"
				>
					<Minus className="h-4 w-4" />
				</Button>
				<span className="flex h-11 w-14 items-center justify-center border-x-2 border-ink font-semibold tabular-nums">
					{quantity}
				</span>
				<Button
					variant="ghost"
					size="icon"
					className="h-11 w-11 rounded-none hover:bg-gainsboro"
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
