function Stars() {
	return (
		<span className="inline-flex items-center gap-0.5 text-terracotta" aria-hidden="true">
			{Array.from({ length: 5 }).map((_, i) => (
				<svg
					key={`star-${i}`}
					width="12"
					height="12"
					viewBox="0 0 24 24"
					fill="currentColor"
					className="opacity-90"
				>
					<title>Star</title>
					<path d="M12 2l2.92 6.26L22 9.27l-5.5 4.85L18.18 22 12 18.27 5.82 22l1.68-7.88L2 9.27l7.08-1.01z" />
				</svg>
			))}
		</span>
	);
}

const testimonials = [
	{ author: "J.R.", quote: "Energy levels increased." },
	{ author: "Carolyn H.", quote: "Highly recommend." },
	{ author: "Michael S.", quote: "P24 is a game-changer." },
	{ author: "Allison", quote: "No more 3pm melt down." },
	{ author: "Kelsey C.", quote: "Restful sleep!" },
	{ author: "D.M.", quote: "More recovery, less soreness." },
	{ author: "S.P.", quote: "I feel sharper at work." },
	{ author: "Anne T.", quote: "Genuinely the real deal." },
];

function MarqueeRow() {
	return (
		<div className="flex shrink-0 items-center gap-10 px-5">
			{testimonials.map((t) => (
				<div key={t.author} className="flex items-center gap-4 whitespace-nowrap">
					<Stars />
					<span className="text-[11px] tracking-[0.22em] uppercase font-semibold text-ink/80">
						{t.author}
					</span>
					<span className="text-sm text-ink/70 font-medium tracking-wide">“{t.quote}”</span>
				</div>
			))}
		</div>
	);
}

export function TestimonialMarquee() {
	return (
		<section className="relative bg-[color:var(--cream)] border-y border-border/50 overflow-hidden marquee-pause">
			<div className="marquee py-5">
				<MarqueeRow />
				<MarqueeRow />
			</div>
			{/* Edge fades */}
			<div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[color:var(--cream)] to-transparent" />
			<div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[color:var(--cream)] to-transparent" />
		</section>
	);
}
