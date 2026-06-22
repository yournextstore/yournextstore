"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

const faqs = [
	{
		q: "Does the tag need batteries or charging?",
		a: "No. The tag is fully passive — it works using NFC, the same wireless standard your phone uses for tap-to-pay. It will outlive any battery.",
	},
	{
		q: "Is there a monthly subscription?",
		a: "There is no subscription. You buy the tag once, pair it with the free companion app, and that's the deal. Forever.",
	},
	{
		q: "Which phones does it work with?",
		a: "Every iPhone since the iPhone 7 (2016) and every modern Android phone with NFC. If your phone can tap-to-pay, your phone can tap-to-focus.",
	},
	{
		q: "Will it physically lock my apps?",
		a: "It pauses the apps you choose, on your terms. You set the duration, the list, and the rules. Tap again to end the session at any time.",
	},
	{
		q: "What's your return policy?",
		a: "Try it for 30 nights. If it doesn't earn its place on your nightstand, send it back for a full refund.",
	},
];

export function FaqAccordion() {
	const [open, setOpen] = useState<number | null>(0);

	return (
		<section className="relative bg-background py-20 sm:py-28">
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-12">
					<p className="text-xs uppercase tracking-[0.22em] text-ember/90 font-medium">Frequently asked</p>
					<h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold tracking-tight text-bone text-balance">
						The questions everyone asks first.
					</h2>
				</div>

				<dl className="divide-y divide-border border-y border-border">
					{faqs.map(({ q, a }, i) => {
						const isOpen = open === i;
						return (
							<div key={q} className="py-2">
								<dt>
									<button
										type="button"
										onClick={() => setOpen(isOpen ? null : i)}
										aria-expanded={isOpen}
										className="w-full flex items-center justify-between text-left py-5 group"
									>
										<span className="font-display text-lg sm:text-xl text-bone group-hover:text-ember transition-colors">
											{q}
										</span>
										<Plus
											className={`h-5 w-5 text-bone/60 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-45 text-ember" : ""}`}
										/>
									</button>
								</dt>
								<dd
									className={`grid transition-all duration-300 ease-out ${isOpen ? "grid-rows-[1fr] opacity-100 pb-6" : "grid-rows-[0fr] opacity-0"}`}
								>
									<div className="overflow-hidden">
										<p className="text-[15px] leading-relaxed text-muted-foreground max-w-2xl">{a}</p>
									</div>
								</dd>
							</div>
						);
					})}
				</dl>
			</div>
		</section>
	);
}
