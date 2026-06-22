import Image from "next/image";

const tiles = [
	{ src: "/scraped-0.jpg", caption: "@chef.aurora" },
	{ src: "/scraped-1.jpg", caption: "@trattoria.luce" },
	{ src: "/scraped-2.jpg", caption: "@nonna.bea" },
	{ src: "/scraped-3.jpg", caption: "@food.atlas" },
	{ src: "/scraped-4.jpg", caption: "@osteria.di.notte" },
	{ src: "/scraped-5.jpg", caption: "@spoon.and.fork" },
];

export function Gallery() {
	return (
		<section className="bg-cream-paper py-20 lg:py-28">
			<div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-10">
				<div className="flex flex-col items-center text-center">
					<p className="divider-ornament">#YourNextStore</p>
					<h2 className="mt-5 font-display text-4xl tracking-tight text-[color:#0f2a3f] sm:text-5xl lg:text-[56px]">
						From <span className="italic text-[color:#ee7a1a]">your</span> tables.
					</h2>
					<p className="mt-4 max-w-lg text-base text-[color:#0f2a3f]/70 sm:text-lg">
						Tag your still-life. Six get featured here every week.
					</p>
				</div>

				<ul className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
					{tiles.map((t, i) => (
						<li
							key={`${t.caption}-${i}`}
							className="group relative aspect-square overflow-hidden bg-[color:#0f2a3f]"
						>
							<Image
								src={t.src}
								alt={t.caption}
								fill
								sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
								className="object-cover transition-transform duration-700 group-hover:scale-110"
							/>
							<div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0f2a3f]/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
							<span className="absolute bottom-2 left-2 right-2 truncate font-display text-xs italic text-[color:#f6efe2] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
								{t.caption}
							</span>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}
