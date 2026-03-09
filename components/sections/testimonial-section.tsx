import Image from "next/image";

export function TestimonialSection() {
	return (
		<section className="py-20 sm:py-28 bg-background">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
					{/* Left: Image */}
					<div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-secondary max-w-md mx-auto lg:mx-0">
						<Image
							src="/scraped-5.png"
							alt="Customer testimonial"
							fill
							className="object-cover"
							sizes="(max-width: 1024px) 100vw, 50vw"
						/>
					</div>

					{/* Right: Quote */}
					<div className="space-y-8">
						<span className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium">
							Our Feature
						</span>
						<blockquote className="text-2xl sm:text-3xl font-light text-foreground leading-relaxed">
							&ldquo;The design enables the studio&apos;s work to take center stage, while serving the
							users&rdquo;
						</blockquote>

						{/* Testimonial cards */}
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
							{testimonials.map((t) => (
								<div key={t.name} className="flex items-center gap-3 p-4 rounded-xl bg-secondary/50">
									<div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
										{t.name.charAt(0)}
									</div>
									<div>
										<p className="text-sm font-medium text-foreground">{t.name}</p>
										<p className="text-xs text-muted-foreground">{t.role}</p>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

const testimonials = [
	{ name: "Daniel Simon", role: "Fitness Enthusiast" },
	{ name: "Sarah Chen", role: "Outdoor Explorer" },
	{ name: "Mike Torres", role: "Coffee Lover" },
	{ name: "Emma Wilson", role: "Yoga Instructor" },
];
