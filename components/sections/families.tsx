import Link from "next/link";
import { Em } from "@/components/brand/em";
import { FamilyDot } from "@/components/brand/family-dot";
import { ArrowRightIcon } from "@/components/icons";
import type { ShowcaseTile } from "@/lib/catalog";
import { cn } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";

/*
 * The original's bento of four scent families, filled with the store's categories: a large lead
 * tile, then tall and small tiles. Placement depends on how many categories there are.
 */
const PLACEMENT: Record<number, string[]> = {
	1: ["sm:col-span-2 lg:col-span-4 lg:row-span-2"],
	2: ["sm:col-span-2 lg:col-span-2 lg:row-span-2", "sm:col-span-2 lg:col-span-2 lg:row-span-2"],
	3: ["sm:col-span-2 lg:col-span-2 lg:row-span-2", "lg:row-span-2", "lg:row-span-2"],
	4: [
		"sm:col-span-2 lg:col-span-2 lg:col-start-1 lg:row-span-2 lg:row-start-1",
		"lg:col-start-3 lg:row-start-1",
		"lg:col-start-3 lg:row-start-2",
		"lg:col-start-4 lg:row-span-2 lg:row-start-1",
	],
};
/* Small tiles are too short to carry a description over the photograph. */
const COMPACT: Record<number, number[]> = { 4: [1, 2] };

export function Families({ tiles }: { tiles: (ShowcaseTile & { tone: number })[] }) {
	if (tiles.length === 0) return null;
	const count = Math.min(tiles.length, 4);
	const shown = tiles.slice(0, count);
	return (
		<section id="families" className="pb-28 md:pb-40">
			<div className="container-page">
				<div className="flex flex-wrap items-end justify-between gap-6">
					<h2 className="font-display text-title-lg md:text-title-xl">
						{count === 1 ? "One family, " : `${["", "", "Two", "Three", "Four"][count]} families, `}
						<Em>one house</Em>
					</h2>
					<Link
						href="/products"
						className="text-sm font-medium text-ink underline-offset-4 transition-colors hover:text-gold hover:underline"
					>
						Shop everything
					</Link>
				</div>
				<ul className="mt-16 grid gap-x-5 gap-y-6 sm:auto-rows-[minmax(15rem,auto)] sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-[15rem_15rem]">
					{shown.map((tile, index) => {
						const large = index === 0;
						const compact = COMPACT[count]?.includes(index) ?? false;
						return (
							<li key={tile.id} className={PLACEMENT[count]?.[index]}>
								<Link
									href={tile.href}
									className="group relative block h-full min-h-[15rem] overflow-hidden rounded-xl border border-line"
								>
									{tile.image && (
										<YNSMedia
											src={tile.image}
											alt=""
											fill
											sizes={
												large
													? "(min-width: 1024px) 50vw, 100vw"
													: "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
											}
											className="object-cover transition-transform duration-700 ease-[var(--ease-out-quart)] group-hover:scale-[1.04]"
										/>
									)}
									<div
										aria-hidden="true"
										className="absolute inset-0 bg-gradient-to-t from-page/95 via-page/45 to-page/5"
									/>
									<div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
										<div className="flex items-center gap-2.5">
											<FamilyDot index={tile.tone} />
											<h3 className={cn("font-display", large ? "text-title-md" : "text-title-sm")}>
												{tile.name}
											</h3>
										</div>
										{!compact && tile.description && (
											<p className="mt-2 line-clamp-2 max-w-[32ch] text-sm text-ink/85">{tile.description}</p>
										)}
										<span className="mt-3 inline-flex items-center gap-2 text-sm text-gold">
											Explore
											<ArrowRightIcon
												width={16}
												height={16}
												className="transition-transform group-hover:translate-x-1"
											/>
										</span>
									</div>
								</Link>
							</li>
						);
					})}
				</ul>
			</div>
		</section>
	);
}
