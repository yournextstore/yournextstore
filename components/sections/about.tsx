import Image from "next/image";

export function About() {
	return (
		<section id="about" className="relative overflow-hidden" style={{ backgroundColor: "#E8E2D8" }}>
			<div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-20 lg:py-28">
				<div className="grid grid-cols-12 gap-6 lg:gap-12 items-end mb-14">
					<div className="col-span-12 lg:col-span-7">
						<div className="flex items-center gap-3 text-[11px] tracking-[0.24em] uppercase text-foreground/60 mb-6">
							<span>(&nbsp;Manifesto&nbsp;)</span>
							<span className="block h-px w-12 bg-foreground/30" />
							<span>Est. 1955</span>
						</div>
						<h2 className="display-italic text-5xl sm:text-6xl lg:text-7xl tracking-[-0.02em] leading-[0.95]">
							A study in
							<br />
							<span className="text-ember" style={{ color: "#c97a2b" }}>
								quiet
							</span>{" "}
							form.
						</h2>
					</div>
					<div className="col-span-12 lg:col-span-5 lg:pb-3">
						<p className="text-base text-foreground/75 leading-relaxed">
							We believe in the long life of considered objects. Each piece is drawn with restraint, built by
							hand, and finished with the patience of a workshop that has outlasted decades of changing taste.
						</p>
					</div>
				</div>

				<div className="grid grid-cols-12 gap-6 lg:gap-10 items-stretch">
					{/* Image left */}
					<div className="col-span-12 lg:col-span-7 relative rounded-sm overflow-hidden aspect-[4/3]">
						<Image
							src="/scraped-0.jpg"
							alt="Editorial interior"
							fill
							sizes="(max-width: 1024px) 100vw, 60vw"
							className="object-cover"
						/>
						<div
							className="absolute inset-0 bg-gradient-to-tr from-ink/30 via-transparent to-transparent"
							style={{ background: "linear-gradient(to top right, rgba(26,26,26,0.3), transparent 60%)" }}
						/>
						<div
							className="absolute bottom-5 left-5 text-paper text-[11px] tracking-[0.22em] uppercase"
							style={{ color: "#F4F1EC" }}
						>
							Plate I — The workshop, Copenhagen
						</div>
					</div>

					{/* Three principles right */}
					<div className="col-span-12 lg:col-span-5 grid grid-cols-1 gap-6 content-center">
						{[
							{
								n: "I",
								title: "Material first",
								body: "Bent beech, laminated walnut, hand-polished steel — sourced for grain and weight, not finish alone.",
							},
							{
								n: "II",
								title: "Slow studios",
								body: "Each object passes through six pairs of hands before it is signed and shipped.",
							},
							{
								n: "III",
								title: "Built to outlive trend",
								body: "Our oldest pieces are still in production. The newest are drawn to join them.",
							},
						].map((p) => (
							<div key={p.n} className="border-t border-foreground/15 pt-5 flex gap-5">
								<div
									className="display-italic text-3xl text-ember leading-none w-10 shrink-0"
									style={{ color: "#c97a2b" }}
								>
									{p.n}
								</div>
								<div>
									<h3 className="display-italic text-xl tracking-[-0.01em] mb-1.5">{p.title}</h3>
									<p className="text-sm text-foreground/70 leading-relaxed">{p.body}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
