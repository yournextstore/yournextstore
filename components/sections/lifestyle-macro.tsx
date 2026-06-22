import Image from "next/image";

export function LifestyleMacro() {
	return (
		<section className="relative bg-background overflow-hidden">
			<div className="max-w-7xl mx-auto px-6 py-24 sm:py-32 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
				{/* Macro image */}
				<div className="relative aspect-[4/5] rounded-3xl overflow-hidden ring-moon shadow-cinematic">
					<Image
						src="/scraped-1.jpg"
						alt="A quiet still life — a small object resting on slate"
						fill
						className="object-cover"
						sizes="(max-width: 1024px) 100vw, 50vw"
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-[#050817]/70 via-transparent to-transparent" />
					<div className="absolute inset-0 bg-gradient-to-br from-[#1a1f3a]/30 via-transparent to-[#2e5cff]/10" />

					{/* Small badge */}
					<div className="absolute top-6 left-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/40 backdrop-blur-md border border-border">
						<div className="h-1.5 w-1.5 rounded-full bg-[#4a76ff] shadow-[0_0_8px_#4a76ff]" />
						<span className="text-[10px] uppercase tracking-[0.3em] text-foreground">In stock</span>
					</div>
				</div>

				{/* Copy */}
				<div className="max-w-md">
					<p className="font-sans text-[11px] uppercase tracking-[0.4em] text-muted-foreground mb-6">
						A note on stillness
					</p>
					<h2 className="font-serif text-4xl sm:text-5xl lg:text-[56px] font-light leading-[1.1]">
						The world is loud.
						<br />
						<em className="not-italic text-muted-foreground">Your pocket doesn&apos;t have to be.</em>
					</h2>
					<p className="mt-8 text-base sm:text-lg text-muted-foreground font-light leading-relaxed">
						We make small, considered things — for the walk home, the reading chair, the train at midnight.
						Nothing here is racing for your attention.
					</p>

					<dl className="mt-12 grid grid-cols-2 gap-y-6 gap-x-8 border-t border-border pt-10">
						<div>
							<dt className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Material</dt>
							<dd className="mt-1.5 font-serif text-xl">Brushed aluminum</dd>
						</div>
						<div>
							<dt className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Weight</dt>
							<dd className="mt-1.5 font-serif text-xl">38 grams</dd>
						</div>
						<div>
							<dt className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Battery</dt>
							<dd className="mt-1.5 font-serif text-xl">14 days</dd>
						</div>
						<div>
							<dt className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Origin</dt>
							<dd className="mt-1.5 font-serif text-xl">Made nearby</dd>
						</div>
					</dl>
				</div>
			</div>
		</section>
	);
}
