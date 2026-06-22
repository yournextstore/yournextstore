import Image from "next/image";

export function About() {
	return (
		<section id="story" className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pt-20 sm:pt-28">
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
				<div className="lg:col-span-5 order-2 lg:order-1">
					<p className="text-xs tracking-[0.22em] uppercase text-muted-foreground mb-3">— Our story</p>
					<h2 className="yns-display text-4xl sm:text-5xl text-foreground leading-[1.02]">
						Built around how
						<span className="italic"> you live.</span>
					</h2>
					<p className="mt-5 text-muted-foreground text-base leading-relaxed">
						Your Next Store is a small studio with one quiet ambition: design objects that make rooms feel
						lived-in, not staged. We work with makers we know by name, in batches we can measure on one page.
					</p>
					<div className="mt-8 grid grid-cols-2 gap-6 max-w-md">
						<div className="border-t border-foreground/20 pt-4">
							<p className="yns-display text-3xl text-foreground">112</p>
							<p className="text-xs text-muted-foreground tracking-[0.16em] uppercase mt-1">
								Independent makers
							</p>
						</div>
						<div className="border-t border-foreground/20 pt-4">
							<p className="yns-display text-3xl text-foreground">2018</p>
							<p className="text-xs text-muted-foreground tracking-[0.16em] uppercase mt-1">Quietly since</p>
						</div>
						<div className="border-t border-foreground/20 pt-4">
							<p className="yns-display text-3xl text-foreground">91%</p>
							<p className="text-xs text-muted-foreground tracking-[0.16em] uppercase mt-1">
								Renewable materials
							</p>
						</div>
						<div className="border-t border-foreground/20 pt-4">
							<p className="yns-display text-3xl text-foreground">∞</p>
							<p className="text-xs text-muted-foreground tracking-[0.16em] uppercase mt-1">Repair promise</p>
						</div>
					</div>
				</div>
				<div className="lg:col-span-7 order-1 lg:order-2 relative">
					<div className="grid grid-cols-5 gap-3">
						<div className="col-span-3 relative aspect-[3/4] rounded-3xl overflow-hidden bg-secondary">
							<Image
								src="/scraped-5.jpg"
								alt="Studio space"
								fill
								sizes="(max-width: 1024px) 60vw, 35vw"
								className="object-cover"
							/>
						</div>
						<div className="col-span-2 flex flex-col gap-3">
							<div className="relative aspect-square rounded-3xl overflow-hidden bg-secondary">
								<Image
									src="/scraped-0.jpg"
									alt="Detail"
									fill
									sizes="(max-width: 1024px) 40vw, 20vw"
									className="object-cover"
								/>
							</div>
							<div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-secondary">
								<Image
									src="/scraped-3.jpg"
									alt="Materials"
									fill
									sizes="(max-width: 1024px) 40vw, 20vw"
									className="object-cover"
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
