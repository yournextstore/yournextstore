import Image from "next/image";

function IgIcon({ className = "h-4 w-4" }: { className?: string }) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.8"
			className={className}
			aria-hidden
		>
			<rect x="3" y="3" width="18" height="18" rx="5" />
			<circle cx="12" cy="12" r="4" />
			<circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
		</svg>
	);
}

const tiles = [
	{ src: "/scraped-1.jpg", caption: "@morningfuel", label: "Pre-hike fuel" },
	{ src: "/scraped-2.jpg", caption: "@deskdwellers", label: "3pm rescue" },
	{ src: "/scraped-3.jpg", caption: "@grainsandbowls", label: "Bowl topper" },
	{ src: "/scraped-4.jpg", caption: "@trailgang", label: "Summit snack" },
	{ src: "/scraped-5.jpg", caption: "@spicecabinet", label: "Heat seeker" },
	{ src: "/scraped-0.jpg", caption: "@noondrop", label: "Lunch upgrade" },
];

export function Community() {
	return (
		<section className="bg-rose/30 py-16 sm:py-24">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
					<div>
						<p className="font-display text-[11px] tracking-[0.32em] uppercase text-chili">
							The snack community
						</p>
						<h2 className="mt-3 font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold uppercase text-charcoal">
							Tag us. Get featured.
						</h2>
					</div>
					<a
						href="https://instagram.com"
						target="_blank"
						rel="noreferrer"
						className="inline-flex items-center gap-2 text-sm font-semibold text-mahogany hover:text-chili transition-colors"
					>
						<IgIcon className="h-4 w-4" />
						<span className="font-display uppercase tracking-[0.18em]">@yournextstore</span>
					</a>
				</div>

				<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
					{tiles.map((t, i) => (
						<a
							key={`${t.caption}-${i}`}
							href="https://instagram.com"
							target="_blank"
							rel="noreferrer"
							className="group relative aspect-square overflow-hidden rounded-2xl border border-charcoal/10 bg-card"
						>
							<Image
								src={t.src}
								alt={t.label}
								fill
								sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
								className="object-cover transition-transform duration-500 group-hover:scale-110"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
							<div className="absolute inset-x-2 bottom-2 flex items-center justify-between text-cream opacity-0 group-hover:opacity-100 transition-opacity">
								<span className="text-[10px] font-semibold uppercase tracking-widest">{t.label}</span>
								<IgIcon className="h-3.5 w-3.5" />
							</div>
						</a>
					))}
				</div>
			</div>
		</section>
	);
}
