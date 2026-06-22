import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const HOME_FAQ = [
	{
		q: "My granola tastes stale. What do I do?",
		a: "We're sorry your bag didn't show up at its best. Reach out with your order number and we'll send a fresh replacement on us. Granola peaks within 8 weeks of the roast date stamped on the back.",
	},
	{
		q: "What is the return policy?",
		a: "Snacks are perishable, so we don't accept opened returns. If anything arrives damaged or off, message us within 14 days and we'll make it right with a replacement or refund.",
	},
	{
		q: "Is YNS granola gluten free?",
		a: "Yes. All of our granolas are made with certified gluten-free oats and packed in a facility that processes only gluten-free goods. We test every production run.",
	},
	{
		q: "When will I get my order?",
		a: "We ship from our kitchen on Tuesdays and Thursdays. Orders typically arrive in 2–5 business days within the U.S. via USPS Ground or UPS, with tracking emailed once it leaves the door.",
	},
	{
		q: "Where are your products produced?",
		a: "Everything is made by hand in our small-batch kitchen in the Hudson Valley using whole, organic ingredients sourced from family farms whenever possible.",
	},
];

export function HomeFAQ() {
	return (
		<section id="story" className="relative scroll-mt-24 border-b border-[#E5D3B7] bg-[#FAF2E6]">
			<div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
				<div className="mb-10 flex flex-col items-start gap-4 sm:mb-12">
					<span className="inline-flex items-center gap-2 rounded-full border border-[#8C1F2A]/20 bg-[#8C1F2A]/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#8C1F2A]">
						<span aria-hidden="true">✿</span> Good to know
					</span>
					<h2 className="font-display text-3xl font-black uppercase tracking-tight text-[#2A2A2A] sm:text-4xl lg:text-5xl">
						Frequently Asked Questions
					</h2>
				</div>

				<Accordion type="single" collapsible className="divide-y divide-[#E5D3B7] border-y border-[#E5D3B7]">
					{HOME_FAQ.map((item, i) => (
						<AccordionItem key={`home-faq-${i}`} value={`home-faq-${i}`} className="border-b-0">
							<AccordionTrigger className="py-5 text-left text-[13px] font-bold uppercase tracking-[0.16em] text-[#2A2A2A] hover:text-[#8C1F2A] sm:text-sm">
								{item.q}
							</AccordionTrigger>
							<AccordionContent>
								<p className="max-w-2xl pb-2 text-[15px] leading-relaxed text-[#5a4a3a]">{item.a}</p>
							</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>
			</div>
		</section>
	);
}
