import Image from "next/image";

const POSTS = [
	{ src: "/scraped-0.jpg", handle: "@maelyne", place: "East Village" },
	{ src: "/scraped-1.jpg", handle: "@thoseboots", place: "Lisbon" },
	{ src: "/scraped-2.jpg", handle: "@oat.studio", place: "Brooklyn" },
	{ src: "/scraped-3.jpg", handle: "@hugo.kg", place: "Paris IX" },
	{ src: "/scraped-4.jpg", handle: "@walknyc", place: "Greenpoint" },
	{ src: "/scraped-5.jpg", handle: "@dailyplain", place: "Mexico City" },
];

export function UGCGrid() {
	return (
		<section aria-label="From the community" className="bg-background">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				<div className="flex items-end justify-between gap-6 mb-10 sm:mb-12">
					<div>
						<span className="inline-flex items-center gap-2 text-[11px] tracking-[0.3em] uppercase text-ink/60">
							<span className="block h-px w-8 bg-brick" />
							No. 06 — In the wild
						</span>
						<h2 className="font-display-wide text-[clamp(2rem,5vw,4rem)] leading-[0.95] uppercase mt-4 text-balance">
							@yournextstore
						</h2>
					</div>
					<a
						href="https://instagram.com"
						className="hidden md:inline-flex items-center gap-2 px-5 h-11 border border-ink text-[11px] tracking-[0.28em] uppercase font-medium hover:bg-ink hover:text-bone transition-colors"
					>
						Follow along →
					</a>
				</div>

				<div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 sm:gap-3">
					{POSTS.map((post, idx) => (
						<a
							key={post.handle + idx}
							href="https://instagram.com"
							className="group relative block aspect-square bg-clay overflow-hidden"
						>
							<Image
								src={post.src}
								alt={post.handle}
								fill
								sizes="(max-width: 640px) 50vw, 33vw"
								className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
							<div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[10px] tracking-[0.22em] uppercase text-bone opacity-0 group-hover:opacity-100 transition-opacity">
								<span className="font-semibold">{post.handle}</span>
								<span className="opacity-80">{post.place}</span>
							</div>
						</a>
					))}
				</div>
			</div>
		</section>
	);
}
