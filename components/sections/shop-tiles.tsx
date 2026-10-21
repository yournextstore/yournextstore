import Link from "next/link";
import type { ShopTile } from "@/lib/catalog";
import { cn } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";

const COLUMNS: Record<number, string> = {
	1: "lg:grid-cols-1",
	2: "lg:grid-cols-2",
	3: "lg:grid-cols-3",
	4: "lg:grid-cols-4",
};

/**
 * The original's grey category tiles: a serif label that steps aside on hover while a grayscale
 * picture slides in from the right. Touch screens have no hover, so there the picture rests
 * half in view.
 */
export function ShopTiles({ tiles }: { tiles: ShopTile[] }) {
	if (tiles.length === 0) return null;
	return (
		<nav aria-label="Shop by collection" className="mb-16 lg:mb-20">
			<ul
				className={cn(
					"grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4",
					COLUMNS[tiles.length] ?? "lg:grid-cols-5",
				)}
			>
				{tiles.map((tile, index) => (
					<li
						key={tile.href}
						className={cn(tiles.length % 2 === 1 && index === 0 && "sm:col-span-2 lg:col-span-1")}
					>
						<Link
							href={tile.href}
							className={cn(
								"group relative flex aspect-[14/5] w-full sm:aspect-[14/6]",
								tiles.length > 3 ? "lg:aspect-[14/8]" : "lg:aspect-[14/6]",
								"items-center overflow-hidden rounded-lg bg-secondary transition-colors duration-300 hover:bg-secondary-foreground/10",
							)}
						>
							<span className="z-20 w-full px-4 text-center font-display text-lg font-light tracking-wide capitalize transition-transform duration-300 max-lg:w-3/5 max-lg:pl-6 max-lg:text-left sm:text-xl lg:group-hover:-translate-x-[22%]">
								{tile.label}
							</span>
							{tile.image && (
								<div className="packshot absolute top-1/2 right-0 aspect-square h-[120%] -translate-y-1/2 translate-x-[18%] grayscale transition-transform duration-300 lg:translate-x-[105%] lg:group-hover:translate-x-[22%]">
									<YNSMedia
										src={tile.image}
										alt=""
										fill
										sizes="(max-width: 1024px) 30vw, 15vw"
										className="packshot-fade object-cover object-right"
									/>
								</div>
							)}
						</Link>
					</li>
				))}
			</ul>
		</nav>
	);
}
