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
		<div className="flex items-center">
			<span className="sr-only">Quantity</span>
			<Button
				type="button"
				variant="outline"
				size="icon-sm"
				className="size-8 shrink-0 rounded-r-none"
				onClick={() => onQuantityChange(Math.max(min, quantity - 1))}
				disabled={disabled || quantity <= min}
				aria-label="Remove one item"
			>
				<Minus className="size-3" aria-hidden="true" />
			</Button>
			<output
				aria-live="polite"
				aria-label="Quantity"
				className="flex h-8 w-16 items-center border-y border-input bg-transparent px-3 text-sm shadow-xs dark:bg-input/30"
			>
				{quantity}
			</output>
			<Button
				type="button"
				variant="outline"
				size="icon-sm"
				className="size-8 shrink-0 rounded-l-none"
				onClick={() => onQuantityChange(Math.min(max, quantity + 1))}
				disabled={disabled || quantity >= max}
				aria-label="Add one item"
			>
				<Plus className="size-3" aria-hidden="true" />
			</Button>
		</div>
	);
}
