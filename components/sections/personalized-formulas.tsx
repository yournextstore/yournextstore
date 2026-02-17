import Image from "next/image";
import { YnsLink } from "@/components/yns-link";

export function PersonalizedFormulas() {
	return (
		<section className="relative overflow-hidden">
			<div className="relative h-[50vh] min-h-[350px] sm:h-[55vh]">
				<Image
					src="/scraped-11.png"
					alt="Personalized formulas tailored just for you"
					fill
					className="object-cover"
					sizes="100vw"
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
				<div className="absolute inset-0 flex items-end justify-center pb-12 sm:pb-16">
					<div className="max-w-2xl px-4 text-center">
						<h2 className="font-heading text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
							Personalized Formulas Tailored Just for You
						</h2>
						<p className="mt-4 text-sm text-white/80 sm:text-base">
							Our formulas are carefully crafted to work best for you, with only the essential ingredients
							needed for great results.
						</p>
						<div className="mt-6">
							<YnsLink
								prefetch={"eager"}
								href="/products"
								className="inline-block bg-white px-8 py-3 text-sm font-semibold uppercase tracking-widest text-brand-dark transition-colors hover:bg-brand-cream"
							>
								Shop Now
							</YnsLink>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
