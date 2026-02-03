import Image from "next/image";
import { MaterialIcon } from "@/components/icons/material-icon";
import { YnsLink } from "@/components/yns-link";

export function AboutSection() {
	return (
		<section className="py-24 bg-background overflow-hidden">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex flex-col lg:flex-row items-center gap-16">
					{/* Left Column - Image */}
					<div className="w-full lg:w-1/2 relative">
						<div className="absolute -top-10 -left-10 w-32 h-32 bg-primary/20 rounded-full blur-2xl z-0" />
						<div className="absolute -bottom-10 -right-10 w-40 h-40 bg-secondary/10 rounded-full blur-2xl z-0" />
						<div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-transform duration-500">
							<Image
								src="https://lh3.googleusercontent.com/aida-public/AB6AXuBbJ_AdHi6jyGpg34J9gEHIfWQwOtj1z1Wtlj8ANeFcVH_fryBj9tWp04zFYovISHKNHlAlc3-wSGfDyp99Fgot9-ZWPP_xYbggCNyua62B1w7vK9SjNWhLIZ4QIi_LHBmugHx3gU4Tr6pj8gmhCjFIWS9D0D2RO3BcQZFZub_2kADQWCH8rORtE3-5UyHvy5ME7vV3P5IjMkOl8MXRkCzImqpFzqwVkkDq08hQVZ62R2ZIfweBNHsAEmwwUqRfZNdDKh87liUjVI_N"
								alt="Person enjoying nature in a hemp field"
								width={600}
								height={450}
								className="w-full h-auto object-cover"
							/>
							<div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-8">
								<p className="text-white font-medium italic">&quot;Nature is the greatest healer.&quot;</p>
							</div>
						</div>
					</div>

					{/* Right Column - Content */}
					<div className="w-full lg:w-1/2 lg:pl-8">
						<span className="text-primary font-semibold text-sm tracking-wider uppercase mb-2 block">
							Our Brand
						</span>
						<h2 className="text-4xl lg:text-5xl font-bold mb-6 text-foreground leading-tight">
							Premium Quality, <br />
							<span className="text-primary">Purely Natural.</span>
						</h2>
						<div className="space-y-6 text-muted-foreground text-lg leading-relaxed">
							<p>
								At Cannabo, we believe in the transformative power of nature. Our journey began with a simple
								mission: to provide the cleanest, most effective CBD products on the market, free from
								synthetic additives and harmful chemicals.
							</p>
							<p>
								Every drop of our oil is sourced from organically grown hemp, cultivated under the sun in
								nutrient-rich soil. We prioritize transparency above all else, which is why every batch is
								rigorously third-party lab tested to ensure potency and purity you can trust.
							</p>
							<p>
								From seed to shelf, our process is designed to preserve the full spectrum of beneficial
								cannabinoids and terpenes. Experience the difference that true dedication to quality makes in
								your wellness routine.
							</p>
						</div>

						{/* Stats */}
						<div className="mt-10 flex items-center space-x-8">
							<div className="flex flex-col">
								<span className="text-3xl font-bold text-foreground">10k+</span>
								<span className="text-sm text-muted-foreground">Happy Customers</span>
							</div>
							<div className="w-px h-12 bg-border" />
							<div className="flex flex-col">
								<span className="text-3xl font-bold text-foreground">100%</span>
								<span className="text-sm text-muted-foreground">Organic Hemp</span>
							</div>
						</div>

						{/* Read More Link */}
						<div className="mt-10">
							<YnsLink
								href="#"
								className="inline-flex items-center text-primary font-semibold hover:text-green-600 transition-colors group"
							>
								Read Our Full Story
								<MaterialIcon
									name="arrow_forward"
									className="ml-2 group-hover:translate-x-1 transition-transform"
								/>
							</YnsLink>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
