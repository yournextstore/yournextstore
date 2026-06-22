import Image from "next/image";
import { YnsLink } from "../yns-link";

export function FounderStory() {
	return (
		<section
			id="story"
			className="relative bg-[var(--color-butter)] border-b-2 border-foreground/10 overflow-hidden"
		>
			<div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-20 sm:py-28 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
				{/* Left photo block */}
				<div className="lg:col-span-5 relative">
					<div className="relative aspect-[4/5] rounded-3xl overflow-hidden border-[6px] border-white shadow-[6px_6px_0_var(--color-espresso)] rotate-[-3deg]">
						<Image
							src="/scraped-2.jpg"
							alt="Vintage cow-spotted creamware on a sunny kitchen counter"
							fill
							sizes="(max-width: 1024px) 100vw, 40vw"
							className="object-cover"
						/>
					</div>
					{/* Polaroid sticker */}
					<div className="absolute -bottom-4 -right-4 sm:-right-10 sticker rotate-6 bg-white border-2 border-foreground rounded-2xl px-4 py-3 text-center max-w-[170px]">
						<p className="display text-sm uppercase leading-tight">Est. 1972</p>
						<p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">
							California, USA
						</p>
					</div>
					{/* Cobalt starburst */}
					<svg
						aria-hidden
						className="absolute -top-6 -left-6 w-20 h-20 sticker text-[var(--color-cobalt)]"
						viewBox="0 0 100 100"
					>
						<title>starburst</title>
						<g fill="currentColor">
							{Array.from({ length: 12 }, (_, i) => i).map((i) => (
								<rect
									key={`burst-${i}`}
									x="48"
									y="2"
									width="4"
									height="44"
									transform={`rotate(${i * 30} 50 50)`}
								/>
							))}
							<circle cx="50" cy="50" r="16" />
						</g>
						<text
							x="50"
							y="55"
							textAnchor="middle"
							fontSize="11"
							fontWeight="800"
							fill="white"
							fontFamily="sans-serif"
						>
							YNS
						</text>
					</svg>
				</div>

				{/* Right text block */}
				<div className="lg:col-span-7 lg:pl-8">
					<p className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--color-espresso)]/70 mb-4">
						<span className="inline-block w-8 h-px bg-current align-middle mr-3" />A note from our barn
					</p>
					<h2 className="display text-4xl sm:text-5xl lg:text-6xl uppercase leading-[0.95]">
						Made on a small{" "}
						<span className="text-[var(--color-leaf-deep)] italic relative inline-block">family farm.</span>
					</h2>
					<p className="mt-8 text-lg leading-relaxed text-foreground/80 max-w-xl">
						We started bottling lattes the same way grandma made them &mdash; one pour, one cow, one sunrise
						at a time. Every can carries milk from our herd of A2 jerseys grazing the same pasture they have
						for fifty years.
					</p>
					<p className="mt-4 text-lg leading-relaxed text-foreground/80 max-w-xl">
						No seed oils. No syrups pretending to be food. Just a happy tummy and a real good morning.
					</p>
					<div className="mt-8 flex flex-wrap items-center gap-6">
						<YnsLink
							prefetch={"eager"}
							href="/products"
							className="inline-flex items-center justify-center h-12 px-8 bg-[var(--color-espresso)] text-[var(--color-cream)] rounded-full text-sm font-bold uppercase tracking-[0.2em] hover:bg-[var(--color-espresso-deep)] transition-colors"
						>
							Taste it now
						</YnsLink>
						<div className="display text-xl italic text-foreground/70" style={{ fontStyle: "italic" }}>
							&mdash; The YNS Family
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
