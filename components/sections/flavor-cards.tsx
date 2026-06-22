import Image from "next/image";
import { YnsLink } from "@/components/yns-link";

const FLAVORS = [
	{
		name: "Solar Citrus",
		tagline: "Sun-drenched orange",
		bg: "var(--tizz-orange)",
		fg: "var(--tizz-yellow)",
		image: "/scraped-1.jpg",
	},
	{
		name: "Cobalt Crush",
		tagline: "Frozen blueberry punch",
		bg: "var(--tizz-blue)",
		fg: "var(--tizz-yellow)",
		image: "/scraped-3.jpg",
	},
	{
		name: "Cosmic Grape",
		tagline: "Loud purple haze",
		bg: "var(--tizz-purple)",
		fg: "var(--tizz-yellow)",
		image: "/scraped-5.jpg",
	},
];

export function FlavorCards() {
	return (
		<section className="bg-[var(--tizz-cream)] py-16 sm:py-24">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-end justify-between mb-10 flex-wrap gap-4">
					<div>
						<p className="tizz-overline text-[var(--tizz-orange)] text-xs mb-3">Pick your poison</p>
						<h2 className="tizz-display text-[var(--tizz-deep)] text-4xl sm:text-5xl lg:text-6xl">
							Three flavors,
							<br />
							zero rules.
						</h2>
					</div>
					<YnsLink
						href="/products"
						className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--tizz-deep)] text-[var(--tizz-cream)] tizz-overline text-xs hover:bg-[var(--tizz-orange)] transition-colors"
					>
						See the lineup →
					</YnsLink>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-5">
					{FLAVORS.map((flavor, i) => (
						<YnsLink
							key={flavor.name}
							href="/products"
							className="group relative aspect-[3/4] rounded-[2rem] overflow-hidden border-4 border-[var(--tizz-deep)] transition-transform hover:-translate-y-2"
							style={{ background: flavor.bg }}
						>
							<div className="absolute inset-0 tizz-noise" />
							{/* Halo */}
							<div
								className="absolute inset-0 opacity-60 mix-blend-screen pointer-events-none"
								style={{
									background: "radial-gradient(circle at 50% 35%, rgba(255,255,255,0.5) 0%, transparent 55%)",
								}}
							/>
							{/* Number */}
							<span
								className="absolute top-4 left-5 tizz-display text-7xl leading-none"
								style={{ color: flavor.fg, opacity: 0.85 }}
							>
								0{i + 1}
							</span>
							{/* Image */}
							<div className="absolute inset-0 flex items-center justify-center p-8">
								<div className="relative w-full h-3/4 transition-transform group-hover:scale-105 group-hover:rotate-3">
									<Image
										src={flavor.image}
										alt={flavor.name}
										fill
										sizes="(max-width: 768px) 100vw, 33vw"
										className="object-contain drop-shadow-2xl"
									/>
								</div>
							</div>
							{/* Footer text */}
							<div className="absolute bottom-0 left-0 right-0 p-5 flex items-end justify-between">
								<div>
									<p className="tizz-overline text-[10px]" style={{ color: flavor.fg, opacity: 0.85 }}>
										{flavor.tagline}
									</p>
									<h3 className="tizz-display text-3xl leading-none" style={{ color: flavor.fg }}>
										{flavor.name}
									</h3>
								</div>
								<span
									className="inline-flex items-center justify-center w-10 h-10 rounded-full border-2"
									style={{ borderColor: flavor.fg, color: flavor.fg }}
								>
									→
								</span>
							</div>
						</YnsLink>
					))}
				</div>
			</div>
		</section>
	);
}
