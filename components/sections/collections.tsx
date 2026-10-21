import Image from "next/image";
import Link from "next/link";
import { BtnLabel } from "@/components/grilli/btn-label";
import { SectionHeading } from "@/components/grilli/section-heading";
import { getCollectionTiles } from "@/lib/catalog";
import { CARD_IMAGES } from "@/lib/editorial";

/**
 * The original's "Upcoming Event" cards: tall photographs, a black count tag, copy on a dark fade.
 * A single collection gets one wide card instead of a lone tile in a three-column row.
 */
export async function CollectionsSection() {
	const tiles = await getCollectionTiles(3);
	if (tiles.length === 0) return null;

	return (
		<section aria-labelledby="collections-title" className="bg-smoky-2 py-[70px] lg:py-[100px]">
			<div className="container-g xs:max-w-[420px] md:max-w-[820px] lg:max-w-none xl:max-w-[1200px]">
				<SectionHeading
					id="collections-title"
					kicker="Our Collections"
					title="Explore the Collections"
					className="mb-10"
				/>
				<ul className={tiles.length === 1 ? "grid" : "grid gap-10 md:grid-cols-2 lg:grid-cols-3"}>
					{tiles.map((tile, index) => (
						<li
							key={tile.id}
							className={
								index === 2
									? "md:col-span-2 md:mx-auto md:w-[calc(50%-20px)] lg:col-span-1 lg:w-full"
									: undefined
							}
						>
							<Link href={tile.href} className="group shine relative block overflow-hidden">
								<div
									className={`relative overflow-hidden bg-eerie-4 ${tiles.length === 1 ? "aspect-[350/450] md:aspect-[21/9]" : "aspect-[350/450]"}`}
								>
									<Image
										src={CARD_IMAGES[index % CARD_IMAGES.length] ?? CARD_IMAGES[0]}
										alt=""
										fill
										sizes={
											tiles.length === 1
												? "(min-width: 1200px) 1200px, 100vw"
												: "(min-width: 992px) 33vw, (min-width: 768px) 390px, 100vw"
										}
										className="object-cover transition-transform duration-500 group-hover:scale-105"
									/>
									<span className="absolute top-[30px] left-[25px] bg-black px-2.5 py-[5px] text-label-2 leading-[14px] font-bold tracking-1 text-gold">
										{tile.count} {tile.count === 1 ? "item" : "items"}
									</span>
								</div>
								<div className="absolute bottom-0 w-full bg-linear-to-t from-black/90 via-black/70 to-transparent px-[35px] pt-[35px] pb-[25px] text-center">
									<p className="mb-[5px] text-label-2 font-bold tracking-2 text-gold uppercase">Collection</p>
									<h3 className="font-display text-title-2 text-white xl:text-[1.5625rem]">{tile.name}</h3>
								</div>
							</Link>
						</li>
					))}
				</ul>
				<Link href="/products" className="btn-g mx-auto mt-10 flex">
					<BtnLabel>View Everything</BtnLabel>
				</Link>
			</div>
		</section>
	);
}
