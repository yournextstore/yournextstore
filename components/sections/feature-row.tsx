import Image from "next/image";
import { YnsLink } from "../yns-link";

const features = [
	{
		src: "/scraped-1.jpg",
		caption: "The Vessel",
		copy: "Refillable, mineral-cast, designed to age in place.",
	},
	{
		src: "/scraped-2.jpg",
		caption: "The Ritual",
		copy: "A quiet routine of gestures &mdash; one in the morning, one at dusk.",
	},
	{
		src: "/scraped-3.jpg",
		caption: "The Material",
		copy: "Sourced from growers we visit, finished by hands we know.",
	},
];

export function FeatureRow() {
	return (
		<section className="bg-[#ede4d3]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-14">
					{features.map((f) => (
						<YnsLink key={f.caption} href="/products" prefetch="eager" className="group block">
							<div className="relative aspect-[4/5] overflow-hidden bg-[#d9ceb6]">
								<Image
									src={f.src}
									alt={f.caption}
									fill
									sizes="(max-width: 768px) 100vw, 33vw"
									className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-[#3e2a1c]/25 via-transparent to-transparent" />
							</div>
							<div className="mt-6 text-center">
								<h3 className="font-serif text-2xl sm:text-3xl text-foreground tracking-[-0.01em]">
									{f.caption}
								</h3>
								<p
									className="mt-2 text-[14px] text-foreground/65 leading-relaxed max-w-xs mx-auto"
									dangerouslySetInnerHTML={{ __html: f.copy }}
								/>
							</div>
						</YnsLink>
					))}
				</div>
			</div>
		</section>
	);
}
