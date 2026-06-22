import Image from "next/image";
import { YnsLink } from "../yns-link";

const cards = [
	{
		title: "Valentine's Boxes",
		caption: "Cookies + ribbons + a hand-written note",
		image: "/scraped-2.jpg",
		href: "/products?tags=valentines",
		ribbon: "NEW",
	},
	{
		title: "Heart-Iced Sweets",
		caption: "Pink-frosted hearts & sugar cookies",
		image: "/scraped-1.jpg",
		href: "/products?tags=hearts",
	},
	{
		title: "Pantry Restock",
		caption: "Chocolate chunk, oatmeal, and snickerdoodle by the dozen",
		image: "/scraped-3.jpg",
		href: "/products?tags=pantry",
	},
];

export function GiftCollections() {
	return (
		<section id="gifts" className="bg-cream-paper">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
				<div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
					<div>
						<p className="text-xs font-bold tracking-[0.3em] text-[var(--candy)] uppercase">SEND A GIFT</p>
						<h2 className="mt-3 font-display italic text-[var(--maroon)] text-4xl sm:text-5xl lg:text-6xl tracking-tight">
							Sweet, ribboned, ready to ship
						</h2>
					</div>
					<p className="max-w-md text-[var(--ink)]/70 leading-relaxed">
						Each box is packed by hand, tucked in tissue, tied with a satin ribbon, and shipped with a
						hand-written card to the doorstep you choose.
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					{cards.map((card) => (
						<YnsLink
							prefetch={"eager"}
							key={card.title}
							href={card.href}
							className="group relative overflow-hidden rounded-3xl bg-[var(--candy)] aspect-[4/5] shadow-[0_18px_40px_rgba(92,27,38,0.18)]"
						>
							<Image
								src={card.image}
								alt={card.title}
								fill
								sizes="(max-width: 768px) 100vw, 33vw"
								className="object-cover transition-transform duration-700 group-hover:scale-105"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-[var(--maroon)]/85 via-[var(--maroon)]/20 to-transparent" />
							{card.ribbon && (
								<span className="absolute top-5 left-5 inline-flex items-center px-3 py-1 rounded-full bg-[var(--cream)] text-[var(--candy)] text-[10px] tracking-[0.25em] font-bold">
									{card.ribbon}
								</span>
							)}
							<div className="absolute inset-x-0 bottom-0 p-6 text-white">
								<h3 className="font-display italic text-3xl sm:text-4xl leading-tight">{card.title}</h3>
								<p className="mt-2 text-sm text-white/85">{card.caption}</p>
								<span className="mt-4 inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase">
									Shop now
									<svg
										className="w-4 h-4 transition-transform group-hover:translate-x-1"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
									>
										<title>arrow</title>
										<path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
									</svg>
								</span>
							</div>
						</YnsLink>
					))}
				</div>
			</div>
		</section>
	);
}
