import Image from "next/image";

const CLAIMS = [
	{ value: "10g", label: "Protein", color: "#c8132b" },
	{ value: "4", label: "Count", color: "#2a57c9" },
	{ value: "No", label: "Seed Oils", color: "#c8132b" },
	{ value: "100%", label: "Real Fruit", color: "#2a57c9" },
];

const INGREDIENTS = [
	{
		title: "Creamy Peanut Butter",
		copy: "Slow-roasted peanuts blended thick — no hydrogenated oils, no nonsense.",
		image: "/scraped-4.jpg",
		swatch: "#c79550",
		number: "01",
	},
	{
		title: "Real Fruit Jelly",
		copy: "Sun-ripened strawberries and berries cooked low and slow with a kiss of cane sugar.",
		image: "/scraped-1.jpg",
		swatch: "#c8132b",
		number: "02",
	},
	{
		title: "Pillowy Crustless Bread",
		copy: "Soft, sealed-edge sandwich rounds engineered for freezer pop & go ease.",
		image: "/scraped-5.jpg",
		swatch: "#f4a8b2",
		number: "03",
	},
];

const RETAILERS = ["TARGET", "WALMART", "WHOLE FOODS", "KROGER", "PUBLIX", "SPROUTS"];

const LIFESTYLE = [
	{
		title: "After-school snack",
		copy: "Two minutes from freezer to lunchbox grin.",
		image: "/scraped-2.jpg",
		bg: "#ffe9ec",
		text: "#c8132b",
	},
	{
		title: "Freezer-aisle staple",
		copy: "Stocked at 12,000+ stores nationwide.",
		image: "/scraped-3.jpg",
		bg: "#c8132b",
		text: "#ffffff",
	},
];

export function About() {
	return (
		<>
			<ClaimsBand />
			<SimpleRecipe />
			<RetailerStrip />
			<LifestyleScroll />
		</>
	);
}

function ClaimsBand() {
	return (
		<section className="bg-[#ffe9ec] border-y-4 border-[#c8132b]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
				<div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
					{CLAIMS.map((claim) => (
						<div
							key={claim.label}
							className="flex flex-col items-center gap-1 rounded-3xl bg-white p-5 shadow-[0_8px_24px_rgba(200,19,43,0.08)] border border-[#f7d4d9]"
						>
							<span className="font-display text-4xl sm:text-5xl leading-none" style={{ color: claim.color }}>
								{claim.value}
							</span>
							<span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#1a0810]">
								{claim.label}
							</span>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

function SimpleRecipe() {
	return (
		<section id="story" className="bg-white">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				<div className="text-center max-w-2xl mx-auto">
					<span className="inline-block bg-[#ffe9ec] text-[#c8132b] text-[11px] font-bold uppercase tracking-[0.3em] px-4 py-1.5 rounded-full">
						Just three things
					</span>
					<h2 className="font-display uppercase text-4xl sm:text-6xl lg:text-7xl mt-5 text-[#1a0810] leading-[0.9]">
						The Simple
						<br />
						<span className="text-[#c8132b]">Recipe</span>
					</h2>
					<p className="mt-5 text-[#7a4b53] text-base sm:text-lg leading-relaxed">
						No long ingredient list. No artificial color. Just real food made the way it should be.
					</p>
				</div>

				<div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10">
					{INGREDIENTS.map((item) => (
						<article
							key={item.title}
							className="group relative overflow-hidden rounded-[28px] bg-[#fff7f0] border border-[#f7d4d9] p-6 sm:p-8 transition-transform hover:-translate-y-1"
						>
							<div className="flex items-start justify-between">
								<span
									className="font-display text-5xl sm:text-6xl leading-none"
									style={{ color: item.swatch }}
								>
									{item.number}
								</span>
								<span
									aria-hidden
									className="inline-block h-8 w-8 rounded-full"
									style={{ background: item.swatch }}
								/>
							</div>
							<div className="relative mt-6 aspect-[4/3] rounded-2xl overflow-hidden bg-[#ffe9ec]">
								<Image
									src={item.image}
									alt={item.title}
									fill
									sizes="(max-width: 768px) 100vw, 33vw"
									className="object-cover transition-transform duration-700 group-hover:scale-105"
								/>
							</div>
							<h3 className="mt-6 font-display uppercase text-xl sm:text-2xl text-[#1a0810] leading-tight">
								{item.title}
							</h3>
							<p className="mt-3 text-sm leading-relaxed text-[#7a4b53]">{item.copy}</p>
						</article>
					))}
				</div>
			</div>
		</section>
	);
}

function RetailerStrip() {
	return (
		<section className="bg-white border-y border-[#f7d4d9]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
				<div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
					<span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#7a4b53] whitespace-nowrap">
						As seen at
					</span>
					<div className="flex flex-wrap items-center justify-center gap-x-8 sm:gap-x-12 gap-y-4 flex-1">
						{RETAILERS.map((retailer) => (
							<span
								key={retailer}
								className="font-display text-lg sm:text-2xl tracking-tight text-[#1a0810]/60 hover:text-[#c8132b] transition-colors"
							>
								{retailer}
							</span>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}

function LifestyleScroll() {
	return (
		<section className="bg-[#fff7f0]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
					{LIFESTYLE.map((scene) => (
						<article
							key={scene.title}
							className="group relative overflow-hidden rounded-[36px] aspect-[4/5] sm:aspect-[5/4] lg:aspect-[4/5]"
							style={{ background: scene.bg }}
						>
							<Image
								src={scene.image}
								alt={scene.title}
								fill
								sizes="(max-width: 1024px) 100vw, 50vw"
								className="object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
							/>
							<div
								className="absolute inset-0"
								style={{
									background: `linear-gradient(180deg, transparent 40%, ${scene.bg}cc 100%)`,
								}}
							/>
							<div className="absolute bottom-0 left-0 right-0 p-8 sm:p-10">
								<h3
									className="font-display uppercase text-3xl sm:text-5xl leading-[0.95]"
									style={{ color: scene.text }}
								>
									{scene.title}
								</h3>
								<p className="mt-3 text-sm sm:text-base max-w-sm" style={{ color: scene.text }}>
									{scene.copy}
								</p>
							</div>
						</article>
					))}
				</div>
			</div>
		</section>
	);
}
