export function About() {
	return (
		<section id="story" className="bg-background">
			<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 py-24 sm:py-32 text-center">
				<p className="text-[10px] sm:text-[11px] font-medium tracking-[0.32em] uppercase text-foreground/70 inline-flex items-center gap-2">
					<span>Where</span>
					<span className="italic font-serif normal-case text-base tracking-normal text-foreground">
						Haircare
					</span>
					<span>Meets</span>
					<span className="italic font-serif normal-case text-base tracking-normal text-foreground">
						Soft Moments
					</span>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.4"
						aria-hidden="true"
						className="h-3.5 w-3.5"
					>
						<title>Cloud</title>
						<path d="M17.5 19a4.5 4.5 0 1 0-1.4-8.78A6 6 0 0 0 4 12.5 4.5 4.5 0 0 0 8.5 19h9Z" />
					</svg>
				</p>

				<h2 className="font-serif yns-editorial mt-8 text-[2.1rem] sm:text-[3rem] lg:text-[3.75rem] leading-[1.05] tracking-tight text-foreground">
					We evolve hair routines that once felt difficult, into{" "}
					<span className="italic font-light">rituals with ease</span>
				</h2>
			</div>
		</section>
	);
}
