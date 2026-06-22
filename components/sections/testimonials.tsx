const REVIEWS = [
	{
		quote:
			"My colorist asked what I was using. I told her. Now she stocks it. The bounce is unreal — my hair has never felt this healthy after bleach.",
		name: "Maya R.",
		role: "Verified buyer · Brooklyn, NY",
	},
	{
		quote:
			"I bought the trio expecting it to last a month. It’s been three. A little goes a very long way, and my blowouts hold for five days.",
		name: "Imani T.",
		role: "Verified buyer · Austin, TX",
	},
	{
		quote:
			"The bottles look gorgeous, but it’s the smell — soft, clean, expensive — that keeps me reordering. My partner stole the shampoo within a week.",
		name: "Sophie L.",
		role: "Verified buyer · London, UK",
	},
];

const Star = () => (
	<svg viewBox="0 0 24 24" className="h-4 w-4 fill-yns-ink" aria-hidden="true">
		<title>star</title>
		<path d="M12 2l2.92 6.91 7.08.66-5.4 4.79 1.7 7.14L12 17.77 5.7 21.5l1.7-7.14L2 9.57l7.08-.66L12 2z" />
	</svg>
);

export function Testimonials() {
	return (
		<section
			className="relative overflow-hidden"
			style={{
				background: "linear-gradient(135deg, #f8b6c8 0%, #e9d6e4 45%, #c9b6e0 100%)",
			}}
		>
			<div className="absolute inset-0 yns-grain pointer-events-none" aria-hidden="true" />
			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				<div className="text-center mb-16">
					<p className="text-[11px] tracking-[0.24em] uppercase font-bold text-yns-ink/70">
						Salon-Tested, Bathroom-Approved
					</p>
					<h2 className="mt-4 yns-display text-4xl sm:text-5xl text-yns-ink not-italic uppercase">
						Loved by 50,000+
					</h2>
				</div>
				<div className="grid md:grid-cols-3 gap-6 lg:gap-8">
					{REVIEWS.map(({ quote, name, role }) => (
						<figure
							key={name}
							className="rounded-[28px] bg-yns-cream/95 backdrop-blur p-8 shadow-[0_30px_60px_-30px_rgba(27,27,27,0.25)]"
						>
							<div className="flex gap-0.5 mb-5">
								{Array.from({ length: 5 }).map((_, i) => (
									<Star key={`s-${i}`} />
								))}
							</div>
							<blockquote className="text-base leading-relaxed text-yns-ink/85 italic font-light">
								&ldquo;{quote}&rdquo;
							</blockquote>
							<figcaption className="mt-6">
								<p className="text-[11px] tracking-[0.18em] uppercase font-bold text-yns-ink">{name}</p>
								<p className="text-[11px] mt-1 text-yns-ink/60">{role}</p>
							</figcaption>
						</figure>
					))}
				</div>
			</div>
		</section>
	);
}
