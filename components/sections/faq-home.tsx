import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const items = [
	{
		q: "Do you offer a warranty on your furniture?",
		a: "Every Your Next Store frame is covered by a 10-year structural warranty. Upholstery, cushions and finishes are covered for two years against material defects from the date of delivery.",
	},
	{
		q: "Are there ongoing discounts or promotions in your shop?",
		a: "We don't run sale cycles. Instead, registered members receive private access to small-batch trade-ins, archive pieces and prototype releases throughout the year.",
	},
	{
		q: "How long does it take to pay or pick up your furniture?",
		a: "Our made-to-order pieces ship within 6–8 weeks. Once your order arrives in your country, our white-glove partners coordinate a delivery window that suits you.",
	},
	{
		q: "How do I care for the furniture in my home?",
		a: "Each shipment includes a printed care guide tailored to your chosen material. In short: brush wool weekly, condition leather quarterly, oil oak twice a year — and let the patina happen.",
	},
];

export function FAQHome() {
	return (
		<section className="bg-background border-t hairline">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				<div className="grid lg:grid-cols-[1fr_1.4fr] gap-12 lg:gap-20 items-start">
					<div className="lg:sticky lg:top-28">
						<p className="eyebrow text-[var(--clay)] mb-4">In conversation</p>
						<h2 className="font-display text-4xl sm:text-5xl tracking-tight text-foreground leading-[1.05]">
							Frequently asked questions.
						</h2>
						<p className="mt-5 text-foreground/60 max-w-sm leading-relaxed">
							The most common things our customers ask before settling into something new. Looking for
							something specific? Write to us — we read every note.
						</p>
						<div className="mt-8 flex items-center gap-3 text-sm tracking-wide">
							<span className="font-display italic text-foreground">Marlene</span>
							<span className="text-foreground/40">·</span>
							<span className="text-foreground/60">Studio concierge</span>
						</div>
					</div>
					<Accordion type="single" collapsible className="w-full border-t hairline">
						{items.map((item, i) => (
							<AccordionItem
								key={item.q}
								value={`item-${i}`}
								className="border-b hairline data-[state=open]:bg-[var(--cream)]/40"
							>
								<AccordionTrigger className="py-6 text-left font-display text-lg sm:text-xl text-foreground hover:no-underline">
									<span className="flex items-baseline gap-5">
										<span className="text-xs tracking-[0.2em] text-foreground/35">0{i + 1}</span>
										{item.q}
									</span>
								</AccordionTrigger>
								<AccordionContent className="pb-6 pl-10 max-w-2xl text-foreground/65 leading-relaxed">
									{item.a}
								</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
				</div>
			</div>
		</section>
	);
}
