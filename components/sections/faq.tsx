"use client";

import { Minus, Plus } from "lucide-react";
import { useState } from "react";

const FAQS = [
	{
		q: "How big are the bottles?",
		a: "Each Your Next Store bottle holds 480ml — perfectly sized for daily commutes, gym sessions, or a long workday. The flat profile slides into any tote or laptop sleeve without rolling around.",
	},
	{
		q: "Are they leakproof?",
		a: "Yes. Every bottle is pressure-tested with a double-thread cap and silicone gasket to keep your bag dry — even when tossed sideways. Hot drinks not recommended.",
	},
	{
		q: "How do bundle discounts work?",
		a: "Add 2 bottles for 15% off, 3 bottles for 22% off, or 4+ bottles for 30% off — discounts apply automatically at checkout. Mix any colors, no codes required.",
	},
	{
		q: "What's the material?",
		a: "BPA-free Tritan plastic — lightweight, crystal-clear, and dishwasher-safe on the top rack. The wrist strap is genuine vegetable-tanned leather that softens beautifully over time.",
	},
	{
		q: "How does shipping work?",
		a: "Free standard shipping on every bundle. Single bottles ship for £4 within the UK and £12 worldwide. Orders typically arrive within 3–5 business days.",
	},
	{
		q: "What's your return policy?",
		a: "Try Your Next Store for 30 days. If it's not for you, return it for a full refund — we'll even cover return shipping on your first order.",
	},
];

export function FAQ() {
	const [open, setOpen] = useState<number | null>(0);

	return (
		<section id="faq" className="bg-lavender-wash py-20 sm:py-28">
			<div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-10">
				<div className="grid lg:grid-cols-[1fr_1.6fr] gap-10 lg:gap-16">
					<div>
						<span className="inline-block px-3 py-1 rounded-full bg-white/70 text-[#5e3ca8] text-[11px] font-semibold uppercase tracking-[0.18em]">
							Got Questions?
						</span>
						<h2 className="mt-4 font-display text-[44px] sm:text-[56px] leading-[1] tracking-[-0.025em] text-[#14111c]">
							The <span className="italic text-[#5e3ca8]">small print,</span>
							<br /> answered.
						</h2>
						<p className="mt-4 text-[15px] text-[#14111c]/70">
							Still curious? Drop us a line and we&rsquo;ll get back within a day.
						</p>
						<a
							href="mailto:hello@yournextstore.com"
							className="mt-6 inline-flex items-center gap-2 h-11 px-6 rounded-full bg-[#14111c] text-white text-[14px] font-semibold hover:bg-[#5e3ca8] transition-colors"
						>
							hello@yournextstore.com
						</a>
					</div>

					<div className="space-y-3">
						{FAQS.map((item, i) => {
							const isOpen = open === i;
							return (
								<div
									key={item.q}
									className={`rounded-2xl border transition-all ${
										isOpen
											? "bg-white border-white shadow-[0_20px_50px_-30px_rgba(94,60,168,0.4)]"
											: "bg-white/55 border-white/70"
									}`}
								>
									<button
										type="button"
										onClick={() => setOpen(isOpen ? null : i)}
										className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
									>
										<span className="font-display text-[18px] text-[#14111c]">{item.q}</span>
										<span
											className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors ${
												isOpen ? "bg-[#5e3ca8] text-white" : "bg-[#e4daf5] text-[#5e3ca8]"
											}`}
										>
											{isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
										</span>
									</button>
									<div
										className={`grid transition-all ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
									>
										<div className="overflow-hidden">
											<p className="px-6 pb-6 text-[14.5px] leading-relaxed text-[#14111c]/70">{item.a}</p>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</section>
	);
}
