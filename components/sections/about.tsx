const VALUES = [
	{
		title: "Hand-stitched care",
		body: "Every plush is finished by hand in our London workshop, smile by smile.",
		icon: "🧵",
	},
	{
		title: "Gentle materials",
		body: "Cloud-soft pile, OEKO-TEX dyes and safety-checked stuffing for the littlest fingers.",
		icon: "🌿",
	},
	{
		title: "Forever friends",
		body: "Designed to be cuddled, washed and re-cuddled — built for a lifetime of stories.",
		icon: "✨",
	},
];

export function About() {
	return (
		<section id="about" className="bg-cream-panel">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
				<div className="max-w-2xl mx-auto text-center">
					<span className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[var(--color-peach)]">
						Our story
					</span>
					<h2
						className="mt-3 font-heading text-3xl sm:text-4xl lg:text-5xl tracking-tight text-foreground"
						style={{ fontVariationSettings: "'SOFT' 100" }}
					>
						Cuddly characters &amp; playful gifts to love forever.
					</h2>
					<p className="mt-5 text-base sm:text-lg text-muted-foreground leading-relaxed">
						YNS began with a single stitched smile in a sunny London studio. Today, our menagerie of huggable
						friends finds homes around the world — each one designed with imagination, care and a wink of
						cheer.
					</p>
				</div>
				<ul className="mt-12 grid sm:grid-cols-3 gap-5 sm:gap-8">
					{VALUES.map((v) => (
						<li
							key={v.title}
							className="rounded-3xl bg-white p-7 text-center shadow-[0_10px_30px_-18px_rgba(31,42,48,0.35)] ring-1 ring-black/5"
						>
							<div
								className="mx-auto h-14 w-14 rounded-full bg-[var(--color-mint-soft)] flex items-center justify-center text-2xl"
								aria-hidden="true"
							>
								{v.icon}
							</div>
							<h3
								className="mt-4 font-heading text-xl text-foreground"
								style={{ fontVariationSettings: "'SOFT' 100" }}
							>
								{v.title}
							</h3>
							<p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.body}</p>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}
