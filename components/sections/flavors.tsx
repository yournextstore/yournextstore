import { ArrowUpRightIcon } from "lucide-react";
import Image from "next/image";
import { YnsLink } from "../yns-link";

const flavorCards = [
	{
		title: "Midnight Citrus",
		tag: "Bold · Sharp",
		image: "/scraped-3.jpg",
		href: "/products",
	},
	{
		title: "Frost Lime",
		tag: "Crisp · Cold",
		image: "/scraped-4.jpg",
		href: "/products",
	},
	{
		title: "Black Berry Nitro",
		tag: "Dark · Smooth",
		image: "/scraped-5.jpg",
		href: "/products",
	},
];

export function Flavors() {
	return (
		<section className="relative bg-black py-20 sm:py-28 overflow-hidden">
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(255,193,7,0.08),transparent_60%)]"
			/>
			<div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
					<div className="max-w-xl">
						<p className="text-[11px] uppercase tracking-[0.22em] text-white/40">Pick your vibe</p>
						<h2 className="font-display mt-3 text-4xl sm:text-5xl text-white">
							Three drops.
							<br />
							<span className="text-[var(--color-yns-yellow)]">Zero compromise.</span>
						</h2>
					</div>
					<YnsLink
						prefetch={"eager"}
						href="/products"
						className="inline-flex items-center gap-2 self-start text-sm font-medium text-white/70 hover:text-white transition-colors"
					>
						See the whole lineup
						<ArrowUpRightIcon className="h-4 w-4" />
					</YnsLink>
				</div>

				<div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
					{flavorCards.map((card, i) => (
						<YnsLink
							prefetch={"eager"}
							key={card.title}
							href={card.href}
							className="group relative aspect-[4/5] overflow-hidden rounded-3xl border border-white/10 bg-[#0c0c0c]"
						>
							<Image
								src={card.image}
								alt={card.title}
								fill
								sizes="(max-width: 640px) 100vw, 33vw"
								className="object-cover opacity-80 transition-all duration-700 group-hover:scale-105 group-hover:opacity-100"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
							<div className="absolute top-4 left-4 yns-chip rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-white/80">
								0{i + 1}
							</div>
							<div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
								<div>
									<p className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-yns-yellow)]">
										{card.tag}
									</p>
									<h3 className="font-display mt-1 text-2xl sm:text-3xl text-white">{card.title}</h3>
								</div>
								<span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-black transition-transform duration-500 group-hover:rotate-45">
									<ArrowUpRightIcon className="h-4 w-4" strokeWidth={2.5} />
								</span>
							</div>
						</YnsLink>
					))}
				</div>
			</div>
		</section>
	);
}
