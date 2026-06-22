import Image from "next/image";
import { Leaf, Monstera } from "./leaves";

export function Founders() {
	return (
		<section className="relative overflow-hidden bg-forest text-cream">
			<div className="absolute -top-12 -left-10 opacity-30">
				<Monstera className="w-72 h-64" color="#2e7d3a" />
			</div>
			<div className="absolute -bottom-16 -right-10 opacity-30 rotate-180">
				<Monstera className="w-80 h-72" color="#2e7d3a" />
			</div>
			<div className="absolute top-16 right-20 opacity-50">
				<Leaf className="w-10 h-14 leaf-sway" color="#f4a03a" />
			</div>

			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
				<div className="relative">
					<div className="relative aspect-[4/5] overflow-hidden rounded-[44px] border-4 border-cream/20">
						<Image
							src="/scraped-5.jpg"
							alt="Founders preparing plant-based snacks on a sunny porch"
							fill
							sizes="(max-width: 1024px) 100vw, 50vw"
							className="object-cover"
						/>
					</div>
					<div className="absolute -bottom-6 -left-6 bg-marigold text-forest px-6 py-3 rounded-full font-display uppercase tracking-[0.2em] text-sm shadow-lg">
						est. 2026
					</div>
				</div>

				<div>
					<p className="font-display uppercase tracking-[0.32em] text-marigold text-sm">From our kitchen</p>
					<h2 className="font-display uppercase text-4xl sm:text-5xl lg:text-6xl mt-3 leading-[0.95]">
						Snacks that feel like a&nbsp;hug from a friend
					</h2>
					<blockquote className="mt-8 text-lg sm:text-xl leading-relaxed text-cream/80 border-l-2 border-marigold pl-6 italic">
						&ldquo;We started Your Next Store because the table is better when nobody has to pass on the good
						stuff. Every flavor we ship is something we&apos;d serve at our own family dinner — without an
						asterisk.&rdquo;
					</blockquote>
					<p className="mt-6 font-display uppercase tracking-[0.22em] text-sm text-cream/70">
						— The YNS Crew
					</p>

					<div className="mt-10 grid grid-cols-3 gap-4 max-w-md">
						{[
							{ stat: "12k+", label: "Happy snackers" },
							{ stat: "4.9★", label: "Avg. rating" },
							{ stat: "0", label: "Compromises" },
						].map((item) => (
							<div key={item.label} className="border-t border-cream/20 pt-3">
								<div className="font-display text-3xl text-marigold">{item.stat}</div>
								<div className="text-xs uppercase tracking-[0.18em] text-cream/60 mt-1">{item.label}</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
