import Image from "next/image";
import { YnsLink } from "../yns-link";

const steps = [
	{
		num: "01",
		title: "Order your starter kit",
		body: "Bottle, pressure cap, and a six-pack of CO₂ capsules — shipped carbon-neutral.",
	},
	{
		num: "02",
		title: "Sip, climb, repeat",
		body: "Each capsule pulls 60+ bottles. Pop, twist, and you're carbonating in under five seconds.",
	},
	{
		num: "03",
		title: "Swap empties at any drop point",
		body: "Drop spent capsules at any trailhead kiosk or mail them back in our pre-paid envelope.",
	},
];

export function Exchange() {
	return (
		<section id="exchange" className="bg-black">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
				<div className="grid lg:grid-cols-[1.05fr_1fr] gap-10 lg:gap-16 items-center">
					{/* Left image */}
					<div className="relative aspect-[4/5] sm:aspect-[5/4] lg:aspect-[4/5] overflow-hidden rounded-2xl bg-[var(--yns-charcoal)]">
						<Image
							src="/scraped-4.jpg"
							alt="Capsule exchange service"
							fill
							sizes="(max-width: 1024px) 100vw, 50vw"
							className="object-cover"
						/>
						<div
							aria-hidden="true"
							className="absolute inset-0 bg-gradient-to-tr from-black/60 via-transparent to-black/30"
						/>
						{/* Floating label */}
						<div className="absolute left-5 top-5 flex items-center gap-2 rounded-full bg-black/55 backdrop-blur px-3 py-1.5 text-[11px] uppercase tracking-[0.2em] text-white/85">
							<span className="h-1.5 w-1.5 rounded-full bg-[var(--yns-lime)]" />
							Capsule Exchange · Pilot live in 14 states
						</div>
					</div>

					{/* Right copy */}
					<div>
						<p className="text-[11px] uppercase tracking-[0.32em] text-[var(--yns-lime)] font-semibold">
							How it works
						</p>
						<h2
							id="how-it-works"
							className="mt-5 font-display text-[clamp(2rem,4.2vw,3.5rem)] leading-[1.02] text-white"
						>
							A closed loop, with zero pressure on the planet.
						</h2>
						<p className="mt-5 text-base sm:text-lg text-white/55 leading-relaxed max-w-lg">
							The Capsule Exchange Service keeps every CO₂ cartridge in circulation. You bring back the
							empties. We sterilize, refill, and ship them back into the wild.
						</p>

						<ol className="mt-10 space-y-7">
							{steps.map((step) => (
								<li key={step.num} className="flex gap-5">
									<span className="font-mono-tight shrink-0 inline-flex items-center justify-center h-10 w-10 rounded-full border border-white/15 text-[12px] text-white">
										{step.num}
									</span>
									<div>
										<h3 className="text-base font-semibold text-white">{step.title}</h3>
										<p className="mt-1.5 text-sm text-white/55 leading-relaxed max-w-md">{step.body}</p>
									</div>
								</li>
							))}
						</ol>

						<div className="mt-10">
							<YnsLink
								prefetch={"eager"}
								href="/products"
								className="inline-flex items-center gap-2 rounded-full bg-white text-black h-11 px-6 text-[13px] font-semibold hover:bg-[var(--yns-lime)] transition-colors"
							>
								Start the exchange →
							</YnsLink>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
