import Link from "next/link";
import { SectionHeading } from "@/components/grilli/section-heading";
import { getCategoryTiles } from "@/lib/catalog";
import { YNSMedia } from "@/lib/yns-media";

/**
 * The original's "We Offer Top Notch": three portrait cards on a gold lattice, staggered on wide
 * screens. Here they are the shop's top-level categories.
 */
export async function Specialties() {
	const tiles = await getCategoryTiles(3);
	if (tiles.length === 0) return null;

	return (
		<section
			aria-labelledby="specialties-title"
			className="relative overflow-hidden bg-smoky-2 py-[70px] text-center lg:py-[100px]"
		>
			<div className="container-g xs:max-w-[420px] md:max-w-[820px] lg:max-w-none xl:max-w-[1200px]">
				<SectionHeading
					id="specialties-title"
					kicker="Handpicked"
					title="We Offer Top Notch"
					titleClassName="mb-4"
				/>
				<p className="mx-auto mb-10 max-w-[420px] text-body-4 xl:mb-[75px]">
					Every jar and bottle comes from our own kitchen pantry, from the oil we finish plates with to the
					sauces we reduce for days.
				</p>
				<ul className="grid gap-10 md:grid-cols-2 lg:grid-cols-3 xl:gap-[150px]">
					{tiles.map((tile, index) => (
						<li
							key={tile.id}
							className={
								index === 2
									? "md:col-span-2 md:mx-auto md:w-[calc(50%-20px)] lg:col-span-1 lg:w-full"
									: index % 2 === 0
										? "xl:-translate-y-[160px]"
										: undefined
							}
						>
							<div className="group overflow-hidden">
								<Link href={tile.href} tabIndex={-1} aria-hidden="true" className="pattern-band mb-[26px]">
									<figure className="relative aspect-[285/336] overflow-hidden bg-eerie-4 transition-transform duration-500 group-hover:scale-105">
										{tile.image && (
											<YNSMedia
												src={tile.image}
												alt=""
												fill
												sizes="(min-width: 1200px) 290px, (min-width: 992px) 30vw, (min-width: 768px) 390px, 100vw"
												className="object-cover"
											/>
										)}
									</figure>
								</Link>
								<h3 className="mb-3 font-display text-title-4 text-white">
									<Link href={tile.href}>{tile.name}</Link>
								</h3>
								<Link href={tile.href} className="btn-text hover-underline mx-auto block">
									Shop Now
								</Link>
							</div>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}
