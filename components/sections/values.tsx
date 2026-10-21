import { CartIcon, LayersIcon, ReturnIcon } from "@/components/njx/icons";

const VALUES = [
	{
		icon: LayersIcon,
		title: "A short list",
		text: "Fewer things for the bench and the desk, each one picked for how it works and lasts.",
	},
	{
		icon: CartIcon,
		title: "Clear before you pay",
		text: "Delivery options and costs are shown at checkout, before you place your order.",
	},
	{
		icon: ReturnIcon,
		title: "Policies up front",
		text: "Shipping and return terms live on our policy pages, linked at the bottom of every page.",
	},
];

export function Values() {
	return (
		<section className="mx-auto max-w-6xl px-5 pb-4 sm:pb-8">
			<div className="grid gap-6 rounded-2xl border border-line bg-tile/60 p-5 sm:grid-cols-3 sm:gap-8 sm:p-10">
				{VALUES.map((value) => (
					<div key={value.title}>
						<span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-pine-soft text-pine-ink">
							<value.icon />
						</span>
						<h3 className="mt-4 text-[16px] font-semibold">{value.title}</h3>
						<p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">{value.text}</p>
					</div>
				))}
			</div>
		</section>
	);
}
