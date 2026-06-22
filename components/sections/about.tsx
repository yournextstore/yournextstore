import Image from "next/image";

export function About() {
	return (
		<section id="origin" className="relative bg-white">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
				<div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-20">
					{/* Image — editorial B&W */}
					<div className="relative lg:col-span-6">
						<div className="relative aspect-[4/5] w-full overflow-hidden bg-[#0e0e0e] ring-1 ring-[#0e0e0e]/10">
							<Image
								src="/scraped-2.jpg"
								alt="Barista pulling an espresso shot"
								fill
								sizes="(max-width: 1024px) 100vw, 50vw"
								className="object-cover jolt-mono"
							/>
							<div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-transparent" />
							{/* Yellow accent corner */}
							<div className="absolute -bottom-3 -right-3 h-20 w-20 bg-[#ffcc00]" />
							{/* Caption tag */}
							<div className="absolute left-6 bottom-6 max-w-[240px] text-[10px] uppercase tracking-[0.25em] text-white/80">
								— New York · 6:42 AM
							</div>
						</div>

						{/* Secondary small image overlap */}
						<div className="absolute -left-6 -top-6 hidden h-48 w-36 overflow-hidden ring-1 ring-[#0e0e0e]/10 lg:block">
							<Image
								src="/scraped-3.jpg"
								alt="Coffee cans on concrete"
								fill
								sizes="200px"
								className="object-cover jolt-mono"
							/>
						</div>
					</div>

					{/* Copy */}
					<div className="lg:col-span-6">
						<span className="jolt-eyebrow text-[#6e6e6e]">— Origin Story</span>
						<h2 className="jolt-headline mt-3 text-4xl sm:text-5xl lg:text-6xl text-[#0e0e0e]">
							Born on the curb. <br />
							Brewed for the bold.
						</h2>

						<blockquote className="relative mt-8 border-l-2 border-[#ffcc00] pl-6">
							<p className="text-xl sm:text-2xl text-[#0e0e0e] leading-snug font-medium">
								&ldquo;We started Your Next Store because the world had enough watered-down coffee — and not
								enough loud, honest, properly roasted truth in a cup.&rdquo;
							</p>
							<footer className="mt-4 text-xs uppercase tracking-[0.25em] text-[#6e6e6e]">
								— The Founders
							</footer>
						</blockquote>

						<p className="mt-8 text-base text-[#6e6e6e] leading-relaxed max-w-prose">
							Every bean is sourced direct from small-batch farms across Ethiopia, Guatemala and Sumatra, then
							roasted in Brooklyn until it&rsquo;s exactly as bold as the people who drink it. No filler. No
							fluff. No apologies.
						</p>

						<div className="mt-10 grid grid-cols-3 gap-6 border-t border-[#0e0e0e]/10 pt-8">
							<div>
								<div className="jolt-headline text-3xl text-[#0e0e0e]">12</div>
								<div className="mt-1 text-[10px] uppercase tracking-[0.22em] text-[#6e6e6e]">
									Origin farms
								</div>
							</div>
							<div>
								<div className="jolt-headline text-3xl text-[#0e0e0e]">07</div>
								<div className="mt-1 text-[10px] uppercase tracking-[0.22em] text-[#6e6e6e]">
									Roast profiles
								</div>
							</div>
							<div>
								<div className="jolt-headline text-3xl text-[#0e0e0e]">∞</div>
								<div className="mt-1 text-[10px] uppercase tracking-[0.22em] text-[#6e6e6e]">F*s given</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
