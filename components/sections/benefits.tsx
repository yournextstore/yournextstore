import { Headset, Package, RotateCcw, WalletCards } from "lucide-react";

const benefits = [
	{
		icon: Package,
		title: "Chosen with Care",
		description: "A short list of teas from named gardens, not an endless shelf",
	},
	{
		icon: RotateCcw,
		title: "Clear Policies",
		description: "Shipping and returns terms are set out before you pay",
	},
	{
		icon: WalletCards,
		title: "Flexible Payment",
		description: "Cards, wallets and local methods at checkout",
	},
	{ icon: Headset, title: "Here to Help", description: "Questions about a tea? Start with the FAQ" },
];

export function Benefits() {
	return (
		<section aria-label="Why shop with us" className="border-t border-border/50 bg-card py-16">
			<ul className="wrapper grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
				{benefits.map(({ icon: Icon, title, description }) => (
					<li key={title} className="group flex items-start gap-4">
						<div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-accent/15 transition-colors group-hover:bg-accent/25">
							<Icon aria-hidden="true" className="size-5 text-gold-ink" />
						</div>
						<div>
							<p className="mb-1 text-sm font-semibold text-foreground">{title}</p>
							<p className="text-xs leading-relaxed text-muted-foreground">{description}</p>
						</div>
					</li>
				))}
			</ul>
		</section>
	);
}
