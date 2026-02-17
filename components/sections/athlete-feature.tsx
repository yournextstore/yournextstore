import Image from "next/image";

export function AthleteFeature() {
	return (
		<section className="relative h-[50vh] sm:h-[60vh] overflow-hidden">
			<Image src="/scraped-2.png" alt="Adventure landscape" fill className="object-cover" sizes="100vw" />
			<div className="absolute inset-0 bg-black/30" />
			<div className="absolute inset-0 flex items-center">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
					<div className="max-w-lg">
						<p className="text-white/70 text-xs tracking-[0.3em] uppercase mb-3">Athlete feature</p>
						<h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
							James Harrison
						</h2>
						<p className="text-white/80 text-base sm:text-lg leading-relaxed">
							We know how important it is to have gear that doesn&apos;t let you down when you&apos;re pushing
							your limits. That&apos;s why we only use the highest quality fabrics.
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}
