import Image from "next/image";

const tiles = [
	{ src: "/scraped-0.jpg", caption: "@yns · rooftop hour" },
	{ src: "/scraped-4.jpg", caption: "@yns · driftwood days" },
	{ src: "/scraped-5.jpg", caption: "@yns · golden patio" },
	{ src: "/scraped-3.jpg", caption: "@yns · pool weather" },
	{ src: "/scraped-2.jpg", caption: "@yns · stone fruit szn" },
	{ src: "/scraped-1.jpg", caption: "@yns · garden party" },
];

export function SocialGrid() {
	return (
		<section className="bg-background py-20 sm:py-24">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10 gap-3">
					<div>
						<p className="text-xs uppercase tracking-[0.35em] font-bold text-fizz-sky mb-3">
							Out in the wild
						</p>
						<h2 className="font-display uppercase text-fizz-ink text-3xl sm:text-5xl leading-[0.95] tracking-tight">
							@yournextstore
						</h2>
					</div>
					<a
						href="https://instagram.com"
						target="_blank"
						rel="noreferrer"
						className="self-start sm:self-end inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-fizz-berry hover:text-fizz-sky transition-colors"
					>
						Follow along
						<svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
							<path
								d="M5 12h14M13 5l7 7-7 7"
								stroke="currentColor"
								strokeWidth="2.5"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					</a>
				</div>

				<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
					{tiles.map((t, i) => (
						<div
							key={`tile-${i}`}
							className="group relative aspect-square overflow-hidden rounded-2xl sticker-shadow"
						>
							<Image
								src={t.src}
								alt={t.caption}
								fill
								sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
								className="object-cover transition-transform duration-500 group-hover:scale-110"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-fizz-ink/70 via-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
								<span className="text-white text-[0.65rem] sm:text-xs font-semibold">{t.caption}</span>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
