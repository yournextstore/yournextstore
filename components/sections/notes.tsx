import { cacheLife } from "next/cache";
import Image from "next/image";
import { YnsLink } from "@/components/yns-link";
import { commerce } from "@/lib/commerce";

const fallbackImages = ["/scraped-2.jpg", "/scraped-3.jpg", "/scraped-4.jpg", "/scraped-5.jpg"];

const noteMap = ["Floral", "Woody", "Citrus", "Oriental"];

export async function Notes() {
	"use cache";
	cacheLife("hours");

	const { data } = await commerce.collectionBrowse({ limit: 4 });

	const cards =
		data.length > 0
			? data.map((c, i) => ({
					title: c.name,
					href: `/collection/${c.slug}`,
					image: fallbackImages[i % fallbackImages.length],
					eyebrow: noteMap[i % noteMap.length],
				}))
			: noteMap.map((label, i) => ({
					title: label,
					href: "/products",
					image: fallbackImages[i % fallbackImages.length],
					eyebrow: "Family",
				}));

	return (
		<section className="bg-luxe-canvas">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
				<div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between mb-10">
					<div>
						<p className="text-xs uppercase tracking-[0.3em] text-[color:var(--color-luxe-violet)]">
							Olfactory Families
						</p>
						<h2 className="mt-3 font-display text-5xl sm:text-6xl tracking-tight text-foreground">
							Find your note.
						</h2>
					</div>
					<p className="max-w-sm text-sm text-muted-foreground">
						Four worlds of scent — picked by our master perfumers, ready to be discovered.
					</p>
				</div>

				<div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
					{cards.map((card) => (
						<YnsLink
							key={card.title}
							href={card.href}
							prefetch={"eager"}
							className="group relative aspect-[3/4] overflow-hidden rounded-3xl bg-[color:var(--color-luxe-midnight)]"
						>
							<Image
								src={card.image}
								alt={card.title}
								fill
								sizes="(max-width: 1024px) 50vw, 25vw"
								className="object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
							<div className="absolute inset-0 flex flex-col justify-between p-5">
								<span className="self-start rounded-full bg-white/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white backdrop-blur">
									{card.eyebrow}
								</span>
								<div>
									<h3 className="font-display text-3xl text-white">{card.title}</h3>
									<p className="mt-2 text-[11px] uppercase tracking-[0.25em] text-white/70">Explore →</p>
								</div>
							</div>
						</YnsLink>
					))}
				</div>
			</div>
		</section>
	);
}
