import Image from "next/image";
import { YnsLink } from "../yns-link";

export function About() {
	return (
		<section id="about" className="bg-[#fbe9d7]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
					{/* Image */}
					<div className="relative">
						<div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden border border-[#1b2a2e]/10 shadow-[0_30px_80px_-30px_rgba(27,42,46,0.4)]">
							<Image
								src="/scraped-0.jpg"
								alt="Sprinkling seasoning on avocado toast"
								fill
								className="object-cover"
								sizes="(max-width: 1024px) 100vw, 50vw"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-[#1b2a2e]/30 via-transparent to-transparent" />
						</div>
						<div className="absolute -bottom-6 -left-6 hidden md:flex h-28 w-28 rotate-[-8deg] items-center justify-center rounded-full bg-[#f5a623] text-[#1b2a2e] shadow-lg">
							<span className="font-display text-center text-xs font-black uppercase leading-tight tracking-wider">
								Small
								<br />
								Batch
								<br />
								Goodness
							</span>
						</div>
					</div>

					{/* Copy */}
					<div className="relative">
						<span className="inline-flex items-center gap-2 rounded-full border border-[#1b2a2e]/15 bg-white/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#1b2a2e]">
							<span className="h-1.5 w-1.5 rounded-full bg-[#a8e0dc]" />
							Our Story
						</span>
						<h2 className="mt-4 font-display text-3xl sm:text-5xl font-black tracking-tight text-[#1b2a2e] leading-[1.05]">
							Pantry staples with a <em className="text-[#f5a623] not-italic">benefit</em> built in.
						</h2>
						<p className="mt-6 text-lg text-[#1b2a2e]/75 leading-relaxed">
							We started in a sunny kitchen, sprinkling hemp hearts and nutritional yeast on everything we
							could find. The blends took on a life of their own — and now they live in our marigold pouches.
						</p>
						<p className="mt-4 text-base text-[#1b2a2e]/70 leading-relaxed">
							Every blend is plant-based, third-party tested, and milled in small batches with farms we know
							by name. No mystery, no shortcuts — just clean ingredients you&apos;d be proud to scoop.
						</p>
						<div className="mt-8 flex flex-wrap gap-3">
							<YnsLink
								prefetch={"eager"}
								href="/products"
								className="inline-flex items-center justify-center gap-2 h-11 px-6 bg-[#1b2a2e] text-[#fbe9d7] rounded-full text-sm font-semibold hover:bg-[#0f1c1f] transition-colors"
							>
								Shop blends
							</YnsLink>
							<YnsLink
								prefetch={"eager"}
								href="/faq"
								className="inline-flex items-center justify-center h-11 px-5 text-sm font-semibold text-[#1b2a2e] underline underline-offset-4 decoration-[#f5a623] decoration-2"
							>
								Read the FAQ
							</YnsLink>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
