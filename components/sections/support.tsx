import Link from "next/link";
import { SectionHead } from "@/components/brew/section-head";
import { getCatalog } from "@/lib/brew";

/** The original's care-plan strip, carrying what every order includes. */
export async function Support() {
	const { freeShipping } = await getCatalog();
	const plans = [
		{
			price: "Included",
			per: null,
			name: "Checkout",
			line: "Cards and wallets on one secure page, and discount codes right at the till.",
		},
		{
			price: freeShipping ? "Free" : "At checkout",
			per: freeShipping ? `over ${freeShipping}` : null,
			name: "Delivery",
			line: "Rates and options are shown at checkout, before you pay.",
		},
		{
			price: "Included",
			per: null,
			name: "Your account",
			line: "Order history, saved addresses and a one-time code instead of a password.",
		},
	];

	return (
		<section id="care" className="section-x section-y scroll-mt-16">
			<SectionHead
				eyebrow="Keep it running"
				title={
					<>
						A shop is a <em>relationship.</em>
					</>
				}
			/>
			<div className="frame grid overflow-hidden rounded-[4px] border border-line md:grid-cols-3">
				{plans.map((plan) => (
					<div
						key={plan.name}
						className="border-line p-[clamp(22px,2.6vw,32px)] not-first:border-t md:not-first:border-t-0 md:not-first:border-l"
					>
						<p className="font-readout text-[1.5rem] leading-none font-medium text-copper">
							{plan.price}
							{plan.per && <span className="ml-1.5 text-[0.86rem] font-normal text-dim">{plan.per}</span>}
						</p>
						<h3 className="mt-2.5 mb-2.5 text-[1.7rem] text-ink">{plan.name}</h3>
						<p className="max-w-[32ch] text-[0.9rem] leading-normal text-dim">{plan.line}</p>
					</div>
				))}
			</div>
			<div className="frame mt-7 flex flex-wrap gap-3.5">
				<Link href="/faq" className="btn btn-primary">
					Talk to the counter
				</Link>
				<Link href="/about" className="btn btn-ghost">
					About the shop
				</Link>
			</div>
		</section>
	);
}
