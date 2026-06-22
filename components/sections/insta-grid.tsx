import Image from "next/image";

function InstagramGlyph({ className }: { className?: string }) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={1.8}
			className={className}
			aria-hidden
		>
			<title>Instagram</title>
			<rect x={3} y={3} width={18} height={18} rx={5} ry={5} />
			<circle cx={12} cy={12} r={4} />
			<circle cx={17.5} cy={6.5} r={0.9} fill="currentColor" />
		</svg>
	);
}

const tiles = [
	{ src: "/scraped-0.jpg", caption: "@elena_b" },
	{ src: "/scraped-1.jpg", caption: "@cala.studio" },
	{ src: "/scraped-2.jpg", caption: "@portofino_pal" },
	{ src: "/scraped-3.jpg", caption: "@morning.crumb" },
	{ src: "/scraped-4.jpg", caption: "@late.rinse" },
	{ src: "/scraped-5.jpg", caption: "@tabletalk_jpg" },
];

export function InstaGrid() {
	return (
		<section className="bg-[#f5e4d2]">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-20 sm:py-24">
				<div className="text-center mb-12">
					<p className="font-script text-[#1f46c2] text-2xl sm:text-3xl">in the wild</p>
					<h2 className="mt-1 font-display text-4xl sm:text-5xl uppercase tracking-wide text-[#2a2622]">
						Holidays, often
					</h2>
					<a
						href="https://instagram.com"
						target="_blank"
						rel="noopener noreferrer"
						className="mt-4 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-[#1f46c2] hover:text-[#d8351f] transition-colors"
					>
						<InstagramGlyph className="h-4 w-4" />
						@yournextstore
					</a>
				</div>

				<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
					{tiles.map((t, i) => (
						<a
							key={`${t.src}-${i}`}
							href="https://instagram.com"
							target="_blank"
							rel="noopener noreferrer"
							className="group relative aspect-square overflow-hidden bg-[#ecd3b8]"
						>
							<Image
								src={t.src}
								alt={t.caption}
								fill
								sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 17vw"
								className="object-cover transition-transform duration-500 group-hover:scale-110"
							/>
							<div className="absolute inset-0 bg-[#e8b547] mix-blend-multiply opacity-25 transition-opacity duration-500 group-hover:opacity-10" />
							<div className="absolute inset-0 flex items-end justify-between p-2 sm:p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-[#2a2622]/60 to-transparent">
								<span className="text-[10px] uppercase tracking-[0.2em] text-[#f5e4d2]">{t.caption}</span>
								<InstagramGlyph className="h-3.5 w-3.5 text-[#f5e4d2]" />
							</div>
						</a>
					))}
				</div>
			</div>
		</section>
	);
}
