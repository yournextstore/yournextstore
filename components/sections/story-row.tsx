import Image from "next/image";

export function StoryRow() {
	return (
		<section className="bg-yns-cream">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-20 sm:py-28">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
					<div className="lg:col-span-7 relative">
						<div className="relative aspect-[5/4] rounded-sm overflow-hidden">
							<Image
								src="/scraped-1.jpg"
								alt="A bottle of Your Next Store water resting on smooth river stone"
								fill
								sizes="(max-width: 1024px) 100vw, 60vw"
								className="object-cover"
							/>
						</div>
						<div className="absolute -bottom-6 -right-6 hidden sm:block">
							<div className="bg-yns-yellow w-24 h-24 rounded-full flex items-center justify-center text-center font-display italic text-yns-navy text-sm leading-tight rotate-[-8deg]">
								Bottled
								<br />
								at source
							</div>
						</div>
					</div>
					<div className="lg:col-span-5 lg:pl-6">
						<p className="text-[11px] tracking-[0.22em] uppercase text-yns-green font-medium">Our Water</p>
						<h2 className="mt-4 font-display text-4xl sm:text-5xl text-yns-navy leading-[1.05]">
							A quiet story, <span className="italic">told slowly.</span>
						</h2>
						<p className="mt-6 text-foreground/75 text-[15px] leading-relaxed">
							Every bottle is filled within meters of the spring it came from &mdash; never trucked, never
							treated. The result is water with the soft minerality of the bedrock it filtered through and
							absolutely nothing else.
						</p>
						<p className="mt-4 text-foreground/75 text-[15px] leading-relaxed">
							No fluoride. No chlorine. No microplastics. Just water, as the mountain made it.
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}
