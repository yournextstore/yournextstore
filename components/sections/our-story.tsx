import Image from "next/image";

export function OurStory() {
	return (
		<section id="story" className="px-3 sm:px-6 pb-16 sm:pb-24">
			<div className="max-w-7xl mx-auto">
				<div className="grid grid-cols-12 gap-6 sm:gap-8 mb-8">
					<div className="col-span-12 md:col-span-5">
						<h2 className="font-display text-5xl sm:text-6xl lg:text-7xl tracking-tight text-[var(--ink)]">
							Our <em>Story</em>
						</h2>
					</div>
					<div className="col-span-12 md:col-span-7 flex items-end">
						<p className="text-[15px] sm:text-base leading-relaxed text-[var(--ink)]/65 max-w-prose">
							Take a look at how it all began. From a tiny kitchen counter to a coast-to-coast cult favorite,
							every can carries the same restless craving for something fresher, brighter, and just a little
							bit louder.
						</p>
					</div>
				</div>

				{/* Big lifestyle photograph */}
				<div className="relative rounded-[32px] overflow-hidden aspect-[16/9] bg-[var(--sky-soft)]">
					<Image
						src="/scraped-2.jpg"
						alt="Hand holding a frosty Your Next Store can against a deep blue sky"
						fill
						className="object-cover"
						sizes="(max-width: 1280px) 100vw, 1280px"
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-[var(--ink)]/40 via-transparent to-transparent" />
					<div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10 text-[var(--cream)] max-w-md">
						<p className="text-xs uppercase tracking-[0.24em] text-[var(--cream)]/80 mb-2">Chapter one</p>
						<p className="font-display text-2xl sm:text-3xl italic leading-tight">
							&ldquo;A can worth chasing the sunset for.&rdquo;
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}
