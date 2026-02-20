import Image from "next/image";

const testimonials = [
	{
		name: "Michael Smith",
		role: "Customer",
		avatar: "/scraped-3.png",
		quote:
			"Great product. Folds up really small for ease of transport. The quality is outstanding and really comfortable to use daily.",
	},
	{
		name: "John Forest",
		role: "Customer",
		avatar: "/scraped-4.png",
		quote:
			"Light-weight, compact, and beautifully designed. The materials feel premium and the craftsmanship is evident in every detail.",
	},
];

export function Testimonials() {
	return (
		<section className="bg-secondary py-16 sm:py-20">
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-12">
					{testimonials.map((testimonial) => (
						<div key={testimonial.name} className="flex flex-col items-center text-center">
							<div className="w-16 h-16 rounded-full overflow-hidden bg-muted mb-6 relative">
								<Image
									src={testimonial.avatar}
									alt={testimonial.name}
									fill
									className="object-cover"
									sizes="64px"
								/>
							</div>
							<p className="text-sm leading-relaxed text-muted-foreground italic mb-6">
								&ldquo;{testimonial.quote}&rdquo;
							</p>
							<div>
								<p className="text-sm font-medium">{testimonial.name}</p>
								<p className="text-xs text-muted-foreground">{testimonial.role}</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
