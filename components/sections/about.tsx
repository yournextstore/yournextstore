import Image from "next/image";
import { YnsLink } from "../yns-link";

export function About() {
	return (
		<section id="about" className="relative overflow-hidden bg-[#1f46c2] text-[#f5e4d2]">
			{/* Decorative sun in corner */}
			<div
				aria-hidden="true"
				className="absolute -top-24 -right-24 w-[420px] h-[420px] rounded-full bg-[#e8b547]/25 blur-3xl"
			/>
			<div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-20 sm:py-28">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
					{/* Image side */}
					<div className="lg:col-span-5 relative">
						<div className="relative aspect-[4/5] overflow-hidden border-[6px] border-[#f5e4d2] shadow-[0_30px_50px_-20px_rgba(0,0,0,0.4)] -rotate-[2deg]">
							<Image
								src="/scraped-4.jpg"
								alt="A long lakeside lunch"
								fill
								sizes="(max-width: 1024px) 100vw, 40vw"
								className="object-cover"
							/>
							<div className="absolute inset-0 bg-[#e8b547]/10 mix-blend-multiply" />
						</div>
						<div className="absolute -bottom-4 -right-4 sm:-right-6 px-5 py-2 bg-[#d8351f] text-[#f5e4d2] uppercase font-display tracking-[0.2em] text-xs sm:text-sm rotate-[3deg]">
							Liguria, 1974
						</div>
					</div>

					{/* Copy side */}
					<div className="lg:col-span-7">
						<p className="font-script text-[#e8b547] text-2xl sm:text-3xl leading-none">our story</p>
						<h2 className="mt-2 font-display text-4xl sm:text-5xl lg:text-[64px] uppercase leading-[0.95] tracking-wide">
							Built for
							<br />
							the <span className="italic text-[#e8b547]">long</span> afternoon.
						</h2>
						<div className="mt-7 max-w-xl space-y-5 text-[15px] text-[#f5e4d2]/85 leading-relaxed">
							<p>
								Your Next Store was assembled from notebooks, ferry tickets and postcards — the kind of small
								papers you keep in a drawer because they smell of a particular August.
							</p>
							<p>
								Every object we stock is chosen the same way you&apos;d choose a place to swim: slowly, and
								with one eye on the light. We work with small makers, single workshops, and very patient
								couriers.
							</p>
						</div>

						<div className="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8 max-w-xl">
							<div>
								<p className="font-display text-3xl sm:text-4xl text-[#e8b547]">12 yrs</p>
								<p className="mt-1 text-[11px] uppercase tracking-[0.22em] text-[#f5e4d2]/60">in the shop</p>
							</div>
							<div>
								<p className="font-display text-3xl sm:text-4xl text-[#e8b547]">38</p>
								<p className="mt-1 text-[11px] uppercase tracking-[0.22em] text-[#f5e4d2]/60">small makers</p>
							</div>
							<div>
								<p className="font-display text-3xl sm:text-4xl text-[#e8b547]">1</p>
								<p className="mt-1 text-[11px] uppercase tracking-[0.22em] text-[#f5e4d2]/60">
									very slow van
								</p>
							</div>
						</div>

						<div className="mt-10 flex flex-wrap gap-3">
							<YnsLink
								prefetch={"eager"}
								href="/products"
								className="inline-flex items-center justify-center gap-2 h-12 px-7 bg-[#e8b547] text-[#1f46c2] uppercase tracking-[0.22em] text-[11px] font-medium hover:bg-[#f5e4d2] transition-colors rounded-full"
							>
								Browse the shop
								<span aria-hidden>→</span>
							</YnsLink>
							<YnsLink
								prefetch={"eager"}
								href="/faq"
								className="inline-flex items-center justify-center gap-2 h-12 px-7 border border-[#f5e4d2]/40 text-[#f5e4d2] uppercase tracking-[0.22em] text-[11px] font-medium hover:bg-[#f5e4d2]/10 transition-colors rounded-full"
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
