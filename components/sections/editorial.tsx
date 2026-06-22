import { ArrowRightIcon } from "lucide-react";
import Image from "next/image";
import { YnsLink } from "../yns-link";

export function Editorial() {
	return (
		<section id="story" className="bg-black text-white">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				<div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-center">
					<div className="relative aspect-[4/5] sm:aspect-[5/6] rounded-3xl overflow-hidden ring-1 ring-white/10 order-2 lg:order-1">
						<Image
							src="/scraped-3.jpg"
							alt="Lifestyle editorial — pint on a workout bench"
							fill
							sizes="(max-width:1024px) 100vw, 50vw"
							className="object-cover"
						/>
						<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
						<div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
							<div>
								<div className="font-display uppercase text-xs tracking-[0.2em] text-[var(--yns-cyan)]">
									The Origin
								</div>
								<div className="mt-2 font-display uppercase text-3xl sm:text-4xl text-white">
									Built in the gym.
									<br />
									Born in the kitchen.
								</div>
							</div>
						</div>
					</div>

					<div className="order-1 lg:order-2">
						<div className="font-display uppercase tracking-[0.2em] text-xs text-[var(--yns-cyan)]">
							Our Story
						</div>
						<h2 className="mt-4 font-display uppercase text-4xl sm:text-5xl lg:text-6xl leading-[0.95]">
							Dessert that
							<br />
							actually
							<br />
							<span className="text-[var(--yns-mint)]">earns its keep.</span>
						</h2>
						<p className="mt-6 text-white/70 leading-relaxed text-lg max-w-md">
							We were tired of the same trade-off: a pint that tastes like cardboard with a macro chart, or
							one that derails your week in six bites. So we built a third option — real cream texture, real
							flavor, real numbers on the back.
						</p>
						<div className="mt-8 grid grid-cols-3 gap-4 max-w-md">
							{[
								{ k: "Made in", v: "Brooklyn" },
								{ k: "Founded", v: "2024" },
								{ k: "Shipped to", v: "9 states" },
							].map((stat) => (
								<div key={stat.k} className="border-l border-white/15 pl-3">
									<div className="text-[10px] uppercase tracking-[0.18em] text-white/50">{stat.k}</div>
									<div className="font-display uppercase text-lg text-white">{stat.v}</div>
								</div>
							))}
						</div>
						<YnsLink
							href="#products"
							className="mt-10 inline-flex h-12 items-center gap-2 rounded-full bg-white px-7 font-display uppercase tracking-[0.14em] text-[12px] text-black hover:bg-[var(--yns-cyan)] transition-colors"
						>
							Try a Flight
							<ArrowRightIcon className="h-4 w-4" />
						</YnsLink>
					</div>
				</div>
			</div>
		</section>
	);
}
