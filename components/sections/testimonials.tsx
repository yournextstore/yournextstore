import { QuoteIcon, StarIcon } from "lucide-react";

const testimonials = [
	{
		name: "Maya R.",
		role: "Homeowner · Austin, TX",
		quote:
			"Install was clean and the team explained everything. Our July bill dropped from $312 to $19. Wish we'd done it years ago.",
		rating: 5,
		initials: "MR",
		tone: "bg-[#cfe5b8] text-[var(--forest-deep)]",
	},
	{
		name: "James W.",
		role: "Off-grid Cabin · Boulder, CO",
		quote:
			"The 8kW kit with battery backup runs everything we need year-round. Zero outages last winter, even at -12°F.",
		rating: 5,
		initials: "JW",
		tone: "bg-[var(--lime)] text-[var(--forest-deep)]",
	},
	{
		name: "Priya S.",
		role: "Small business · Sacramento",
		quote:
			"We sized the array for our bakery's ovens. Payback math worked out at 5.8 years and the install was permitted in two weeks.",
		rating: 5,
		initials: "PS",
		tone: "bg-[#e8d987] text-[var(--forest-deep)]",
	},
];

export function Testimonials() {
	return (
		<section className="bg-white">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
				<div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
					<div>
						<p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--forest)]/70 divider-leaf">
							Voices of YNS
						</p>
						<h2 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
							Customer Testimonials
						</h2>
					</div>
					<div className="hidden sm:flex items-center gap-2 text-sm">
						<div className="flex items-center gap-0.5 text-[var(--forest-deep)]">
							{Array.from({ length: 5 }).map((_, i) => (
								<StarIcon key={i} className="size-4 fill-current" />
							))}
						</div>
						<span className="font-semibold">4.9/5</span>
						<span className="text-muted-foreground">from 1,200+ installs</span>
					</div>
				</div>

				<div className="grid md:grid-cols-3 gap-5">
					{testimonials.map((t) => (
						<figure
							key={t.name}
							className="relative flex flex-col gap-5 rounded-3xl border border-border bg-card p-6 hover:shadow-md transition-shadow"
						>
							<QuoteIcon aria-hidden className="absolute top-5 right-5 size-7 text-[var(--lime)]/70" />
							<div className="flex items-center gap-0.5 text-[var(--forest-deep)]">
								{Array.from({ length: t.rating }).map((_, i) => (
									<StarIcon key={i} className="size-4 fill-current" />
								))}
							</div>
							<blockquote className="text-[15px] leading-relaxed text-foreground/90">"{t.quote}"</blockquote>
							<figcaption className="flex items-center gap-3 mt-auto pt-4 border-t border-dashed border-border">
								<span
									className={`flex size-10 items-center justify-center rounded-full text-xs font-bold ${t.tone}`}
								>
									{t.initials}
								</span>
								<div>
									<div className="text-sm font-semibold text-foreground">{t.name}</div>
									<div className="text-xs text-muted-foreground">{t.role}</div>
								</div>
							</figcaption>
						</figure>
					))}
				</div>
			</div>
		</section>
	);
}
