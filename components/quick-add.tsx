"use client";

import Link from "next/link";
import { type BagProduct, type BagVariant, useAddToBag } from "@/components/use-add-to-bag";

export type QuickAddOption = BagVariant & { label: string; available: boolean };

/**
 * A white glass capsule that rises over the foot of the photo while the card is pointed at:
 * one click adds the piece (or the option clicked) and opens the bag. Fixed ink, because the
 * photos are pale in both themes. Pointers that can hover only.
 */
export function QuickAdd({
	product,
	options,
	href,
}: {
	product: BagProduct;
	options: QuickAddOption[];
	href: string;
}) {
	const addToBag = useAddToBag();
	const single = options.length === 1 ? options[0] : null;
	const pill =
		"press flex h-9 min-w-10 items-center justify-center rounded-full px-3 text-[13px] font-medium text-[#111214] transition-colors hover:bg-[#111214] hover:text-[#e4e7ea] disabled:line-through disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-[#111214]";

	return (
		<div className="pointer-events-none absolute inset-x-3 bottom-3 hidden translate-y-[calc(100%+16px)] justify-center transition-transform duration-300 ease-out group-hover/piece:pointer-events-auto group-hover/piece:translate-y-0 group-has-[:focus-visible]/piece:pointer-events-auto group-has-[:focus-visible]/piece:translate-y-0 [@media(hover:hover)_and_(pointer:fine)]:flex">
			<div className="flex max-w-full items-center gap-1 overflow-hidden rounded-full bg-white/85 p-1 shadow-lift backdrop-blur-[20px]">
				{single ? (
					<button
						type="button"
						disabled={!single.available}
						onClick={() => addToBag(single, product)}
						className={pill}
					>
						{single.available ? "Add to bag" : "Sold out"}
					</button>
				) : options.length <= 4 && options.every((option) => option.label.length <= 8) ? (
					options.map((option) => (
						<button
							key={option.id}
							type="button"
							disabled={!option.available}
							aria-label={`Add ${option.label} to bag`}
							onClick={() => addToBag(option, product)}
							className={pill}
						>
							{option.label}
						</button>
					))
				) : (
					<Link href={href} className={pill}>
						Choose from {options.length}
					</Link>
				)}
			</div>
		</div>
	);
}
