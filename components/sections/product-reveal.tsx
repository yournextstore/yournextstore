import Image from "next/image";

export function ProductReveal() {
	return (
		<section className="relative w-full overflow-hidden bg-cinema-deep py-32 sm:py-40">
			{/* Aurora background */}
			<div className="absolute inset-0 pointer-events-none">
				<div className="absolute inset-x-0 top-1/4 h-1/2 bg-aurora" />
			</div>

			{/* Stardust */}
			<div className="absolute inset-0 bg-stardust opacity-50 pointer-events-none" />

			<div className="relative max-w-5xl mx-auto px-6 text-center">
				<p className="font-sans text-[11px] uppercase tracking-[0.4em] text-muted-foreground mb-6">
					Meet the Edition
				</p>
				<h2 className="font-serif text-balance text-4xl sm:text-5xl md:text-6xl font-light leading-tight">
					Built from quiet materials.
					<br />
					<em className="not-italic text-muted-foreground">For louder feelings.</em>
				</h2>

				{/* Floating device — abstract pod */}
				<div className="relative mt-20 sm:mt-28 mx-auto w-64 sm:w-80 aspect-square animate-float-slow">
					{/* glow */}
					<div className="absolute inset-0 rounded-full animate-pulse-glow">
						<div
							className="absolute inset-0 rounded-full"
							style={{
								background:
									"radial-gradient(circle at 50% 40%, rgba(74,118,255,0.5) 0%, rgba(46,92,255,0.25) 30%, transparent 70%)",
								filter: "blur(40px)",
							}}
						/>
					</div>

					{/* device disc */}
					<div className="absolute inset-[18%] rounded-full ring-moon shadow-cinematic overflow-hidden">
						<div
							className="absolute inset-0"
							style={{
								background:
									"conic-gradient(from 220deg at 50% 50%, #2e2d52 0%, #6b6a8c 25%, #b8b6ce 35%, #f4f2f8 45%, #b8b6ce 55%, #6b6a8c 70%, #2e2d52 100%)",
							}}
						/>
						<div className="absolute inset-4 rounded-full bg-[#0b1024]/85 backdrop-blur-sm flex items-center justify-center">
							<div
								className="absolute inset-2 rounded-full opacity-90"
								style={{
									background:
										"radial-gradient(circle at 40% 30%, #4a76ff 0%, #2e5cff 30%, #1a1f3a 70%, #050817 100%)",
								}}
							/>
							<div className="relative z-10 text-center">
								<div className="font-serif text-2xl sm:text-3xl text-moon/95 leading-none">YNS</div>
								<div className="mt-1 text-[8px] uppercase tracking-[0.35em] text-muted-foreground">
									Edition 01
								</div>
							</div>
						</div>

						{/* highlight */}
						<div
							className="absolute inset-0 rounded-full pointer-events-none"
							style={{
								background:
									"radial-gradient(ellipse 50% 30% at 35% 20%, rgba(244,242,248,0.35) 0%, transparent 70%)",
							}}
						/>
					</div>

					{/* orbiting dot */}
					<div className="absolute inset-0 animate-pulse-glow">
						<div className="absolute top-1/2 left-0 w-1.5 h-1.5 rounded-full bg-[#4a76ff] shadow-[0_0_12px_#4a76ff]" />
					</div>
				</div>

				<p className="mt-16 mx-auto max-w-md text-sm sm:text-base text-muted-foreground font-light">
					Hand-finished aluminum. A single soft display. Pocket-weight, sky-quiet.
				</p>
			</div>

			{/* product image from API would replace this; this is a hero reveal moment */}
			{/* Use a scraped image as decorative atmosphere only on left/right */}
			<div className="hidden lg:block absolute -left-32 top-1/3 w-96 h-96 opacity-30 pointer-events-none">
				<Image src="/scraped-0.jpg" alt="" fill className="object-cover" sizes="384px" />
				<div className="absolute inset-0 bg-gradient-to-r from-[#050817] via-[#050817]/40 to-transparent" />
			</div>
		</section>
	);
}
