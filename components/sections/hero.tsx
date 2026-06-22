import { PlantchiFlower } from "@/components/plantchi-logo";
import { YnsLink } from "../yns-link";

export function Hero() {
	return (
		<section className="relative overflow-hidden bg-grid-paper">
			{/* Soft cream wash + lavender glow */}
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(159,156,245,0.18),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(245,166,35,0.12),transparent_50%)]"
			/>

			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center min-h-[620px] py-12 sm:py-16 lg:py-20">
					{/* Left — overlapping pouches */}
					<div className="lg:col-span-7 relative">
						<div className="relative grid grid-cols-3 gap-3 sm:gap-5 lg:gap-7">
							<PouchCard
								tint="mint"
								title="Umami Bloom"
								caption="Hemp Hearts · Garlic"
								className="translate-y-10 sm:translate-y-12 lg:translate-y-14 -rotate-2"
							/>
							<PouchCard
								tint="marigold"
								title="Sun Crumble"
								caption="Nutritional Yeast"
								className="translate-y-3 sm:translate-y-4 -rotate-1"
							/>
							<PouchCard
								tint="peach"
								title="Cheese Tease"
								caption="Hemp · Garlic · Yeast"
								className="translate-y-6 sm:translate-y-8 rotate-2"
							/>
						</div>

						{/* Floating sticker */}
						<div className="absolute -top-2 -left-4 hidden sm:flex h-20 w-20 rotate-[-12deg] items-center justify-center rounded-full bg-[#9f9cf5] text-[#1b2a2e] shadow-md plantchi-float">
							<div className="text-center text-[10px] font-bold uppercase leading-tight tracking-wider">
								New
								<br />
								Drop
							</div>
						</div>
					</div>

					{/* Right — headline + leaves */}
					<div className="lg:col-span-5 relative">
						<div className="absolute -top-12 -right-4 hidden md:block plantchi-float-slow opacity-90">
							<LeafSVG />
						</div>

						<div className="relative">
							<span className="inline-flex items-center gap-2 rounded-full border border-[#1b2a2e]/15 bg-white/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#1b2a2e]">
								<span className="h-1.5 w-1.5 rounded-full bg-[#f5a623]" />
								Seasonings with benefits
							</span>

							<div className="mt-5 inline-block rounded-3xl bg-[#1b2a2e] px-6 py-5 sm:px-8 sm:py-7 shadow-[0_30px_80px_-30px_rgba(27,42,46,0.5)]">
								<h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black leading-[1.05] tracking-tight text-[#fbe9d7]">
									An effortless way to get extra nutrients throughout the day.
								</h1>
							</div>

							<div className="mt-7 flex flex-wrap items-center gap-3">
								<YnsLink
									prefetch={"eager"}
									href="#products"
									className="inline-flex items-center justify-center gap-2 h-11 px-6 bg-[#1b2a2e] text-[#fbe9d7] rounded-full text-sm font-semibold hover:bg-[#0f1c1f] transition-colors shadow-[0_10px_30px_-10px_rgba(27,42,46,0.6)]"
								>
									Shop now
								</YnsLink>
								<YnsLink
									prefetch={"eager"}
									href="#about"
									className="inline-flex items-center justify-center h-11 px-5 text-sm font-semibold text-[#1b2a2e] underline underline-offset-4 decoration-[#f5a623] decoration-2 hover:decoration-[#1b2a2e]"
								>
									Our Story
								</YnsLink>
							</div>

							<dl className="mt-10 grid grid-cols-3 gap-4 max-w-md">
								<Stat label="Organic" value="100%" />
								<Stat label="Plant-based" value="Always" />
								<Stat label="Made in" value="USA" />
							</dl>
						</div>
					</div>
				</div>
			</div>

			{/* Bottom hero tape */}
			<div className="border-y border-[#1b2a2e]/10 bg-[#fbe9d7]/80">
				<div className="max-w-7xl mx-auto flex flex-wrap items-center justify-around gap-y-2 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#1b2a2e]/70">
					<span className="flex items-center gap-2">
						<PlantchiFlower size={14} className="text-[#f5a623]" /> Organic
					</span>
					<span className="flex items-center gap-2">
						<PlantchiFlower size={14} className="text-[#9f9cf5]" /> Vegan
					</span>
					<span className="flex items-center gap-2">
						<PlantchiFlower size={14} className="text-[#a8e0dc]" /> Gluten-Free
					</span>
					<span className="flex items-center gap-2">
						<PlantchiFlower size={14} className="text-[#f5a623]" /> Non-GMO
					</span>
					<span className="flex items-center gap-2">
						<PlantchiFlower size={14} className="text-[#1b2a2e]" /> Soy-Free
					</span>
				</div>
			</div>
		</section>
	);
}

function Stat({ label, value }: { label: string; value: string }) {
	return (
		<div>
			<dt className="text-[11px] font-semibold uppercase tracking-widest text-[#1b2a2e]/60">{label}</dt>
			<dd className="mt-1 font-display text-xl font-bold text-[#1b2a2e]">{value}</dd>
		</div>
	);
}

function PouchCard({
	tint,
	title,
	caption,
	className,
}: {
	tint: "mint" | "marigold" | "peach";
	title: string;
	caption: string;
	className?: string;
}) {
	const tints = {
		mint: { bg: "#a8e0dc", text: "#1b2a2e" },
		marigold: { bg: "#f5a623", text: "#1b2a2e" },
		peach: { bg: "#f5cba7", text: "#1b2a2e" },
	}[tint];

	return (
		<div
			className={`relative aspect-[3/4] rounded-[18px] shadow-[0_25px_60px_-25px_rgba(27,42,46,0.45)] overflow-hidden ${className ?? ""}`}
			style={{ backgroundColor: tints.bg, color: tints.text }}
		>
			<div className="absolute inset-x-0 top-0 px-3 py-2 text-center text-[8px] font-bold uppercase tracking-[0.18em] border-b border-current/30">
				An effortless nutrient boost for every meal
			</div>

			<div className="absolute inset-x-0 top-9 text-center px-2">
				<p className="font-display italic text-[11px] sm:text-sm font-medium">Seasoning with Benefits</p>
				<p className="font-display text-lg sm:text-2xl lg:text-3xl font-black leading-none tracking-tight mt-1">
					{title}
				</p>
			</div>

			<div className="absolute inset-0 flex items-center justify-center">
				<BoldFlowerSVG />
			</div>

			<div className="absolute inset-x-0 bottom-3 px-2 text-center">
				<p className="text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.14em]">{caption}</p>
				<div className="mt-1 flex justify-center gap-1">
					{[0, 1, 2, 3].map((i) => (
						<span
							key={i}
							className="h-3 w-3 rounded-full border border-current/40"
							style={{ backgroundColor: i === 1 ? tints.text : "transparent" }}
						/>
					))}
				</div>
			</div>
		</div>
	);
}

function BoldFlowerSVG() {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 200 200"
			className="h-3/5 w-3/5 drop-shadow-sm"
			aria-hidden="true"
		>
			<title>Bold botanical bloom</title>
			<g fill="#1b2a2e">
				<path d="M100 10 C 130 30 130 60 100 80 C 70 60 70 30 100 10 Z" />
				<path d="M190 100 C 170 130 140 130 120 100 C 140 70 170 70 190 100 Z" />
				<path d="M100 190 C 70 170 70 140 100 120 C 130 140 130 170 100 190 Z" />
				<path d="M10 100 C 30 70 60 70 80 100 C 60 130 30 130 10 100 Z" />
				<path d="M160 40 C 175 70 155 95 125 85 C 115 55 135 30 160 40 Z" />
				<path d="M40 160 C 25 130 45 105 75 115 C 85 145 65 170 40 160 Z" />
				<path d="M160 160 C 130 175 105 155 115 125 C 145 115 170 135 160 160 Z" />
				<path d="M40 40 C 70 25 95 45 85 75 C 55 85 30 65 40 40 Z" />
			</g>
			<circle cx="100" cy="100" r="22" fill="#fbe9d7" />
		</svg>
	);
}

function LeafSVG() {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 320" className="h-72 w-56" aria-hidden="true">
			<title>Tropical leaf</title>
			<defs>
				<linearGradient id="leaf-grad" x1="0%" y1="0%" x2="0%" y2="100%">
					<stop offset="0%" stopColor="#2d5840" />
					<stop offset="100%" stopColor="#1b2a2e" />
				</linearGradient>
			</defs>
			<path d="M120 10 C 200 50 220 180 130 310 C 60 240 50 90 120 10 Z" fill="url(#leaf-grad)" />
			<g stroke="#f5cba7" strokeWidth="2" fill="none" opacity="0.7">
				<path d="M120 20 L 130 305" />
				<path d="M125 60 C 140 70 160 80 170 90" />
				<path d="M122 100 C 140 110 165 115 180 120" />
				<path d="M122 150 C 140 160 165 170 185 175" />
				<path d="M125 200 C 140 210 160 220 175 225" />
				<path d="M127 250 C 140 260 155 270 165 275" />
				<path d="M122 70 C 105 80 85 90 75 95" />
				<path d="M122 130 C 100 140 80 155 65 165" />
				<path d="M125 180 C 105 195 85 210 75 220" />
				<path d="M125 230 C 110 245 95 260 85 270" />
			</g>
		</svg>
	);
}
