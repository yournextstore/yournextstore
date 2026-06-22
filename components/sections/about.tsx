import Image from "next/image";

export function About() {
	return (
		<section id="about" className="bg-yns-cream-soft border-y-2 border-yns-cocoa/10">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
					<div className="relative aspect-[4/5] max-w-md w-full mx-auto lg:mx-0 rounded-md overflow-hidden border-2 border-yns-cocoa/15 shadow-[10px_10px_0_0_rgba(58,69,194,0.2)] -rotate-1">
						<Image
							src="/scraped-1.jpg"
							alt="Behind the scenes"
							fill
							sizes="(max-width: 1024px) 90vw, 40vw"
							className="object-cover"
						/>
					</div>
					<div>
						<p className="font-extrabold text-xs uppercase tracking-[0.2em] text-yns-green">
							Made the slow way
						</p>
						<h2 className="mt-3 font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-yns-cocoa italic">
							Cocoa with character.
						</h2>
						<p className="mt-5 text-base sm:text-lg text-yns-cocoa/75 leading-relaxed">
							Every bar starts with a single conversation — with a farm, a fruit, a maker. We roast in small
							batches, conch slowly, and wrap each bar by hand so the flavor that arrives at your door is the
							exact flavor we tasted on the bench.
						</p>
						<p className="mt-4 text-base sm:text-lg text-yns-cocoa/75 leading-relaxed">
							No filler, no shortcuts, no mystery ingredients. Just cocoa, sugar, and a lot of patience.
						</p>
						<div className="mt-8 grid grid-cols-3 gap-4 text-center">
							<div className="rounded-md border-2 border-yns-cocoa/15 bg-white px-3 py-4">
								<p className="font-display text-3xl font-extrabold text-yns-green">12</p>
								<p className="mt-1 text-[10px] font-extrabold uppercase tracking-widest text-yns-cocoa/70">
									Origins
								</p>
							</div>
							<div className="rounded-md border-2 border-yns-cocoa/15 bg-white px-3 py-4">
								<p className="font-display text-3xl font-extrabold text-yns-blue">63%</p>
								<p className="mt-1 text-[10px] font-extrabold uppercase tracking-widest text-yns-cocoa/70">
									Cocoa
								</p>
							</div>
							<div className="rounded-md border-2 border-yns-cocoa/15 bg-white px-3 py-4">
								<p className="font-display text-3xl font-extrabold text-yns-cocoa">100%</p>
								<p className="mt-1 text-[10px] font-extrabold uppercase tracking-widest text-yns-cocoa/70">
									Hand-wrapped
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
