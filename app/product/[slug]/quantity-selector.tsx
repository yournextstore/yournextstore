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
			<span className="eyebrow mb-3 block">Quantity</span>
			<div className="inline-flex h-12 items-center rounded-full border border-ink/25">
				<Button
					variant="ghost"
					size="icon"
					className="size-11 rounded-full hover:bg-raised hover:text-gold"
					onClick={() => onQuantityChange(Math.max(min, quantity - 1))}
					disabled={disabled || quantity <= min}
					aria-label="Decrease quantity"
				>
					<Minus className="h-4 w-4" />
				</Button>
				<span className="flex h-11 w-10 items-center justify-center text-sm tabular-nums">{quantity}</span>
				<Button
					variant="ghost"
					size="icon"
					className="size-11 rounded-full hover:bg-raised hover:text-gold"
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
