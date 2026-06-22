"use client";

import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";

const faqs = [
	{
		q: "Do you ship internationally?",
		a: "Yes — we deliver to 38 countries via white-glove logistics partners. Lead times vary between 3–10 weeks depending on the piece and your destination.",
	},
	{
		q: "What materials do you work with?",
		a: "Solid oak, ash, walnut and cherry woods, vegetable-tanned leather, natural boucle, woven cane, and brushed brass. We avoid particleboard, MDF, and chrome-plated finishes.",
	},
	{
		q: "Can I customize upholstery and finish?",
		a: "Most of our seating can be re-upholstered in any of our 64 in-house textiles, and many woods can be specified in oiled, lacquered, or fumed finishes. Reach out for a swatch box.",
	},
	{
		q: "What is the return and warranty policy?",
		a: "Returns within 30 days for unused furniture. Every piece carries a 12-year craft warranty covering joinery and upholstery. Repairs and re-covers are free in years 1–3.",
	},
	{
		q: "Do you offer trade pricing?",
		a: "We do — interior designers, architects, and stylists get 15% off catalogue pricing, dedicated styling support, and priority lead times. Apply through our trade portal.",
	},
];

export function HomeFAQ() {
	const [open, setOpen] = useState<number | null>(0);
	return (
		<section className="bg-cream-wash">
			<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
				<div className="text-center max-w-2xl mx-auto">
					<div className="text-[11px] uppercase tracking-[0.22em] text-[#c8a57a] mb-3">— Help</div>
					<h2 className="font-display text-4xl sm:text-5xl tracking-[-0.015em] text-[#1f2933]">
						Frequently Asked Questions
					</h2>
					<p className="mt-4 text-[#1f2933]/60 leading-relaxed">
						Quick answers about shipping, materials, customization and care. Still curious? Our atelier team
						responds within a day.
					</p>
				</div>

				<div className="mt-12 divide-y divide-[#1f2933]/10 rounded-[24px] bg-white/70 backdrop-blur ring-1 ring-[#1f2933]/5 px-4 sm:px-6">
					{faqs.map((f, i) => {
						const isOpen = open === i;
						return (
							<div key={f.q} className="py-1">
								<button
									type="button"
									onClick={() => setOpen(isOpen ? null : i)}
									className="w-full flex items-center justify-between gap-6 py-5 text-left"
								>
									<span className="font-display text-lg sm:text-xl text-[#1f2933]">{f.q}</span>
									<span
										className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1f2933] text-[#f5f1ea] transition-transform duration-300 ${
											isOpen ? "rotate-180 bg-[#e89b3c] text-[#1f2933]" : ""
										}`}
									>
										<ChevronDownIcon className="h-4 w-4" />
									</span>
								</button>
								<div
									className={`grid transition-[grid-template-rows] duration-300 ${
										isOpen ? "grid-rows-[1fr] pb-6" : "grid-rows-[0fr]"
									}`}
								>
									<div className="overflow-hidden text-[#1f2933]/65 leading-relaxed max-w-3xl">{f.a}</div>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
