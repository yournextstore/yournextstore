import Image from "next/image";

export function Tribute() {
	return (
		<section className="relative overflow-hidden bg-parchment">
			<div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-20 sm:py-28">
				{/* Eyebrow */}
				<div className="text-center font-grotesk text-[10px] uppercase tracking-eyebrow text-muted-foreground mb-8 flex items-center justify-center gap-3">
					<span aria-hidden className="block h-px w-8 bg-foreground" />
					<span className="text-accent/80">(</span>
					<span className="px-1">a tribute, 70 years on</span>
					<span className="text-accent/80">)</span>
					<span aria-hidden className="block h-px w-8 bg-foreground" />
				</div>

				{/* Headline composition */}
				<div className="relative grid grid-cols-12 gap-4 items-center min-h-[40vh]">
					{/* Left big serif */}
					<div className="col-span-12 md:col-span-3 font-editorial italic font-light text-[clamp(3rem,9vw,8rem)] leading-none text-foreground/90 text-center md:text-right">
						the
					</div>

					{/* Middle image */}
					<div className="col-span-12 md:col-span-6 relative aspect-[4/3] md:aspect-square rounded-md overflow-hidden border border-border/60 bg-background">
						<Image
							src="/scraped-0.jpg"
							alt="Chair tribute composition"
							fill
							sizes="(max-width: 768px) 100vw, 50vw"
							className="object-cover"
							priority={false}
						/>
						<div
							aria-hidden="true"
							className="absolute inset-0"
							style={{
								background:
									"linear-gradient(115deg, oklch(1 0 0 / 0.15), transparent 50%), radial-gradient(circle at 80% 90%, oklch(0.71 0.165 50 / 0.18), transparent 60%)",
							}}
						/>
						<div className="absolute top-4 left-4 inline-flex items-center gap-2 font-grotesk text-[10px] uppercase tracking-eyebrow text-foreground bg-background/85 backdrop-blur-sm px-2.5 py-1 rounded-full">
							1955 — 2025
						</div>
					</div>

					{/* Right big serif */}
					<div className="col-span-12 md:col-span-3 font-editorial italic font-light text-[clamp(3rem,9vw,8rem)] leading-none text-foreground/90 text-center md:text-left">
						archive
					</div>
				</div>

				{/* Quote */}
				<blockquote className="mt-16 mx-auto max-w-3xl text-center">
					<div aria-hidden="true" className="font-editorial italic text-6xl text-accent/40 leading-none mb-2">
						&ldquo;
					</div>
					<p className="font-editorial italic font-light text-2xl sm:text-3xl leading-snug text-foreground text-balance">
						A chair is the first piece of architecture a person ever sits inside. Make it quiet, make it kind
						to the back, and it will outlive every trend that follows.
					</p>
					<footer className="mt-6 font-grotesk text-[10px] uppercase tracking-eyebrow text-muted-foreground">
						— the studio notebook, vol. 07
					</footer>
				</blockquote>

				{/* Three image strip */}
				<div className="mt-20 grid grid-cols-3 gap-2 sm:gap-4">
					{[
						{ src: "/scraped-1.jpg", label: "the shell" },
						{ src: "/scraped-3.jpg", label: "the leg" },
						{ src: "/scraped-5.jpg", label: "the finish" },
					].map((item, idx) => (
						<figure
							key={item.label}
							className="group relative aspect-[3/4] overflow-hidden rounded-md border border-border/60"
						>
							<Image
								src={item.src}
								alt={item.label}
								fill
								sizes="(max-width: 768px) 33vw, 25vw"
								className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
							/>
							<div
								aria-hidden="true"
								className="absolute inset-0"
								style={{
									background: "linear-gradient(180deg, transparent 50%, oklch(0.18 0.005 60 / 0.7) 100%)",
								}}
							/>
							<figcaption className="absolute inset-x-3 bottom-3 flex items-center justify-between font-grotesk text-[10px] uppercase tracking-eyebrow text-background">
								<span>
									<span className="text-accent">(</span>
									<span className="px-1">{item.label}</span>
									<span className="text-accent">)</span>
								</span>
								<span>0{idx + 1}</span>
							</figcaption>
						</figure>
					))}
				</div>
			</div>
		</section>
	);
}
