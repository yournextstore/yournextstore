import { Mail, Search, ShieldCheck } from "lucide-react";

const OFFERS = [
	{
		icon: Search,
		title: "Easy to browse",
		text: "Filter by category, compare options and find what fits in a few clicks.",
	},
	{
		icon: ShieldCheck,
		title: "Secure checkout",
		text: "Payments run through an encrypted checkout; we never see or store your card details.",
	},
	{
		icon: Mail,
		title: "Order updates",
		text: "A confirmation with your order details lands in your inbox as soon as you buy.",
	},
];

/** IncentiveLarge: a heading and lead over three bordered cards, each with a dark icon tile. */
export function Incentives({ title = "What we have to offer" }: { title?: string }) {
	return (
		<section className="container-ae py-16 sm:py-20">
			<h2 className="text-[1.875rem] font-bold sm:text-[2.25rem]">{title}</h2>
			<p className="mt-2 max-w-2xl">
				The small things that make shopping with us simple, from the first click to your order confirmation.
			</p>
			<div className="mt-10 grid gap-6 md:grid-cols-3">
				{OFFERS.map(({ icon: Icon, title: offerTitle, text }) => (
					<div key={offerTitle} className="card-ae p-5 md:p-6">
						<span className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-slate-ink text-white">
							<Icon className="h-6 w-6" aria-hidden />
						</span>
						<h3 className="mb-2 text-xl font-semibold">{offerTitle}</h3>
						<p>{text}</p>
					</div>
				))}
			</div>
		</section>
	);
}
