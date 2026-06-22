import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const items = [
	{
		q: "How is this 30g of protein in a single pint?",
		a: "Whey isolate blended with micellar casein. We use a slow-incorporation churn so the protein stays creamy instead of gritty — the texture is what most other 'protein ice cream' brands get wrong.",
	},
	{
		q: "What sweeteners do you use?",
		a: "A blend of allulose and monk fruit. No sucralose, no maltitol, no high-fructose corn syrup, no 'natural flavors' hiding the rest of the bill. The label has six to nine ingredients depending on flavor.",
	},
	{
		q: "How does shipping work?",
		a: "We ship Monday through Wednesday in insulated boxes with dry ice. Most addresses arrive in 2 business days. Pints stay fully frozen on the doorstep up to 36 hours after delivery.",
	},
	{
		q: "Can I pause or cancel my subscription?",
		a: "Yes — anytime, from your account page, in two clicks. No emails to send, no retention scripts, no guilt. Skip a month, swap a flavor, or quit altogether.",
	},
	{
		q: "Where do you ship?",
		a: "Currently AZ, CA, CO, ID, NM, NV, OR, UT and WA. We're adding new states every quarter — drop your email below and we'll tell you the second yours unlocks.",
	},
	{
		q: "Is it actually good or is this another protein lie?",
		a: "We send out a free single-pint sampler to anyone who asks in the first 30 days and doesn't love it. We're not going to convince you in a FAQ — try it.",
	},
];

export function FAQ() {
	return (
		<section className="bg-black text-white border-t border-white/10">
			<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				<div className="grid lg:grid-cols-[1fr_2fr] gap-10 lg:gap-16">
					<div>
						<div className="font-display uppercase tracking-[0.2em] text-xs text-[var(--yns-cyan)]">
							The Fine Print
						</div>
						<h2 className="mt-3 font-display uppercase text-4xl sm:text-5xl leading-[0.95]">
							Questions
							<br />
							you might
							<br />
							be having.
						</h2>
						<p className="mt-6 text-white/60">
							Still curious? Email us at <span className="text-white">hello@yournextstore.com</span> — a real
							person answers within a day.
						</p>
					</div>

					<Accordion
						type="single"
						collapsible
						className="w-full divide-y divide-white/10 border-y border-white/10"
					>
						{items.map((item, i) => (
							<AccordionItem key={item.q} value={`item-${i}`} className="border-0 px-1">
								<AccordionTrigger className="py-6 text-left font-display uppercase text-base sm:text-lg tracking-wide hover:text-[var(--yns-cyan)] hover:no-underline">
									{item.q}
								</AccordionTrigger>
								<AccordionContent className="pb-6 text-white/70 leading-relaxed text-base">
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
