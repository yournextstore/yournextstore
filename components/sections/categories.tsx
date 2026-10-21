import Link from "next/link";
import { getCategoryTiles } from "@/lib/catalog";
import { YNSMedia } from "@/lib/yns-media";

/** Eyesome's "Categories": photo cards with a dark veil and the name set huge in cream. */
export async function Categories() {
	const tiles = await getCategoryTiles();
	if (tiles.length === 0) return null;

	return (
		<section id="categories" className="scroll-mt-24">
			<h2 className="mt-10 text-center text-3xl break-words md:text-4xl">Categories</h2>
			<ul className="mt-1 grid grid-cols-1 gap-4 py-4 md:grid-cols-3">
				{tiles.map((tile) => (
					<li key={tile.href}>
						<Link
							href={tile.href}
							className="group relative flex aspect-[3/2] items-center justify-center overflow-hidden rounded-xl bg-black/[0.06]"
						>
							<YNSMedia
								src={tile.image}
								alt=""
								fill
								sizes="(min-width: 768px) 27vw, 92vw"
								className="object-cover transition-transform delay-75 duration-300 ease-out group-hover:scale-110"
								style={tile.position ? { objectPosition: tile.position } : undefined}
							/>
							<span className="absolute inset-0 rounded-xl bg-black/40" aria-hidden />
							<span className="relative p-3 text-center text-4xl font-bold capitalize text-background break-words drop-shadow-sm xs:text-6xl sm:text-7xl md:text-5xl xl:text-6xl">
								{tile.name}
							</span>
						</Link>
					</li>
				))}
			</ul>
		</section>
	);
}
