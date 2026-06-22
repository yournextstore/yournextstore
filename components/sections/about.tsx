import Image from "next/image";

const pillars = [
	{
		title: "Sourced slowly",
		body: "We trace every blend back to a single grower — small co-ops, family farms, gardens we visit ourselves.",
	},
	{
		title: "Packed by hand",
		body: "Each pouch is filled, weighed and tied in our Brooklyn studio. Imperfect, in a quietly perfect way.",
	},
	{
		title: "Made to be opened",
		body: "Not too precious. Pantry staples meant to live on the counter, not in a cabinet behind glass.",
	},
];

export function About() {
	return (
		<section id="about" className="bg-cream-gradient">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				<div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
					{/* Left visual */}
					<div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-honey/40">
						<Image
							src="/scraped-1.jpg"
							alt="Botanicals from our latest harvest"
							fill
							sizes="(max-width: 1024px) 100vw, 600px"
							className="object-cover"
						/>
						<div className="absolute -bottom-6 -right-6 h-32 w-32 sm:h-40 sm:w-40 rounded-full bg-coral text-cream flex flex-col items-center justify-center text-center font-serif italic shadow-xl rotate-[-8deg]">
							<span className="text-[10px] uppercase tracking-[0.22em] not-italic font-semibold opacity-80">
								Est.
							</span>
							<span className="text-3xl sm:text-4xl leading-none">2019</span>
							<span className="text-[10px] uppercase tracking-[0.22em] not-italic font-semibold opacity-80 mt-1">
								Brooklyn
							</span>
						</div>
					</div>

					{/* Right copy */}
					<div className="max-w-xl">
						<span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-sage">
							<span className="h-px w-8 bg-sage" />
							Our story
						</span>
						<h2 className="mt-5 font-serif text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight text-foreground">
							Slow goods, <span className="italic text-coral">quietly considered.</span>
						</h2>
						<p className="mt-6 text-lg text-muted-foreground leading-relaxed">
							We started Your Next Store as an excuse to spend afternoons brewing strange teas and asking
							strangers about their favorite jam. The pantry that came from those afternoons is what
							you&rsquo;re reading about now.
						</p>

						<div className="mt-10 grid sm:grid-cols-3 gap-6">
							{pillars.map((p) => (
								<div key={p.title}>
									<div className="h-px w-10 bg-sage mb-3" />
									<h3 className="font-serif text-lg text-foreground">{p.title}</h3>
									<p className="mt-2 text-sm text-muted-foreground leading-relaxed">{p.body}</p>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
