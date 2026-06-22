import { ArrowRightIcon, Check } from "lucide-react";
import { YnsLink } from "../yns-link";

const tiers = [
	{
		name: "Single Pint",
		price: "$8",
		cadence: "one-time",
		bullets: ["Try any flavor", "Ships frozen", "Cancel anytime"],
		accent: "var(--yns-peach)",
		highlight: false,
	},
	{
		name: "The Flight",
		price: "$28",
		cadence: "4 pints / month",
		bullets: ["One of each flavor", "Free shipping", "Skip or swap monthly", "Save 15% vs single pints"],
		accent: "var(--yns-cyan)",
		highlight: true,
	},
	{
		name: "Team Pack",
		price: "$48",
		cadence: "8 pints / month",
		bullets: ["Build your own box", "Priority shipping", "Save 22%", "Bonus merch every 3 months"],
		accent: "var(--yns-mint)",
		highlight: false,
	},
];

export function Bundles() {
	return (
		<section className="bg-black text-white">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				<div className="text-center max-w-2xl mx-auto">
					<div className="font-display uppercase tracking-[0.2em] text-xs text-[var(--yns-cyan)]">
						Subscribe & Save
					</div>
					<h2 className="mt-3 font-display uppercase text-4xl sm:text-5xl lg:text-6xl leading-[0.95]">
						Stack the freezer.
						<br />
						Pay less. Eat more.
					</h2>
					<p className="mt-6 text-white/60 text-lg">
						Lock in your flavors on a flexible monthly delivery. Skip a month, swap a pint, or quit whenever
						you want. We&apos;re not weird about it.
					</p>
				</div>

				<div className="mt-14 grid md:grid-cols-3 gap-5">
					{tiers.map((tier) => (
						<div
							key={tier.name}
							className={`relative rounded-3xl p-8 flex flex-col ${
								tier.highlight
									? "bg-white text-black ring-4 ring-[var(--yns-cyan)]"
									: "border border-white/10 bg-white/[0.02]"
							}`}
						>
							{tier.highlight && (
								<span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-black text-white text-[10px] font-bold uppercase tracking-[0.18em] px-4 py-1.5">
									Most Popular
								</span>
							)}
							<div className="flex items-center justify-between">
								<div className="font-display uppercase text-lg tracking-[0.12em]">{tier.name}</div>
								<span className="h-3 w-3 rounded-full" style={{ background: tier.accent }} aria-hidden />
							</div>
							<div className="mt-6 flex items-baseline gap-2">
								<span className="font-display uppercase text-5xl sm:text-6xl">{tier.price}</span>
								<span className={`text-sm ${tier.highlight ? "text-black/60" : "text-white/50"}`}>
									/ {tier.cadence}
								</span>
							</div>
							<ul className="mt-8 space-y-3 flex-1">
								{tier.bullets.map((b) => (
									<li key={b} className="flex items-start gap-3 text-sm">
										<Check
											className={`h-5 w-5 mt-0.5 shrink-0 ${
												tier.highlight ? "text-black" : "text-[var(--yns-cyan)]"
											}`}
											strokeWidth={3}
										/>
										<span className={tier.highlight ? "text-black/80" : "text-white/75"}>{b}</span>
									</li>
								))}
							</ul>
							<YnsLink
								href="/products"
								className={`mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-full font-display uppercase tracking-[0.14em] text-[12px] transition-colors ${
									tier.highlight
										? "bg-black text-white hover:bg-[var(--yns-cyan)] hover:text-black"
										: "bg-white text-black hover:bg-[var(--yns-cyan)]"
								}`}
							>
								Start Now
								<ArrowRightIcon className="h-4 w-4" />
							</YnsLink>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
