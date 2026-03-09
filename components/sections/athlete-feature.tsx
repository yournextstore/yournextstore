export function AthleteFeature() {
	return (
		<section className="relative w-full overflow-hidden">
			<div className="grid grid-cols-1 lg:grid-cols-2">
				{/* Image side */}
				<div className="relative h-[50vh] lg:h-[70vh]">
					<div
						className="absolute inset-0 bg-cover bg-center"
						style={{ backgroundImage: "url(/hero-bg-3.svg)" }}
					/>
					<div className="absolute inset-0 bg-black/20" />
				</div>

				{/* Content side */}
				<div className="flex items-center bg-secondary/30 p-8 sm:p-12 lg:p-16">
					<div>
						<p className="text-xs tracking-widest uppercase text-muted-foreground mb-4">Athlete feature</p>
						<h2 className="font-heading text-3xl sm:text-4xl font-semibold tracking-wide mb-6">
							James Harrison
						</h2>
						<p className="text-muted-foreground leading-relaxed">
							We know how important it is to have gear that doesn&apos;t let you down when you&apos;re pushing
							your limits. That&apos;s why we only use the highest quality fabrics.
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}
