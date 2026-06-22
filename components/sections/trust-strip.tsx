const RETAILERS = [
	{ name: "Fortnum & Mason", sub: "EST. 1707", font: "serif" as const },
	{ name: "Harrods", font: "italic" as const },
	{ name: "Soho House", icon: "square" as const },
	{ name: "Whole Foods", sub: "MARKET", font: "bold" as const },
	{ name: "Ottolenghi", font: "thin" as const },
	{ name: "Dorchester", sub: "Collection", font: "serif" as const, icon: "dc" as const },
];

export function TrustStrip() {
	return (
		<section className="bg-[color:var(--color-yns-cream)] border-y border-[color:var(--color-yns-blue-200)]/40">
			<div className="max-w-7xl mx-auto px-6 lg:px-10 py-10">
				<p className="text-center text-[11px] tracking-[0.4em] uppercase text-[color:var(--color-yns-navy)]/55">
					Trusted by
				</p>
				<div className="mt-7 grid grid-cols-3 md:grid-cols-6 items-center gap-y-8 gap-x-6 text-[color:var(--color-yns-navy)]/85">
					{RETAILERS.map((r) => (
						<div key={r.name} className="flex flex-col items-center justify-center text-center">
							{r.icon === "square" && (
								<svg className="h-5 w-5 mb-1.5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
									<title>tile</title>
									<rect
										x="3"
										y="3"
										width="18"
										height="18"
										stroke="currentColor"
										strokeWidth="1"
										fill="none"
									/>
									<path d="M3 9h18M3 15h18M9 3v18M15 3v18" stroke="currentColor" strokeWidth="0.6" />
								</svg>
							)}
							{r.icon === "dc" && (
								<svg className="h-6 w-12 mb-1" viewBox="0 0 60 30" fill="none" aria-hidden="true">
									<title>dc emblem</title>
									<circle cx="20" cy="15" r="11" stroke="currentColor" strokeWidth="0.8" fill="none" />
									<circle cx="40" cy="15" r="11" stroke="currentColor" strokeWidth="0.8" fill="none" />
								</svg>
							)}
							<span
								className={[
									"text-[15px] leading-none",
									r.font === "serif" && "font-serif tracking-[0.05em]",
									r.font === "italic" && "italic font-serif text-xl",
									r.font === "bold" && "font-bold tracking-tight uppercase",
									r.font === "thin" && "font-light tracking-[0.18em] uppercase",
								]
									.filter(Boolean)
									.join(" ")}
							>
								{r.name}
							</span>
							{r.sub && (
								<span className="mt-1 text-[8px] tracking-[0.3em] uppercase text-[color:var(--color-yns-navy)]/55">
									{r.sub}
								</span>
							)}
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
