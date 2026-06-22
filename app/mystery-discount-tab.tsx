"use client";

import { Gift, X } from "lucide-react";
import { useState } from "react";

export function MysteryDiscountTab() {
	const [open, setOpen] = useState(false);

	return (
		<>
			<button
				type="button"
				onClick={() => setOpen(true)}
				aria-label="Reveal mystery discount"
				className="fixed right-0 top-1/2 z-40 -translate-y-1/2 flex flex-col items-center gap-3 rounded-l-2xl border border-r-0 border-border bg-white px-2 py-4 shadow-sm transition-colors hover:bg-[color:var(--brick-cream)]"
			>
				<span className="rotate-180 [writing-mode:vertical-rl] text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground/80">
					Mystery Discount
				</span>
				<span className="block h-1 w-1 rounded-full bg-primary" />
			</button>

			{open ? (
				<div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
					<div className="relative w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
						<button
							type="button"
							onClick={() => setOpen(false)}
							aria-label="Close"
							className="absolute right-4 top-4 rounded-full p-1.5 text-foreground/60 hover:bg-secondary hover:text-foreground"
						>
							<X className="h-4 w-4" />
						</button>
						<div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--brick-cream)]">
							<Gift className="h-5 w-5 text-primary" />
						</div>
						<h3 className="font-display text-2xl font-semibold text-foreground">Unlock a mystery discount</h3>
						<p className="mt-2 text-sm text-muted-foreground">
							Drop your email and we&apos;ll send you a one-time code between 10% and 30% off your first
							order.
						</p>
						<form
							onSubmit={(e) => {
								e.preventDefault();
								setOpen(false);
							}}
							className="mt-6 flex flex-col gap-3 sm:flex-row"
						>
							<input
								type="email"
								required
								placeholder="your@email.com"
								className="h-12 flex-1 rounded-full border border-border bg-white px-5 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
							/>
							<button
								type="submit"
								className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground hover:bg-[color:var(--brick-cobalt-deep)]"
							>
								Reveal
							</button>
						</form>
					</div>
				</div>
			) : null}
		</>
	);
}
