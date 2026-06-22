export function VideoBanner() {
	return (
		<section className="relative w-full h-[60vh] min-h-[400px] overflow-hidden bg-stone-900">
			{/* Background gradient simulating cinematic video still */}
			<div className="absolute inset-0 bg-gradient-to-br from-stone-800 via-emerald-950/40 to-stone-900" />
			<div
				className="absolute inset-0 bg-cover bg-center opacity-60"
				style={{ backgroundImage: "url(/hero-bg-2.svg)" }}
			/>
			<div className="absolute inset-0 bg-black/40" />

			{/* Content */}
			<div className="relative z-10 flex items-center justify-center h-full">
				<div className="text-center text-white max-w-2xl px-4">
					<h2 className="font-heading text-4xl sm:text-5xl font-light tracking-wide mb-6">Into the wild.</h2>
					<p className="text-sm sm:text-base text-white/80 leading-relaxed mb-8">
						We design durable travel apparel with a conscience — 100% made in America.
					</p>
				</div>
			</div>
		</section>
	);
}
