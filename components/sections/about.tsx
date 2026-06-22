import { CompassIcon, HeartHandshakeIcon, LeafIcon, PackageCheckIcon } from "lucide-react";

const features = [
	{
		icon: PackageCheckIcon,
		title: "Made to last",
		body: "Materials and makers we'd vouch for in person — chosen for longevity, not novelty.",
	},
	{
		icon: LeafIcon,
		title: "Quietly sustainable",
		body: "Every order is shipped carbon-neutral, in recyclable packaging that doesn't shout about it.",
	},
	{
		icon: CompassIcon,
		title: "Considered design",
		body: "A small, opinionated catalog. Nothing in the lineup is here by accident.",
	},
	{
		icon: HeartHandshakeIcon,
		title: "Honest support",
		body: "A real person answers within a day — and stays in the loop until you're settled in.",
	},
];

export function About() {
	return (
		<section id="about" className="relative bg-background">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
					<div className="lg:col-span-5 lg:sticky lg:top-28">
						<div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
							<span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
							Our approach
						</div>
						<h2 className="mt-4 font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.035em] text-foreground">
							A storefront that
							<br />
							respects your time.
						</h2>
						<p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-md">
							We don't sell trends — we sell the few things you'll actually keep around. Fewer, better,
							quieter.
						</p>
					</div>

					<div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
						{features.map((feature) => (
							<div
								key={feature.title}
								className="group rounded-3xl border border-border bg-card p-6 sm:p-7 card-soft-shadow transition-transform duration-300 hover:-translate-y-0.5"
							>
								<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-foreground text-background">
									<feature.icon className="h-4.5 w-4.5" />
								</div>
								<h3 className="mt-5 font-display text-lg font-semibold tracking-tight text-foreground">
									{feature.title}
								</h3>
								<p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.body}</p>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
