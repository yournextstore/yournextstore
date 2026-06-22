import Image from "next/image";
import { YnsLink } from "../yns-link";

const flavors = [
	{
		name: "Apple & Blackcurrant",
		tagline: "Crisp orchard meets dark berry",
		image: "/scraped-0.jpg",
		bg: "bg-fizz-blush",
		ink: "text-fizz-berry",
		href: "/products",
	},
	{
		name: "Watermelon & Mint",
		tagline: "Poolside in a can",
		image: "/scraped-1.jpg",
		bg: "bg-fizz-aqua",
		ink: "text-fizz-berry",
		href: "/products",
	},
	{
		name: "Peach",
		tagline: "Sunset on the rocks",
		image: "/scraped-2.jpg",
		bg: "bg-fizz-yellow-soft",
		ink: "text-fizz-berry",
		href: "/products",
	},
];

export function FlavorLineup() {
	return (
		<section id="flavors" className="bg-background py-16 sm:py-24">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12 gap-4">
					<div>
						<p className="text-xs uppercase tracking-[0.35em] font-bold text-fizz-sky mb-3">The Line-Up</p>
						<h2 className="font-display text-fizz-ink uppercase text-3xl sm:text-5xl leading-[0.95] tracking-tight">
							Three flavors,
							<br />
							zero compromise.
						</h2>
					</div>
					<YnsLink
						prefetch={"eager"}
						href="/products"
						className="self-start sm:self-end inline-flex items-center justify-center px-6 h-11 rounded-full bg-fizz-berry text-white text-sm font-bold hover:bg-fizz-berry/90 transition-colors"
					>
						Browse all
					</YnsLink>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
					{flavors.map((flavor) => (
						<YnsLink
							prefetch={"eager"}
							key={flavor.name}
							href={flavor.href}
							className={`group relative overflow-hidden rounded-[2rem] ${flavor.bg} sticker-shadow aspect-[3/4] flex flex-col`}
						>
							<div className="relative flex-1 overflow-hidden">
								<Image
									src={flavor.image}
									alt={flavor.name}
									fill
									sizes="(max-width: 640px) 100vw, 33vw"
									className="object-cover transition-transform duration-700 group-hover:scale-105 mix-blend-multiply opacity-90"
								/>
								<div className="absolute top-5 left-5 inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/85 backdrop-blur text-fizz-ink text-xs font-bold">
									NEW
								</div>
							</div>
							<div className="relative p-6 bg-white/85 backdrop-blur-sm">
								<h3
									className={`font-display ${flavor.ink} uppercase text-xl sm:text-2xl tracking-tight leading-tight`}
								>
									{flavor.name}
								</h3>
								<p className="mt-1 text-sm text-fizz-ink/70 font-medium">{flavor.tagline}</p>
								<div className="mt-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-fizz-sky">
									Shop flavor
									<svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
										<path
											d="M5 12h14M13 5l7 7-7 7"
											stroke="currentColor"
											strokeWidth="2.5"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
								</div>
							</div>
						</YnsLink>
					))}
				</div>
			</div>
		</section>
	);
}
