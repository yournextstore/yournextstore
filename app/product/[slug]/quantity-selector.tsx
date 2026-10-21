"use client";

import { useId } from "react";
import { ChevronDownIcon } from "@/components/icons";

type QuantitySelectorProps = {
	quantity: number;
	onQuantityChange: (quantity: number) => void;
	min?: number;
	max?: number;
	disabled?: boolean;
};

/** Solace's quantity box: a 96px square select (1 to the stock cap) next to the Add to cart pill. */
export function QuantitySelector({
	quantity,
	onQuantityChange,
	min = 1,
	max = 10,
	disabled = false,
}: QuantitySelectorProps) {
	const id = useId();
	const options = Array.from({ length: Math.max(1, max - min + 1) }, (_, i) => min + i);

	return (
		<div className="relative min-w-24 shrink-0">
			<label htmlFor={id} className="sr-only">
				Quantity
			</label>
			<select
				id={id}
				value={quantity}
				disabled={disabled}
				onChange={(e) => onQuantityChange(Number(e.target.value))}
				className="h-12 w-full appearance-none border border-border bg-secondary pr-10 pl-4 text-copy outline-none focus-visible:border-foreground disabled:text-muted-foreground"
			>
				{options.map((n) => (
					<option key={n} value={n}>
						{n}
					</option>
				))}
			</select>
			<ChevronDownIcon className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2" />
		</div>
	);
}
