"use client";

import Link from "next/link";
import { useState } from "react";

/** GoCart's dismissible gradient strip: the store's own offer (free shipping), never a made-up coupon. */
export function PromoBanner({ text }: { text: string }) {
	const [open, setOpen] = useState(true);
	if (!open) return null;

	return (
		<div className="w-full bg-linear-to-r from-violet-600 via-[#9938CA] to-[#C0582F] px-6 py-1 text-sm font-medium text-white">
			<div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
				<p className="py-2 sm:py-0">{text}</p>
				<div className="flex items-center gap-6">
					<Link
						href="/products"
						className="rounded-full bg-white px-7 py-2 font-normal text-slate-800 transition hover:bg-slate-100 max-sm:hidden"
					>
						Shop now
					</Link>
					<button
						type="button"
						onClick={() => setOpen(false)}
						aria-label="Dismiss announcement"
						className="inline-flex size-8 items-center justify-center rounded-full transition hover:bg-white/15"
					>
						<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
							<rect
								y="12.532"
								width="17.498"
								height="2.1"
								rx="1.05"
								transform="rotate(-45.74 0 12.532)"
								fill="#fff"
							/>
							<rect
								x="12.533"
								y="13.915"
								width="17.498"
								height="2.1"
								rx="1.05"
								transform="rotate(-135.74 12.533 13.915)"
								fill="#fff"
							/>
						</svg>
					</button>
				</div>
			</div>
		</div>
	);
}
