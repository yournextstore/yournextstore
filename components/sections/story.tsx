import Image from "next/image";
import { YnsLink } from "../yns-link";

export function Story() {
	return (
		<section id="story" className="relative bg-[var(--background)]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
					<div className="relative">
						<div className="relative aspect-[4/5] rounded-[40px] overflow-hidden shadow-[0_30px_60px_rgba(92,27,38,0.25)]">
							<Image
								src="/scraped-4.jpg"
								alt="Cookies being iced in the kitchen"
								fill
								sizes="(max-width: 1024px) 100vw, 50vw"
								className="object-cover"
							/>
						</div>
						{/* Sticker badge */}
						<div className="absolute -top-6 -right-6 sm:-top-8 sm:-right-8 w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-[var(--candy)] text-white flex flex-col items-center justify-center text-center shadow-xl rotate-[-8deg]">
							<span className="font-script text-2xl sm:text-3xl leading-none">Since</span>
							<span className="font-display italic text-3xl sm:text-4xl leading-tight">2018</span>
							<span className="text-[10px] tracking-[0.25em] mt-1">SMALL BATCH</span>
						</div>
						{/* Tape */}
						<div className="absolute -bottom-4 left-10 w-32 h-7 bg-[var(--blush)]/70 rotate-[-6deg] rounded-sm" />
					</div>

					<div>
						<p className="text-xs font-bold tracking-[0.3em] text-[var(--candy)] uppercase">OUR STORY</p>
						<h2 className="mt-3 font-display italic text-[var(--maroon)] text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight">
							From two ovens
							<br />
							to your doorstep
						</h2>
						<p className="mt-6 text-lg text-[var(--ink)]/80 leading-relaxed">
							It started with a butter-streaked recipe card and a kitchen too small for the holidays. Today,
							Your Next Store still bakes every cookie in small batches — same recipe, same hands, just a
							slightly bigger oven.
						</p>
						<p className="mt-4 text-base text-[var(--ink)]/70 leading-relaxed">
							We use real butter, single-origin chocolate, and ingredients you can pronounce. Each box is
							packed by a person, ribboned by a person, and shipped by a person who genuinely cared whether
							the bow looked nice.
						</p>

						<div className="mt-10 grid grid-cols-3 gap-4 max-w-md">
							<div>
								<p className="font-display italic text-3xl text-[var(--candy)]">12k+</p>
								<p className="text-xs tracking-[0.18em] uppercase text-[var(--ink)]/60 mt-1">Boxes shipped</p>
							</div>
							<div>
								<p className="font-display italic text-3xl text-[var(--candy)]">4.9★</p>
								<p className="text-xs tracking-[0.18em] uppercase text-[var(--ink)]/60 mt-1">Avg. rating</p>
							</div>
							<div>
								<p className="font-display italic text-3xl text-[var(--candy)]">100%</p>
								<p className="text-xs tracking-[0.18em] uppercase text-[var(--ink)]/60 mt-1">Real butter</p>
							</div>
						</div>

						<div className="mt-10">
							<YnsLink
								href="#recipes"
								className="inline-flex items-center justify-center h-12 px-8 rounded-full border-2 border-[var(--maroon)] text-[var(--maroon)] text-sm font-bold tracking-[0.18em] uppercase hover:bg-[var(--maroon)] hover:text-white transition-colors"
							>
								Read Our Story
							</YnsLink>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
