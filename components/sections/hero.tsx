import Image from "next/image";
import { YnsLink } from "../yns-link";

function Cloud({ className }: { className?: string }) {
	return (
		<svg aria-hidden="true" viewBox="0 0 200 100" className={className} fill="currentColor">
			<path d="M40 70c-16 0-30-12-30-28S24 14 40 14c6 0 12 2 17 5C62 9 71 4 82 4c18 0 32 13 33 31 4-2 9-3 14-3 16 0 28 12 28 28 0 14-10 26-24 28-3 7-10 12-19 12H46c-3 0-5-1-6-3" />
		</svg>
	);
}

export function Hero() {
	return (
		<section className="relative overflow-hidden bg-hero-lavender">
			{/* decorative clouds */}
			<Cloud className="absolute top-12 left-[8%] w-32 text-white/55 animate-float-slow" />
			<Cloud className="absolute top-32 right-[42%] w-20 text-white/45" />
			<Cloud className="absolute bottom-32 left-[38%] w-24 text-white/40 animate-float-slow" />
			<Cloud className="absolute top-1/2 left-[2%] w-16 text-white/50" />

			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid lg:grid-cols-2 gap-10 items-center min-h-[560px] py-14 sm:py-20 lg:py-24">
					{/* Left: copy */}
					<div className="relative z-10">
						<h1 className="font-display text-[var(--cobalt)] uppercase leading-[0.92] text-5xl sm:text-6xl lg:text-7xl xl:text-[5.5rem]">
							Meet
							<br />
							Cinnamon Roll
							<br />
							Crunch
						</h1>
						<p className="mt-7 max-w-md text-[var(--cobalt)]/85 text-base sm:text-lg leading-relaxed">
							A cozy classic, reimagined. Your Next Store delivers nostalgic, swirling sweetness with a
							protein-powered crunch — packed with whole grains, real ingredients, and zero seed oils.
						</p>
						<div className="mt-9 flex flex-wrap gap-3">
							<YnsLink
								prefetch={"eager"}
								href="/products"
								className="inline-flex items-center justify-center h-12 px-7 rounded-full bg-[var(--cobalt)] text-white text-sm font-bold uppercase tracking-wider hover:bg-[var(--cobalt-light)] transition-colors cloud-shadow"
							>
								Shop Snacks
							</YnsLink>
							<YnsLink
								prefetch={"eager"}
								href="#story"
								className="inline-flex items-center justify-center h-12 px-7 rounded-full border-2 border-[var(--cobalt)] text-[var(--cobalt)] text-sm font-bold uppercase tracking-wider hover:bg-[var(--cobalt)] hover:text-white transition-colors"
							>
								Find Near You
							</YnsLink>
						</div>
					</div>

					{/* Right: hero collage */}
					<div className="relative h-[420px] sm:h-[520px] lg:h-[600px]">
						<div className="absolute inset-0 flex items-end justify-center">
							<Image
								src="/scraped-0.jpg"
								alt="Featured snack arrangement"
								width={620}
								height={620}
								priority
								className="relative z-10 object-contain w-full h-full drop-shadow-[0_30px_50px_rgba(27,63,190,0.25)]"
							/>
						</div>
						{/* speech bubble accent */}
						<div className="absolute top-8 right-4 sm:right-12 z-20 rotate-6 bg-white/90 backdrop-blur rounded-2xl px-4 py-2 cloud-shadow">
							<span className="font-display text-[var(--cobalt)] text-sm uppercase tracking-wide">
								7g protein • zero fluff
							</span>
						</div>
					</div>
				</div>
			</div>

			{/* Benefits strip */}
			<BenefitsStrip />
		</section>
	);
}

function BenefitsStrip() {
	const benefits = [
		{
			label: "Protein Per Serving",
			icon: (
				<span className="font-display text-[var(--cobalt)] text-xl leading-none">
					7<span className="text-[10px] align-super">g</span>
				</span>
			),
		},
		{
			label: "Whole Grain",
			icon: (
				<svg
					className="h-6 w-6 text-[var(--cobalt)]"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.8"
				>
					<path
						d="M12 22V8M12 8c-3-3-6-3-6-6 3 0 6 3 6 6Zm0 0c3-3 6-3 6-6-3 0-6 3-6 6Zm0 4c-3-3-6-3-6-6 3 0 6 3 6 6Zm0 0c3-3 6-3 6-6-3 0-6 3-6 6Zm0 4c-3-3-6-3-6-6 3 0 6 3 6 6Zm0 0c3-3 6-3 6-6-3 0-6 3-6 6Z"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			),
		},
		{
			label: "Non-GMO",
			icon: (
				<svg
					className="h-6 w-6 text-[var(--cobalt)]"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.8"
				>
					<path
						d="M11 3c-4 1-7 4-7 9 0 5 4 9 9 9 5 0 9-4 9-9-4 0-7-3-7-7 0-1 0-2 1-3-2 0-4 1-5 1Z"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			),
		},
		{
			label: "Gluten Free",
			icon: <span className="font-display text-[var(--cobalt)] text-base leading-none">GF</span>,
		},
		{
			label: "Real Ingredients",
			icon: (
				<svg
					className="h-6 w-6 text-[var(--cobalt)]"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.8"
				>
					<rect x="3" y="7" width="18" height="13" rx="2" />
					<path d="M3 11h18M8 7V4h8v3" strokeLinecap="round" />
				</svg>
			),
		},
		{
			label: "No Seed Oils",
			icon: (
				<svg
					className="h-6 w-6 text-[var(--cobalt)]"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.8"
				>
					<path
						d="M12 3c4 4 6 7 6 11a6 6 0 1 1-12 0c0-4 2-7 6-11Z"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			),
		},
	];

	return (
		<div className="marquee-strip relative z-20">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 overflow-hidden">
				<ul className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3">
					{benefits.map((b) => (
						<li key={b.label} className="flex items-center gap-2.5 text-[var(--cobalt)]">
							<span className="flex items-center justify-center w-7 h-7">{b.icon}</span>
							<span className="text-xs sm:text-sm font-semibold uppercase tracking-wider whitespace-nowrap">
								{b.label}
							</span>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}
