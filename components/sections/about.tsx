import Image from "next/image";
import { YnsLink } from "../yns-link";

/** Mascot — cartoon noodle character on a scooter (inline SVG) */
function NoodleMascot({ className = "" }: { className?: string }) {
	return (
		<svg viewBox="0 0 240 200" className={className} aria-hidden="true">
			{/* Scooter body */}
			<rect x="50" y="120" width="120" height="6" rx="3" fill="#3a1f12" />
			<circle cx="60" cy="150" r="22" fill="#fcefc8" stroke="#3a1f12" strokeWidth="4" />
			<circle cx="60" cy="150" r="6" fill="#3a1f12" />
			<circle cx="170" cy="150" r="22" fill="#fcefc8" stroke="#3a1f12" strokeWidth="4" />
			<circle cx="170" cy="150" r="6" fill="#3a1f12" />
			<path
				d="M170 124 L 180 80 L 195 80"
				stroke="#3a1f12"
				strokeWidth="5"
				fill="none"
				strokeLinecap="round"
			/>
			{/* Noodle character — squiggly yellow body */}
			<path
				d="M70 110 C 70 70, 100 60, 110 80 C 115 95, 95 95, 100 80 C 105 65, 130 65, 130 90 L 130 115"
				stroke="#f7d26b"
				strokeWidth="14"
				fill="none"
				strokeLinecap="round"
			/>
			{/* Head */}
			<circle cx="125" cy="78" r="22" fill="#f7d26b" stroke="#3a1f12" strokeWidth="3" />
			{/* Eyes */}
			<circle cx="120" cy="74" r="3" fill="#3a1f12" />
			<circle cx="132" cy="74" r="3" fill="#3a1f12" />
			{/* Smile */}
			<path
				d="M118 84 Q 126 90, 134 84"
				stroke="#3a1f12"
				strokeWidth="2.5"
				fill="none"
				strokeLinecap="round"
			/>
			{/* Sparkles */}
			<g fill="#f04a23">
				<path d="M30 40 L 33 50 L 43 53 L 33 56 L 30 66 L 27 56 L 17 53 L 27 50 Z" />
				<path d="M210 30 L 212 38 L 220 40 L 212 42 L 210 50 L 208 42 L 200 40 L 208 38 Z" />
				<path d="M200 100 L 202 106 L 208 108 L 202 110 L 200 116 L 198 110 L 192 108 L 198 106 Z" />
			</g>
		</svg>
	);
}

export function HowItWorks() {
	const steps = [
		{
			n: "01",
			title: "Pick your packs",
			body: "Browse small-batch flavors — sweet, salty, spicy, and the kind of crunch you can’t put down.",
		},
		{
			n: "02",
			title: "We pack the joy",
			body: "Boxed up by hand with a ribbon and a note. Made for sharing, hoarding, or gifting.",
		},
		{
			n: "03",
			title: "Crunch, repeat",
			body: "Subscribe and skip the snack drawer regret. Pause or cancel any time, no hard feelings.",
		},
	];

	return (
		<section id="about" className="relative bg-yns-cream overflow-hidden">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
				<div className="grid grid-cols-1 lg:grid-cols-[1.1fr_2fr] gap-12 items-center">
					<div>
						<p className="font-script text-yns-red text-2xl">Join the club</p>
						<h2 className="font-display text-yns-brown text-4xl sm:text-5xl lg:text-6xl mt-1">
							Everyone&apos;s favorite
							<br />
							<span className="text-yns-red italic">noodle chip</span>
						</h2>
						<NoodleMascot className="w-full max-w-sm mt-4" />
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
						{steps.map((s) => (
							<div
								key={s.n}
								className="relative bg-yns-cream-soft border-2 border-yns-red rounded-3xl p-6 shadow-[0_6px_0_var(--yns-brown)]"
							>
								<div className="absolute -top-5 -left-3 bg-yns-red text-yns-cream-soft font-display text-xl w-12 h-12 rounded-full flex items-center justify-center border-2 border-yns-brown shadow-[0_3px_0_var(--yns-brown)]">
									{s.n}
								</div>
								<h3 className="font-display text-yns-brown text-2xl mt-4">{s.title}</h3>
								<p className="mt-2 text-sm text-yns-brown/75 leading-relaxed">{s.body}</p>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}

export function LifestyleStrip() {
	return (
		<section className="relative overflow-hidden">
			<div className="relative aspect-[21/9] sm:aspect-[24/9] w-full">
				<Image
					src="/scraped-2.jpg"
					alt="Friends sharing snacks at a party"
					fill
					className="object-cover"
					sizes="100vw"
				/>
				<div className="absolute inset-0 bg-gradient-to-r from-yns-brown/60 via-yns-brown/30 to-transparent" />
				<div className="absolute inset-0 flex items-center">
					<div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
						<div className="max-w-xl">
							<p className="font-script text-yns-yellow text-3xl sm:text-4xl">
								&ldquo;Honestly, I bring these to everything now.&rdquo;
							</p>
							<p className="font-display text-yns-cream-soft text-xl sm:text-2xl mt-4">
								— Sam &amp; Friends, Brooklyn
							</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

export function PressStrip() {
	const outlets = ["Bon Appétit", "Eater", "Food & Wine", "GQ", "The Strategist", "Cherry Bombe"];
	return (
		<section className="bg-yns-cream border-y-2 border-[color:var(--border)]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center">
				<p className="font-script text-yns-red text-2xl">As seen in</p>
				<div className="mt-4 marquee">
					<div className="marquee-track">
						{[...outlets, ...outlets].map((o, i) => (
							<span
								key={`press-${i}-${o}`}
								className="text-yns-brown/70 text-2xl sm:text-3xl whitespace-nowrap italic"
								style={{
									fontFamily: "var(--font-body), serif",
									letterSpacing: "0.02em",
								}}
							>
								{o}
							</span>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}

export function BuildYourBox() {
	return (
		<section className="relative bg-yns-red text-yns-cream-soft overflow-hidden">
			{/* Confetti decoration */}
			<svg
				aria-hidden="true"
				viewBox="0 0 1200 300"
				className="absolute inset-0 w-full h-full pointer-events-none opacity-60"
				preserveAspectRatio="none"
			>
				<g fill="#f7d26b">
					<rect x="80" y="40" width="14" height="6" rx="2" transform="rotate(20 87 43)" />
					<rect x="950" y="60" width="14" height="6" rx="2" transform="rotate(-30 957 63)" />
					<rect x="280" y="220" width="14" height="6" rx="2" transform="rotate(45 287 223)" />
					<rect x="1080" y="200" width="14" height="6" rx="2" transform="rotate(15 1087 203)" />
					<circle cx="180" cy="180" r="5" />
					<circle cx="800" cy="50" r="4" />
					<circle cx="600" cy="240" r="6" />
				</g>
				<g fill="#fff7e0">
					<rect x="160" y="100" width="10" height="4" rx="2" transform="rotate(60 165 102)" />
					<rect x="700" y="160" width="10" height="4" rx="2" transform="rotate(10 705 162)" />
					<rect x="400" y="60" width="10" height="4" rx="2" transform="rotate(-20 405 62)" />
					<circle cx="350" cy="200" r="3" />
					<circle cx="1000" cy="120" r="3" />
				</g>
			</svg>

			<div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
				<p className="font-script text-yns-yellow text-2xl sm:text-3xl">#sendsnoods</p>
				<h2 className="font-display text-yns-cream-soft text-5xl sm:text-6xl lg:text-7xl mt-2">
					Build your own box
				</h2>
				<p className="mt-4 text-yns-cream-soft/85 max-w-xl mx-auto italic">
					Pick six flavors. Wrap it in a bow. Send the kind of mail people actually open.
				</p>
				<div className="mt-8">
					<YnsLink
						prefetch={"eager"}
						href="/products"
						className="inline-flex items-center justify-center gap-2 bg-yns-yellow text-yns-brown font-display tracking-wider text-sm uppercase px-8 py-4 rounded-full border-2 border-yns-brown shadow-[0_5px_0_var(--yns-brown)] hover:-translate-y-0.5 transition-transform"
					>
						Start building →
					</YnsLink>
				</div>
			</div>
		</section>
	);
}

export function UgcGallery() {
	const tiles = [
		{ src: "/scraped-0.jpg", caption: "@morgansnaps" },
		{ src: "/scraped-1.jpg", caption: "@thecrunchclub" },
		{ src: "/scraped-3.jpg", caption: "@partyplate" },
		{ src: "/scraped-4.jpg", caption: "@hostingwithlove" },
	];
	return (
		<section className="bg-yns-cream-soft">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
				<div className="text-center mb-10">
					<p className="font-script text-yns-red text-2xl">Tag us</p>
					<h2 className="font-display text-yns-brown text-4xl sm:text-5xl">
						<span className="text-yns-red">#</span>sendsnoods
					</h2>
				</div>
				<div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
					{tiles.map((t) => (
						<a
							key={t.src}
							href="#"
							className="group relative aspect-square rounded-2xl overflow-hidden border-2 border-yns-brown/10 block"
						>
							<Image
								src={t.src}
								alt={t.caption}
								fill
								className="object-cover transition-transform duration-500 group-hover:scale-105"
								sizes="(max-width: 640px) 50vw, 25vw"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-yns-brown/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
							<span className="absolute bottom-2 left-3 text-yns-cream-soft font-display text-sm tracking-wide opacity-0 group-hover:opacity-100 transition-opacity">
								{t.caption}
							</span>
						</a>
					))}
				</div>
			</div>
		</section>
	);
}

/** Legacy export — kept for any pages still importing About */
export function About() {
	return <HowItWorks />;
}
