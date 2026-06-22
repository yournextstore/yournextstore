import Image from "next/image";
import { YnsLink } from "../yns-link";

const TILES = [
	{ src: "/scraped-0.jpg", handle: "@millie.makes" },
	{ src: "/scraped-1.jpg", handle: "@sunday.studio" },
	{ src: "/scraped-2.jpg", handle: "@plush.parade" },
	{ src: "/scraped-3.jpg", handle: "@nest.and.knot" },
	{ src: "/scraped-4.jpg", handle: "@littlebee" },
	{ src: "/scraped-5.jpg", handle: "@hellokind" },
];

export function CommunityGallery() {
	return (
		<section aria-label="Community gallery" className="bg-background">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
				<div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
					<div>
						<span className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[var(--color-peach)]">
							@yournextstore on Instagram
						</span>
						<h2
							className="mt-2 font-heading text-3xl sm:text-4xl text-foreground"
							style={{ fontVariationSettings: "'SOFT' 100" }}
						>
							Shared by our YNS family
						</h2>
					</div>
					<YnsLink
						prefetch={"eager"}
						href="https://instagram.com"
						className="self-start sm:self-end text-sm font-semibold underline underline-offset-4 text-foreground hover:text-[var(--color-peach)]"
					>
						Tag #YnsFriends to be featured →
					</YnsLink>
				</div>
				<ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
					{TILES.map((t) => (
						<li
							key={t.handle}
							className="group relative aspect-square overflow-hidden rounded-3xl bg-[var(--color-mint-soft)]"
						>
							<Image
								src={t.src}
								alt={`Community photo by ${t.handle}`}
								fill
								sizes="(max-width: 768px) 50vw, 16vw"
								className="object-cover transition-transform duration-700 group-hover:scale-105"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-[var(--color-ink)]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
								<span className="text-xs font-semibold text-cream text-white">{t.handle}</span>
							</div>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}
