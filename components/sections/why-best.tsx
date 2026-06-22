import { ClockIcon, ShieldCheckIcon, TagIcon, TruckIcon } from "lucide-react";

const features = [
	{
		icon: TagIcon,
		title: "Lowest Prices",
		text: "Guaranteed market-leading prices on every product we carry.",
	},
	{
		icon: ClockIcon,
		title: "Same Day Dispatch",
		text: "Order before 2pm and we'll ship the same business day.",
	},
	{
		icon: TruckIcon,
		title: "Doorstep Delivery",
		text: "Free, tracked delivery on every order over ninety‑nine dollars.",
	},
	{
		icon: ShieldCheckIcon,
		title: "Established 12 Years",
		text: "A trusted family of parents serving families since 2014.",
	},
];

export function WhyBest() {
	return (
		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
			<div className="max-w-xl">
				<p className="text-xs uppercase tracking-[0.25em] text-brand/60">The YNS Promise</p>
				<h2 className="mt-3 font-display text-3xl sm:text-4xl lg:text-5xl text-foreground leading-tight">
					Why we are the best
					<br />
					<span className="italic text-brand">in the market.</span>
				</h2>
				<p className="mt-4 text-muted-foreground leading-relaxed">
					Every detail — from sourcing to packaging — is held to the same standard as the things we choose for
					our own little ones.
				</p>
			</div>

			<div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
				{features.map((f) => (
					<div
						key={f.title}
						className="group relative rounded-2xl border border-border bg-card p-7 transition-all hover:border-brand/40 hover:shadow-lg hover:shadow-brand/5"
					>
						<span className="absolute -top-3 left-7 inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand text-brand-foreground shadow-md shadow-brand/30 group-hover:scale-105 transition-transform">
							<f.icon className="h-5 w-5" strokeWidth={1.75} />
						</span>
						<div className="pt-6">
							<h3 className="font-display text-xl text-foreground">{f.title}</h3>
							<p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.text}</p>
						</div>
					</div>
				))}
			</div>
		</section>
	);
}
