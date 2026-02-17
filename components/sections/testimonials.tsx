const testimonials = [
	{
		name: "Sarah M.",
		text: "Absolutely love the quality and fit! The fabric feels premium and the design is exactly what I was looking for. Will definitely be ordering more.",
		rating: 5,
	},
	{
		name: "Jessica L.",
		text: "Fast shipping and great customer service. The sweater is so cozy and looks even better in person. Perfect for the season!",
		rating: 5,
	},
	{
		name: "Emily R.",
		text: "The attention to detail is impressive. Every stitch is perfect and the colors are vibrant. My new go-to store for quality fashion.",
		rating: 5,
	},
];

function StarIcon() {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="14"
			height="14"
			viewBox="0 0 24 24"
			fill="currentColor"
			className="text-yellow-400"
		>
			<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
		</svg>
	);
}

export function Testimonials() {
	return (
		<section className="py-14 sm:py-20 bg-background">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-12">
					<h2 className="font-heading text-2xl sm:text-3xl font-medium text-foreground italic">
						Customer Say!
					</h2>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					{testimonials.map((testimonial) => (
						<div key={testimonial.name} className="text-center px-6 py-8">
							<div className="flex justify-center gap-0.5 mb-4">
								{Array.from({ length: testimonial.rating }).map((_, i) => (
									<StarIcon key={`star-${testimonial.name}-${i}`} />
								))}
							</div>
							<p className="text-sm text-muted-foreground leading-relaxed mb-4">
								&ldquo;{testimonial.text}&rdquo;
							</p>
							<p className="text-sm font-medium text-foreground">{testimonial.name}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
