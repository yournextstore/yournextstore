import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQS = [
	{
		q: "Is it actually soda or one of those weird hop waters?",
		a: "Real-deal soda. Carbonated water, real fruit, cane sugar (less of it), and a couple of natural flavors. No hops, no kombucha cultures, no judgment.",
	},
	{
		q: "How much sugar are we talking?",
		a: "9 grams per can. About a third of what big-soda cans hit you with — enough to taste like soda, not enough to wreck your afternoon.",
	},
	{
		q: "When does my order ship?",
		a: "Same-day if you order before 2pm EST, Mon–Fri. Otherwise the next business morning. Free shipping kicks in at $75.",
	},
	{
		q: "Can I cancel my subscription?",
		a: "Anytime, no friction. Manage everything from the account page — skip a month, swap flavors, pause indefinitely, or fully cancel in two clicks.",
	},
	{
		q: "Do you ship to my state?",
		a: "All 50 of them, plus territories. International is coming — sign up for the newsletter and we'll holler.",
	},
];

export function FaqYellow() {
	return (
		<section className="bg-[var(--tizz-yellow)] tizz-stripes border-y-4 border-[var(--tizz-deep)]">
			<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				<div className="text-center mb-12">
					<p className="tizz-overline text-[var(--tizz-orange)] text-xs mb-4">FAQ</p>
					<h2 className="tizz-display text-[var(--tizz-deep)] text-5xl sm:text-7xl">
						Got questions?
						<br />
						<span className="text-[var(--tizz-orange)]">We got fizz.</span>
					</h2>
				</div>

				<Accordion type="single" collapsible className="w-full">
					{FAQS.map((faq, i) => (
						<AccordionItem
							key={faq.q}
							value={`item-${i}`}
							className="border-b-2 border-[var(--tizz-deep)]/30 last:border-b-2 py-1"
						>
							<AccordionTrigger className="tizz-display text-[var(--tizz-deep)] text-xl sm:text-2xl text-left hover:no-underline py-5 hover:text-[var(--tizz-orange)] transition-colors [&>svg]:!h-7 [&>svg]:!w-7 [&>svg]:!text-[var(--tizz-orange)] [&>svg]:!stroke-[3]">
								{faq.q}
							</AccordionTrigger>
							<AccordionContent className="text-[var(--tizz-deep)]/80 text-base leading-relaxed pb-5 max-w-2xl">
								{faq.a}
							</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>
			</div>
		</section>
	);
}
