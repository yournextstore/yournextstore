const QUOTES = [
	{
		text: "A masterclass in restraint — clinical formulations that actually deliver.",
		source: "Vogue",
	},
	{
		text: "Their antioxidant serum is the closest a routine gets to a reset button.",
		source: "Wallpaper*",
	},
	{
		text: "The neon pouch you keep on your bathroom counter on purpose.",
		source: "The Cut",
	},
];

const PRESS = ["Vogue", "Wallpaper*", "The Cut", "Monocle", "Dazed", "Elle", "Document"];

export function PressStrip() {
	return (
		<section className="bg-background border-t border-b border-border/70">
			<div className="px-4 sm:px-8 lg:px-12 py-14">
				{/* Testimonials */}
				<div className="grid lg:grid-cols-3 gap-10 lg:gap-16 mb-12">
					{QUOTES.map((q) => (
						<figure key={q.source} className="flex flex-col gap-4">
							<svg
								width="22"
								height="18"
								viewBox="0 0 22 18"
								aria-hidden="true"
								className="text-foreground/60"
							>
								<title>quote</title>
								<path
									d="M0 18V11.7c0-3.4.6-6.2 1.9-8.4S5.1 0 7.4 0v3.2c-1.5 0-2.6.6-3.4 1.9-.8 1.3-1.1 3-1.1 5h3.3V18H0Zm12.4 0V11.7c0-3.4.6-6.2 1.9-8.4S17.5 0 19.8 0v3.2c-1.5 0-2.6.6-3.4 1.9-.8 1.3-1.1 3-1.1 5H18.6V18h-6.2Z"
									fill="currentColor"
								/>
							</svg>
							<blockquote className="text-foreground text-lg leading-snug">&ldquo;{q.text}&rdquo;</blockquote>
							<figcaption className="uppercase-display text-[10.5px] tracking-[0.24em] text-muted-foreground">
								— {q.source}
							</figcaption>
						</figure>
					))}
				</div>

				<div className="yns-divider-thin" />

				{/* Press logos */}
				<div className="mt-10 flex flex-wrap items-center justify-center gap-x-12 gap-y-5">
					{PRESS.map((name) => (
						<span
							key={name}
							className="uppercase-display text-[12px] tracking-[0.32em] text-muted-foreground/80"
						>
							{name}
						</span>
					))}
				</div>
			</div>
		</section>
	);
}
