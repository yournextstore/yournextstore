import Image from "next/image";
import { YnsLink } from "../yns-link";

export function LifestyleSplit() {
	return (
		<section id="stories" className="bg-[#F5EFE6]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				<div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
					<div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-[#E0D5C1]">
						<Image
							src="/scraped-3.jpg"
							alt="A sunlit laundry room with refill bottles and folded linens"
							fill
							sizes="(max-width: 1024px) 100vw, 50vw"
							className="object-cover"
						/>
						<div className="absolute inset-0 bg-gradient-to-t from-[#1F2A33]/20 via-transparent to-transparent" />
						<div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-3">
							<span className="script-tag text-2xl sm:text-3xl text-[#F5EFE6] drop-shadow">
								made for the everyday
							</span>
						</div>
					</div>
					<div className="lg:pl-6">
						<p className="uppercase tracking-[0.24em] text-xs text-[#6B92AC] font-semibold mb-3">Our Story</p>
						<h2 className="headline-display text-3xl sm:text-4xl lg:text-5xl text-[#1F2A33] leading-[0.95] mb-6">
							Born in a laundromat. Built for a cleaner future.
						</h2>
						<p className="text-[#3B4856] text-base sm:text-lg leading-relaxed mb-5">
							We started by asking a question nobody wanted to answer: why does laundry feel like a
							compromise? Between the harsh chemicals, the plastic waste, and the dye-stained socks, we knew
							there had to be a better way.
						</p>
						<p className="text-[#3B4856] text-base sm:text-lg leading-relaxed mb-8">
							Three years and 142 prototypes later, we landed on a formula that gets your clothes truly clean
							without the cost — to you, your fabrics, or the rivers we wash everything down into.
						</p>
						<YnsLink
							prefetch={"eager"}
							href="/products"
							className="inline-flex items-center gap-2 h-12 px-8 bg-[#1F2A33] text-[#F5EFE6] rounded-full text-sm uppercase tracking-[0.18em] font-semibold hover:bg-[#3B4856] transition-colors"
						>
							Read More
						</YnsLink>
					</div>
				</div>
			</div>
		</section>
	);
}
