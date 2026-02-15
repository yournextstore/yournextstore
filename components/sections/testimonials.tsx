import { Star } from "lucide-react";

const reviews = [
	{
		text: "This hot sauce is the perfect blend of heat and flavor. It's become a kitchen staple, enhancing every dish without overpowering it. Highly recommend to all spice lovers!",
		author: "Auguste Gusteau",
	},
	{
		text: "Discovering this brand's pantry items has been a game-changer. The variety and quality are unmatched, making it easy to create delicious meals. The hot sauces add just the right kick!",
		author: "Lucy, Pasta Queen",
	},
	{
		text: "This brand has transformed my culinary experience! The pantry essentials and hot sauces are top-notch, adding robust flavors to my dishes. I'm officially hooked!",
		author: "Carmy Berzatto",
	},
];

export function Testimonials() {
	return (
		<section className="py-16 sm:py-24 bg-[#ff2524] text-white overflow-hidden">
			<div className="max-w-[1820px] mx-auto px-5 sm:px-8 lg:px-10">
				<h2 className="font-[family-name:var(--font-prompt)] text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-center mb-16">
					Word on the street
				</h2>
			</div>

			<div className="flex animate-marquee whitespace-nowrap">
				{Array.from({ length: 2 }).map((_, setIndex) => (
					<div key={`review-set-${setIndex}`} className="flex shrink-0 gap-6 px-3">
						{reviews.map((review) => (
							<div
								key={`${setIndex}-${review.author}`}
								className="w-[350px] sm:w-[400px] shrink-0 bg-white text-black rounded-md border-[3px] border-black p-6 shadow-[6px_6px_0_0_#000] whitespace-normal"
							>
								<div className="flex gap-1 mb-4">
									{Array.from({ length: 5 }).map((_, i) => (
										<Star
											key={`star-${review.author}-${i}`}
											className="h-5 w-5 fill-[#ffda22] text-[#ffda22]"
										/>
									))}
								</div>
								<p className="text-sm leading-relaxed mb-4">&ldquo;{review.text}&rdquo;</p>
								<p className="text-sm font-bold">{review.author}</p>
							</div>
						))}
					</div>
				))}
			</div>
		</section>
	);
}
