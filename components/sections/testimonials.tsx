import Image from "next/image";

const testimonialImages = [
	"/scraped-5.png",
	"/scraped-6.png",
	"/scraped-7.png",
	"/scraped-14.png",
	"/scraped-2.png",
];

const testimonials = [
	{
		name: "James L.",
		location: "Los Angeles, CA",
		quote: "Couldn't be happier with the service I received from this company.",
		image: testimonialImages[0],
	},
	{
		name: "Rachel F.",
		location: "Toronto, ON",
		quote: "Really went out of their way to make me feel special as a customer, highly recommend!",
		image: testimonialImages[1],
	},
	{
		name: "Sam R.",
		location: "Brooklyn, NY",
		quote: "Fantastic fabrics, great fit and no issues going through the laundry either!",
		image: testimonialImages[2],
	},
	{
		name: "Matt C.",
		location: "Montreal, QC",
		quote: "Couldn't be happier with the service I received from this company.",
		image: testimonialImages[3],
	},
	{
		name: "Sharon S.",
		location: "New Orleans, LA",
		quote: "Arrived fast and beautifully boxed. They even let me model on their site :)",
		image: testimonialImages[4],
	},
];

function StarRating() {
	return (
		<div className="flex gap-0.5 text-foreground mb-4">
			{Array.from({ length: 5 }).map((_, i) => (
				<svg key={`star-${i}`} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
					<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
				</svg>
			))}
		</div>
	);
}

export function Testimonials() {
	return (
		<section className="py-16 sm:py-24 bg-[#f5f5f0]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<h2 className="font-heading text-2xl sm:text-3xl font-bold text-center mb-12">
					Don&apos;t take our word for it
				</h2>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
					{testimonials.map((testimonial) => (
						<div key={testimonial.name} className="bg-white p-6 flex flex-col items-center text-center">
							<StarRating />
							<p className="text-sm text-muted-foreground leading-relaxed mb-6 italic">
								&ldquo;{testimonial.quote}&rdquo;
							</p>
							<div className="relative w-12 h-12 rounded-full overflow-hidden mb-3">
								<Image
									src={testimonial.image}
									alt={testimonial.name}
									fill
									className="object-cover"
									sizes="48px"
								/>
							</div>
							<p className="text-sm font-semibold">{testimonial.name}</p>
							<p className="text-xs text-muted-foreground">{testimonial.location}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
