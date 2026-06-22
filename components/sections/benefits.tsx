import { BatteryChargingIcon, LeafIcon, ShieldCheckIcon, SunIcon, TimerIcon, ZapIcon } from "lucide-react";
import Image from "next/image";

const benefits = [
	{
		icon: ZapIcon,
		title: "Lower energy bills",
		body: "Cut grid usage by up to 90% from day one with right-sized arrays.",
	},
	{
		icon: LeafIcon,
		title: "Cleaner footprint",
		body: "A typical home offsets 7–9 tons of CO₂ each year by going solar.",
	},
	{
		icon: ShieldCheckIcon,
		title: "Backed by warranty",
		body: "25-year performance and 12-year product warranty on every panel.",
	},
	{
		icon: BatteryChargingIcon,
		title: "Battery ready",
		body: "Pair with our storage to keep the lights on through outages.",
	},
	{
		icon: SunIcon,
		title: "Higher efficiency",
		body: "Mono PERC cells deliver up to 22.8% conversion in real-world conditions.",
	},
	{
		icon: TimerIcon,
		title: "Fast payback",
		body: "Most systems pay for themselves in 6–8 years, then it's free power.",
	},
];

export function Benefits() {
	return (
		<section className="bg-[var(--lime-soft)]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
				<div className="grid lg:grid-cols-12 gap-10 items-center">
					{/* Left: heading + product hero */}
					<div className="lg:col-span-5">
						<p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--forest)]/70 divider-leaf">
							Why solar
						</p>
						<h2 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight text-[var(--forest-deep)] text-balance">
							Benefits of Solar Panels
						</h2>
						<p className="mt-3 text-[15px] text-[var(--forest-deep)]/75 leading-relaxed max-w-md">
							Real benefits, measured in dollars saved and carbon avoided. Here's what changes the day your
							system turns on.
						</p>
						<div className="relative mt-8 aspect-square max-w-sm rounded-3xl overflow-hidden bg-white/60 ring-1 ring-[var(--forest-deep)]/10 shadow-sm">
							<Image
								src="/scraped-1.jpg"
								alt="High efficiency solar panel"
								fill
								className="object-cover"
								sizes="(max-width: 1024px) 100vw, 400px"
							/>
							<div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 rounded-2xl bg-white/90 backdrop-blur px-4 py-3">
								<span className="size-2 rounded-full bg-[var(--lime)]" />
								<span className="text-xs font-semibold text-[var(--forest-deep)]">
									Tier-1 mono PERC · 450W
								</span>
								<span className="ml-auto text-xs font-bold text-[var(--forest-deep)]">22.8%</span>
							</div>
						</div>
					</div>

					{/* Right: benefit list */}
					<div className="lg:col-span-7 grid sm:grid-cols-2 gap-3">
						{benefits.map((b) => (
							<div
								key={b.title}
								className="group flex items-start gap-4 rounded-2xl bg-white/85 backdrop-blur-sm p-4 ring-1 ring-[var(--forest-deep)]/10 hover:ring-[var(--forest-deep)]/25 transition"
							>
								<span className="flex shrink-0 size-10 items-center justify-center rounded-xl bg-[var(--forest)] text-[var(--lime)]">
									<b.icon className="size-5" />
								</span>
								<div>
									<h3 className="text-[15px] font-semibold text-[var(--forest-deep)]">{b.title}</h3>
									<p className="mt-0.5 text-sm text-[var(--forest-deep)]/70 leading-relaxed">{b.body}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
