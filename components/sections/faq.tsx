"use client";

import { Minus, Plus } from "lucide-react";
import { useState } from "react";

const FAQS = [
	{
		q: "How quickly does it ship?",
		a: "We ship every weekday from our small Brooklyn warehouse. Most orders leave within 24 hours and arrive in 2–4 business days. International? Add a week.",
	},
	{
		q: "What's the return policy?",
		a: "Roll it for thirty days. If you don't love it, send it back — we'll cover the return shipping and refund you in full. No forms, no questions.",
	},
	{
		q: "Can I replace a wheel?",
		a: "Yes. Every part on every product is sold individually in our spare-parts shop. The wheels pop off with a 6mm hex. Replacement takes under a minute.",
	},
	{
		q: "Is the canvas actually waterproof?",
		a: "It's water-resistant — meaning it'll laugh off a downpour but won't survive a swim. The waxed coating refreshes with a wipe of beeswax once a year.",
	},
	{
		q: "Where do you make it?",
		a: "The frames are extruded in Lisbon. The canvas is cut and sewn outside Porto by a family-owned workshop we've worked with since day one. Final assembly is in Brooklyn.",
	},
	{
		q: "Do you offer gift wrapping?",
		a: "We do. Every order ships in our recycled cotton tote, tied with a brick-red ribbon. Add a hand-written note at checkout for free.",
	},
];

export function FAQ() {
	const [open, setOpen] = useState<number | null>(0);

	return (
		<section className="bg-bone text-ink">
			<div className="max-w-[820px] mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				<div className="text-center mb-12 sm:mb-14">
					<span className="inline-flex items-center gap-2 text-[11px] tracking-[0.3em] uppercase text-ink/60">
						<span className="block h-px w-8 bg-brick" />
						Questions
					</span>
					<h2 className="font-display-wide text-[clamp(2rem,5vw,3.75rem)] leading-[0.95] uppercase mt-4 text-balance">
						Frequently asked.
					</h2>
				</div>

				<div className="divide-y divide-ink/15 border-t border-b border-ink/15">
					{FAQS.map((faq, idx) => {
						const isOpen = open === idx;
						return (
							<div key={faq.q}>
								<button
									type="button"
									onClick={() => setOpen(isOpen ? null : idx)}
									className="w-full grid grid-cols-[auto_1fr_auto] items-center gap-6 py-5 text-left group"
									aria-expanded={isOpen}
								>
									<span className="text-[10px] tracking-[0.3em] uppercase text-ink/45 tabular-nums">
										{String(idx + 1).padStart(2, "0")}
									</span>
									<span className="font-display-wide text-[15px] sm:text-base tracking-[0.04em] uppercase group-hover:text-brick transition-colors">
										{faq.q}
									</span>
									<span className="inline-flex h-7 w-7 items-center justify-center border border-ink/30 text-ink">
										{isOpen ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
									</span>
								</button>
								<div
									className={`grid transition-all duration-300 ease-out ${
										isOpen ? "grid-rows-[1fr] opacity-100 pb-6" : "grid-rows-[0fr] opacity-0"
									}`}
								>
									<div className="overflow-hidden">
										<p className="text-[14px] leading-relaxed text-ink/75 max-w-prose pl-[44px]">{faq.a}</p>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
