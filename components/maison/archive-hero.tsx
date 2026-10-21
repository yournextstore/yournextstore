import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { isBundled } from "@/lib/editorial";
import { YNSMedia } from "@/lib/yns-media";

export type HeroTile = { label: string; href: string; src: string };

/** The archive's opening: mono kicker, serif headline and blurb beside three photographed plates. */
export function ArchiveHero({
	kicker,
	title,
	blurb,
	tiles,
}: {
	kicker: string;
	title: string;
	blurb: ReactNode;
	tiles: HeroTile[];
}) {
	return (
		<section className="flex flex-wrap items-center gap-x-6 gap-y-3.5 border-b border-line pb-6 pt-7 sm:gap-x-12 sm:gap-y-7 sm:pb-9 sm:pt-14">
			<div className="flex min-w-0 flex-[1_1_380px] flex-col">
				<div className="eti mb-[18px] tracking-[0.18em] text-acc">{kicker}</div>
				<h1 className="font-sf text-[clamp(30px,4.4vw,46px)] leading-[1.1] tracking-[-0.01em] wrap-break-word">
					{title}
				</h1>
				<div className="mt-5 max-w-[54ch] text-[14.5px] leading-[1.7] text-soft">{blurb}</div>
			</div>
			{tiles.length > 0 ? (
				<div className="no-scrollbar -mx-4 flex min-w-0 flex-[1_1_360px] snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-4 sm:mx-0 sm:snap-none sm:overflow-visible sm:px-0">
					{tiles.map((tile, index) => (
						<Link
							key={tile.href + tile.src}
							href={tile.href}
							className="hatch group relative flex aspect-[3/4] w-[64%] flex-none snap-start items-end overflow-hidden border border-line p-2.5 shadow-[0_14px_28px_-18px_oklch(0.22_0.006_0/0.45)] transition hover:border-acc sm:w-auto sm:min-w-0 sm:flex-1"
						>
							{isBundled(tile.src) ? (
								<Image
									src={tile.src}
									alt=""
									fill
									priority={index === 0}
									fetchPriority={index === 0 ? "high" : undefined}
									sizes="(max-width: 640px) 64vw, (max-width: 1240px) 20vw, 180px"
									className="object-cover"
								/>
							) : (
								<YNSMedia
									src={tile.src}
									alt=""
									fill
									priority={index === 0}
									fetchPriority={index === 0 ? "high" : undefined}
									sizes="(max-width: 640px) 64vw, (max-width: 1240px) 20vw, 180px"
									className="object-cover"
								/>
							)}
							<span className="plate-label relative transition group-hover:text-acc">{tile.label}</span>
						</Link>
					))}
				</div>
			) : null}
		</section>
	);
}
