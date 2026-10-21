"use client";

import { useId, useState } from "react";
import { Input } from "@/components/ui/input";

type QuantitySelectorProps = {
	quantity: number;
	onQuantityChange: (quantity: number) => void;
	min?: number;
	max?: number;
	disabled?: boolean;
};

/** "Quantity" label over a narrow number field; out-of-range values snap back on blur. */
export function QuantitySelector({
	quantity,
	onQuantityChange,
	min = 1,
	max = 99,
	disabled = false,
}: QuantitySelectorProps) {
	const id = useId();
	const [draft, setDraft] = useState<string | null>(null);

	return (
		<div className="flex flex-col items-start gap-1">
			<label htmlFor={id} className="text-sm font-medium leading-none">
				Quantity
			</label>
			<Input
				id={id}
				type="number"
				inputMode="numeric"
				min={min}
				max={max}
				disabled={disabled}
				value={draft ?? String(quantity)}
				onChange={(e) => {
					setDraft(e.target.value);
					const next = Number(e.target.value);
					if (Number.isInteger(next) && next >= min && next <= max) onQuantityChange(next);
				}}
				onBlur={() => setDraft(null)}
				className="h-10 w-24"
			/>
		</div>
	);
}
