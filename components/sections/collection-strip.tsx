import { cacheLife } from "next/cache";
import Image from "next/image";
import { commerce } from "@/lib/commerce";
import { YnsLink } from "../yns-link";

const PLATES = ["/scraped-1.jpg", "/scraped-2.jpg", "/scraped-3.jpg"];

export async function CollectionStrip() {
	"use cache";
	cacheLife("hours");

	const { data: collections } = await commerce.collectionBrowse({ limit: 3 });

	const tiles = collections.length
		? collections.map((c, i) => ({
				href: `/collection/${c.slug}`,
				title: c.name,
				image: PLATES[i % PLATES.length],
			}))
		: [
				{ href: "/products", title: "Seating", image: PLATES[0] },
				{ href: "/products", title: "Lighting", image: PLATES[1] },
				{ href: "/products", title: "Objects", image: PLATES[2] },
			];

	return (
		<section className="relative" style={{ backgroundColor: "#F4F1EC" }}>
			<div className="max-w-[1400px] mx-auto px-6 lg:px-10 pb-20 lg:pb-28">
				<div className="flex items-end justify-between mb-10">
					<div>
						<div
							className="flex items-center gap-3 text-[11px] tracking-[0.24em] uppercase text-ember mb-5"
							style={{ color: "#c97a2b" }}
						>
							<span className="block h-px w-10 bg-current" />
							Plates II–IV
						</div>
						<h2 className="display-italic text-4xl sm:text-5xl lg:text-6xl tracking-[-0.02em] leading-[0.95]">
							Rooms in residence
						</h2>
					</div>
					<p className="hidden lg:block max-w-xs text-sm text-foreground/65 leading-relaxed">
						A serial study of the collection at rest — light, room, object.
					</p>
				</div>

				<div className="grid grid-cols-12 gap-4 lg:gap-6">
					{tiles.map((tile, idx) => (
						<YnsLink
							prefetch={"eager"}
							key={tile.title}
							href={tile.href}
							className={`group relative rounded-sm overflow-hidden ${
								idx === 0
									? "col-span-12 md:col-span-6 row-span-2 aspect-[3/4] md:aspect-auto"
									: "col-span-6 md:col-span-3 aspect-[4/5]"
							}`}
						>
							<Image
								src={tile.image}
								alt={tile.title}
								fill
								sizes="(max-width: 768px) 100vw, 33vw"
								className="object-cover transition-transform duration-[1200ms] group-hover:scale-[1.04]"
							/>
							<div
								className="absolute inset-0"
								style={{
									background: "linear-gradient(180deg, transparent 50%, rgba(26,26,26,0.55) 100%)",
								}}
							/>
							<div
								className="absolute inset-x-5 bottom-5 flex items-end justify-between text-paper"
								style={{ color: "#F4F1EC" }}
							>
								<div>
									<div className="text-[10px] tracking-[0.22em] uppercase opacity-70 mb-1">
										Plate {String(idx + 2).padStart(2, "0")}
									</div>
									<div className="display-italic text-2xl lg:text-3xl tracking-[-0.01em] leading-tight">
										{tile.title}
									</div>
								</div>
								<div className="text-[10px] tracking-[0.22em] uppercase opacity-80 group-hover:opacity-100 transition-opacity">
									Explore →
								</div>
							</div>
						</YnsLink>
					))}
				</div>
			</div>
		</section>
	);
}
