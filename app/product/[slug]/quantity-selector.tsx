"use client";

import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type QuantitySelectorProps = {
	quantity: number;
	onQuantityChange: (quantity: number) => void;
	min?: number;
	max?: number;
	disabled?: boolean;
	size?: "sm" | "lg";
};

/** Bordered − [n] + stepper; the number is typeable and commits on blur or Enter. */
export function QuantitySelector({
	quantity,
	onQuantityChange,
	min = 1,
	max = 99,
	disabled = false,
	size = "lg",
}: QuantitySelectorProps) {
	const [draft, setDraft] = useState<string | null>(null);

	const commitDraft = () => {
		if (draft === null) return;
		setDraft(null);
		const parsed = Number.parseInt(draft, 10);
		if (Number.isNaN(parsed)) return;
		const next = Math.min(max, Math.max(min, parsed));
		if (next !== quantity) onQuantityChange(next);
	};

	const buttonSize = size === "lg" ? "icon-lg" : "icon";

	return (
		<div className="flex shrink-0 items-center rounded-lg border border-gray-300 px-0.5 focus-within:border-gray-500">
			<Button
				type="button"
				variant="ghost"
				size={buttonSize}
				className="rounded-md disabled:opacity-30"
				onClick={() => onQuantityChange(Math.max(min, quantity - 1))}
				disabled={disabled || quantity <= min}
				aria-label="Decrease quantity"
			>
				<Minus className="size-3" aria-hidden />
			</Button>
			<input
				type="text"
				inputMode="numeric"
				pattern="[0-9]*"
				autoComplete="off"
				value={draft ?? String(quantity)}
				disabled={disabled}
				aria-label="Quantity"
				className={cn(
					"bg-transparent text-center font-medium tabular-nums outline-none disabled:opacity-50",
					size === "lg" ? "w-12" : "w-9 text-sm",
				)}
				onChange={(e) => setDraft(e.target.value.replace(/\D/g, ""))}
				onFocus={(e) => e.target.select()}
				onBlur={commitDraft}
				onKeyDown={(e) => {
					if (e.key === "Enter") {
						e.preventDefault();
						e.currentTarget.blur();
					}
				}}
			/>
			<Button
				type="button"
				variant="ghost"
				size={buttonSize}
				className="rounded-md disabled:opacity-30"
				onClick={() => onQuantityChange(Math.min(max, quantity + 1))}
				disabled={disabled || quantity >= max}
				aria-label="Increase quantity"
			>
				<Plus className="size-3" aria-hidden />
			</Button>
		</div>
	);
}
