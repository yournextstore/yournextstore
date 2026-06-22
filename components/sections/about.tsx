import { YnsLink } from "../yns-link";

export function About() {
	return (
		<section id="about" className="bg-background">
			<div className="mx-auto max-w-[1600px] px-6 py-24 lg:px-10">
				<div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
					<div className="lg:col-span-5">
						<p className="eyebrow text-mushroom">Our Atelier</p>
						<h2 className="mt-3 font-display text-3xl text-foreground sm:text-4xl lg:text-[44px] lg:leading-[1.1] lg:tracking-[-0.02em]">
							A quieter approach to modern dressing.
						</h2>
					</div>
					<div className="lg:col-span-7 lg:pt-3">
						<p className="text-base leading-relaxed text-mushroom lg:text-[17px]">
							At Your Next Store, we design with intention. Every silhouette is patterned in our studio,
							considered against the body, and then refined again — slower than the seasons, but built to live
							alongside them.
						</p>
						<p className="mt-5 text-base leading-relaxed text-mushroom lg:text-[17px]">
							We work with mills who care about how cloth feels in the hand and how it lasts in the closet.
							Double-faced wools, fine merinos, brushed cottons, and supple leathers — chosen for the way they
							soften with time.
						</p>
						<div className="mt-8 flex items-center gap-6">
							<YnsLink
								prefetch={"eager"}
								href="/products"
								className="text-sm font-medium text-foreground underline underline-offset-[6px] decoration-[1px] hover:decoration-2 transition-all"
							>
								Our Story
							</YnsLink>
							<YnsLink
								prefetch={"eager"}
								href="/products"
								className="text-sm font-medium text-foreground underline underline-offset-[6px] decoration-[1px] hover:decoration-2 transition-all"
							>
								Materials & Care
							</YnsLink>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
