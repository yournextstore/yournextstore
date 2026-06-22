import Image from "next/image";

export function About() {
	return (
		<section id="about" className="relative bg-cream py-20 sm:py-28 overflow-hidden">
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0"
				style={{
					backgroundImage:
						"radial-gradient(circle at 85% 15%, rgba(168,212,240,0.28) 0, transparent 28%), radial-gradient(circle at 12% 85%, rgba(242,200,75,0.22) 0, transparent 24%)",
				}}
			/>
			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
					<div className="relative">
						<div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden ring-[12px] ring-cream shadow-[0_30px_80px_-30px_rgba(14,14,14,0.45)]">
							<Image
								src="/scraped-2.jpg"
								alt="Made in small batches"
								fill
								sizes="(max-width: 1024px) 100vw, 50vw"
								className="object-cover"
							/>
						</div>
						<div className="absolute -top-6 -left-6 sm:-top-8 sm:-left-8 yns-spin-slow">
							<div className="h-28 w-28 sm:h-36 sm:w-36 rounded-full bg-cherry text-cream flex items-center justify-center text-center px-3 text-xs font-bold uppercase leading-tight tracking-widest -rotate-6 shadow-xl">
								Real
								<br />
								small batch
								<br />
								goods
							</div>
						</div>
						<div className="absolute -bottom-5 -right-5 hidden sm:block">
							<div className="rounded-2xl bg-mustard text-ink px-5 py-3 text-xs font-bold uppercase tracking-widest rotate-3 shadow-lg">
								Est. today
							</div>
						</div>
					</div>

					<div>
						<span className="inline-block rounded-full bg-sky text-ink px-4 py-1.5 text-xs font-bold uppercase tracking-widest">
							The story
						</span>
						<h2
							className="yns-display mt-5 text-ink leading-[0.9]"
							style={{ fontSize: "clamp(2.75rem, 6vw, 5rem)" }}
						>
							Made with <br />
							<span className="text-cherry">love</span>, <br />
							hot sauce <br />
							optional.
						</h2>
						<p className="mt-6 text-lg leading-relaxed text-ink/80 max-w-md">
							We started Your Next Store because we got tired of bland shelves and boring labels. Every jar,
							tub, and tin in here is small batch, sourced from people we&apos;d happily invite over for
							dinner.
						</p>
						<p className="mt-4 text-lg leading-relaxed text-ink/80 max-w-md">
							Spreadable, dippable, infinitely enjoyable — and yes, we taste-test everything ourselves.
							That&apos;s just good business.
						</p>
						<div className="mt-8 flex flex-wrap gap-3">
							<span className="rounded-full border-2 border-ink px-4 py-2 text-xs font-bold uppercase tracking-widest">
								Small batch
							</span>
							<span className="rounded-full border-2 border-ink px-4 py-2 text-xs font-bold uppercase tracking-widest">
								Real ingredients
							</span>
							<span className="rounded-full border-2 border-ink px-4 py-2 text-xs font-bold uppercase tracking-widest">
								Family owned
							</span>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
