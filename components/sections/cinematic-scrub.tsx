import Image from "next/image";

export function CinematicScrub() {
	return (
		<section className="relative w-full overflow-hidden bg-moonbeam">
			<div className="relative h-[80vh] min-h-[520px] w-full">
				<Image
					src="/scraped-2.jpg"
					alt="Atmospheric backdrop"
					fill
					className="object-cover"
					sizes="100vw"
					priority={false}
				/>
				{/* deep overlays */}
				<div className="absolute inset-0 bg-gradient-to-b from-[#050817] via-[#050817]/30 to-[#050817]" />
				<div className="absolute inset-0 bg-gradient-to-r from-[#050817]/80 via-transparent to-[#050817]/80" />
				<div
					className="absolute inset-0 mix-blend-overlay opacity-60"
					style={{
						background: "radial-gradient(circle at 70% 40%, rgba(46,92,255,0.3) 0%, transparent 50%)",
					}}
				/>

				{/* caption */}
				<div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
					<p className="font-sans text-[11px] uppercase tracking-[0.4em] text-muted-foreground mb-8">
						In motion
					</p>
					<h2 className="font-serif text-balance text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light leading-[1.05] max-w-3xl">
						A small thing, carried <em className="not-italic text-foreground">far.</em>
					</h2>
					<p className="mt-8 max-w-lg text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
						Three frames per second of moonlight. Pocketed across cities, opened only when needed.
					</p>

					{/* timeline progress */}
					<div className="mt-14 w-full max-w-md">
						<div className="flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-3">
							<span>00:00</span>
							<span>Long take</span>
							<span>02:14</span>
						</div>
						<div className="h-px w-full bg-border relative overflow-hidden">
							<div className="absolute inset-y-0 left-0 w-2/5 bg-[#4a76ff]" />
							<div className="absolute top-1/2 left-2/5 -translate-y-1/2 h-2 w-2 rounded-full bg-[#4a76ff] shadow-[0_0_12px_#4a76ff]" />
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
