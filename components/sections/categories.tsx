import Image from "next/image";
import { YnsLink } from "../yns-link";

const categories = [
	{
		title: "Beauty",
		blurb: "Collagen & hyaluronic acid",
		bg: "#f7e4d4",
		text: "#4b1fb5",
		accent: "#f4884a",
		image: "/scraped-0.jpg",
	},
	{
		title: "Sleep",
		blurb: "Melatonin & biotin",
		bg: "#4b1fb5",
		text: "#ffffff",
		accent: "#f5c518",
		image: "/scraped-1.jpg",
	},
	{
		title: "Energy",
		blurb: "Caffeine & ashwagandha",
		bg: "#f4884a",
		text: "#ffffff",
		accent: "#1a0f4d",
		image: "/scraped-2.jpg",
	},
];

export function Categories() {
	return (
		<section className="bg-[#fef7f0]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
				<div className="text-center mb-12">
					<p className="font-marker text-[#f4884a] text-xl mb-2 -rotate-1">find your formula</p>
					<h2 className="text-3xl sm:text-4xl lg:text-5xl text-[#1a0f4d]">Pick your vibe.</h2>
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
					{categories.map((c) => (
						<YnsLink
							key={c.title}
							prefetch="eager"
							href="/products"
							className="group relative rounded-[2rem] overflow-hidden p-8 transition-transform hover:-translate-y-1"
							style={{ backgroundColor: c.bg }}
						>
							<div className="relative z-10">
								<p className="text-xs font-bold uppercase tracking-[0.2em] mb-2" style={{ color: c.accent }}>
									Flavor
								</p>
								<h3 className="font-marker text-5xl sm:text-6xl mb-2 -rotate-2" style={{ color: c.text }}>
									{c.title}
								</h3>
								<p className="text-sm font-medium" style={{ color: c.text, opacity: 0.85 }}>
									{c.blurb}
								</p>
							</div>
							<div className="relative h-48 mt-6">
								<Image
									src={c.image}
									alt={c.title}
									fill
									sizes="(max-width:640px) 90vw, 30vw"
									className="object-contain group-hover:scale-110 transition-transform duration-500 drop-shadow-[4px_6px_12px_rgba(26,15,77,0.25)]"
								/>
							</div>
							<span
								aria-hidden="true"
								className="absolute top-4 right-4 w-8 h-8 rotate-12 rounded-sm opacity-50"
								style={{ backgroundColor: c.accent }}
							/>
						</YnsLink>
					))}
				</div>
			</div>
		</section>
	);
}
