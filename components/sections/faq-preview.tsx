import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQS = [
	{
		q: "How to place an order in an online store?",
		a: "Browse the shop, add pieces to your cart, and proceed to checkout. You'll receive a confirmation email within minutes — and a follow-up the day your order ships, with a traceable parcel number.",
	},
	{
		q: "How much does the delivery cost?",
		a: "Domestic shipping is calculated at checkout based on weight and destination. Orders over $150 ship free within the contiguous US. International rates are insured and quoted live.",
	},
	{
		q: "What are the delivery methods?",
		a: "We ship with insured ground (3–5 business days) or expedited air (1–2 business days). Each parcel is hand-packed in our studio with recycled fiber cushioning.",
	},
	{
		q: "How to use the bonus card?",
		a: "Bonus and gift cards can be redeemed during checkout — enter the code in the discount field. Balances are credited to your account and never expire.",
	},
	{
		q: "How do I find out the availability of goods in the store?",
		a: "Each product page shows live stock. For limited or pre-order pieces, we list the next firing window, so you know exactly when your piece is being made.",
	},
	{
		q: "How to exchange or return the goods?",
		a: "We accept returns within 30 days of delivery, in original packaging. Email us first; we'll arrange a prepaid label and process the refund within five business days of receipt.",
	},
];

export function FaqPreview() {
	return (
		<section id="faq" className="bg-background">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
					<div className="lg:col-span-4">
						<span className="text-[10px] tracking-[0.28em] uppercase text-[var(--mahogany)] font-medium">
							FAQ
						</span>
						<h2 className="mt-4 font-display text-4xl sm:text-5xl leading-[1.05] text-foreground">
							Everything you might ask, answered slowly.
						</h2>
						<p className="mt-5 text-[14px] leading-relaxed text-muted-foreground">
							Common questions about ordering, shipping, payments, and returns — written by the team, not a
							chatbot.
						</p>
					</div>
					<div className="lg:col-span-8">
						<Accordion type="single" collapsible className="w-full">
							{FAQS.map((item, i) => (
								<AccordionItem
									key={item.q}
									value={`faq-${i}`}
									className="border-b border-border last:border-b-0"
								>
									<AccordionTrigger className="text-left text-[15px] sm:text-base font-medium tracking-tight text-foreground py-5 hover:no-underline">
										{item.q}
									</AccordionTrigger>
									<AccordionContent className="text-[14px] leading-relaxed text-muted-foreground pb-5">
										{item.a}
									</AccordionContent>
								</AccordionItem>
							))}
						</Accordion>
					</div>
				</div>
			</div>
		</section>
	);
}
