import Image from "next/image";
import { YnsLink } from "../yns-link";

export function Hero() {
	return (
		<section className="relative overflow-hidden bg-[#ffda22]">
			<div className="max-w-[1820px] mx-auto">
				<div className="grid lg:grid-cols-2 min-h-[500px] lg:min-h-[600px]">
					{/* Left: Text content */}
					<div className="flex flex-col justify-center px-8 sm:px-12 lg:px-16 py-12 lg:py-20 relative z-10">
						<div className="inline-flex items-center gap-2 mb-6">
							<span className="bg-[#5aff24] text-black text-xs font-bold uppercase px-3 py-1.5 rounded-full border-2 border-black shadow-[3px_3px_0_0_#000]">
								Hot stuff!
							</span>
						</div>
						<h1 className="font-[family-name:var(--font-prompt)] text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black uppercase leading-[0.9] tracking-tight text-black">
							Full of
							<br />
							<span className="text-[#ff2524]">Flavour</span>
						</h1>
						<p className="mt-6 text-lg sm:text-xl text-black/70 max-w-md leading-relaxed">
							Everyday pantry goods for the everyday chef.
						</p>
						<div className="mt-8 flex flex-col sm:flex-row gap-4">
							<YnsLink
								prefetch={"eager"}
								href="#products"
								className="inline-flex items-center justify-center gap-2 h-14 px-10 bg-black text-white rounded-full text-base font-bold uppercase tracking-wide border-[3px] border-black shadow-[4px_4px_0_0_rgba(0,0,0,0.2)] hover:shadow-[2px_2px_0_0_rgba(0,0,0,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
							>
								Shop Now
							</YnsLink>
						</div>
					</div>

					{/* Right: Hero image */}
					<div className="relative min-h-[300px] lg:min-h-0">
						<Image
							src="/scraped-0.jpg"
							alt="Delicious food made with Your Next Store products"
							fill
							className="object-cover"
							priority
						/>
						{/* Floating product sticker */}
						<div className="absolute bottom-8 left-8 w-32 h-32 sm:w-40 sm:h-40 rotate-[-8deg] rounded-md border-[3px] border-black shadow-[6px_6px_0_0_#000] overflow-hidden">
							<Image src="/scraped-3.jpg" alt="Featured product" fill className="object-cover" />
						</div>
					</div>
				</div>
			</div>

			{/* Marquee badge strip */}
			<div className="bg-black text-white py-3 overflow-hidden border-t-[3px] border-black">
				<div className="flex animate-marquee whitespace-nowrap">
					{Array.from({ length: 2 }).map((_, setIndex) => (
						<div key={`marquee-set-${setIndex}`} className="flex shrink-0">
							{["Low salt", "No bad stuff", "Organic", "Non-GMO", "No fake stuff", "Low carb"].map(
								(badge) => (
									<span
										key={`${setIndex}-${badge}`}
										className="mx-8 text-sm font-bold uppercase tracking-widest font-[family-name:var(--font-prompt)]"
									>
										{badge}
									</span>
								),
							)}
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
