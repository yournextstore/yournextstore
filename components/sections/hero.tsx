import { ArrowRightIcon, ChevronRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { YNSMedia } from "@/lib/yns-media";

type Tile = { name: string; image: string } | null;

function PromoTile({
	href,
	title,
	tile,
	className,
	gradient,
}: {
	href: string;
	title: string;
	tile: Tile;
	className: string;
	gradient: string;
}) {
	return (
		<Link
			href={href}
			className={`group flex w-full flex-1 items-center justify-between gap-4 rounded-3xl p-6 px-8 ${className}`}
		>
			<div>
				<p
					className={`max-w-40 bg-linear-to-r from-slate-800 bg-clip-text text-3xl font-medium text-transparent ${gradient}`}
				>
					{title}
				</p>
				<p className="mt-4 flex items-center gap-1 text-slate-700">
					View more <ArrowRightIcon className="size-[18px] transition-all group-hover:ml-2" aria-hidden />
				</p>
			</div>
			{tile && (
				// Studio photos on pale grey: multiply drops the backdrop into the pastel card,
				// the radial mask fades the square's edge.
				<div className="relative size-32 shrink-0 mix-blend-multiply sm:size-36">
					<YNSMedia
						src={tile.image}
						alt=""
						fill
						sizes="144px"
						className="object-contain transition duration-300 [mask-image:radial-gradient(closest-side,#000_70%,transparent)] group-hover:scale-105"
					/>
				</div>
			)}
		</Link>
	);
}

export function Hero({
	startsFrom,
	tileA,
	tileB,
	freeShipping,
	marquee,
}: {
	startsFrom: string | null;
	tileA: Tile;
	tileB: Tile;
	freeShipping: string | null;
	marquee: ReactNode;
}) {
	return (
		<div className="px-6">
			<div className="mx-auto my-10 flex max-w-7xl gap-8 max-xl:flex-col">
				<div className="group relative flex flex-1 flex-col overflow-hidden rounded-3xl bg-green-200 xl:min-h-100">
					<div className="relative z-10 p-5 sm:p-16">
						<Link
							href="/products"
							className="inline-flex items-center gap-3 rounded-full bg-green-300 p-1 pr-4 text-xs text-green-800 sm:text-sm"
						>
							<span className="rounded-full bg-go-green-ink px-3 py-1 text-xs text-white max-sm:ml-1">
								NEWS
							</span>
							{freeShipping ? `Free shipping on orders above ${freeShipping}!` : "New arrivals are in!"}
							<ChevronRightIcon className="transition-all group-hover:ml-2" size={16} aria-hidden />
						</Link>
						<h1 className="my-3 max-w-xs bg-linear-to-r from-slate-600 to-[#5fd12b] bg-clip-text text-3xl font-medium leading-[1.2] text-transparent sm:max-w-md sm:text-5xl">
							Clever gadgets you&apos;ll love. Prices you&apos;ll trust.
						</h1>
						{startsFrom && (
							<div className="mt-4 text-sm font-medium text-slate-800 sm:mt-8">
								<p>Starts from</p>
								<p className="text-3xl">{startsFrom}</p>
							</div>
						)}
						<Link
							href="/products"
							className="mt-4 inline-block rounded-md bg-slate-800 px-7 py-2.5 text-sm text-white transition hover:scale-[1.03] hover:bg-slate-900 active:scale-95 sm:mt-10 sm:px-12 sm:py-5"
						>
							SHOP NOW
						</Link>
					</div>
					{/* Editorial still life on white: multiply drops the white sweep into the green card. */}
					<div className="relative aspect-[3/2] w-full mix-blend-multiply sm:absolute sm:right-0 sm:bottom-0 sm:w-[60%] sm:max-w-xl">
						<Image
							src="/images/pexels/hero-eyewear.jpg"
							alt=""
							fill
							priority
							sizes="(max-width: 640px) 100vw, (max-width: 1280px) 60vw, 576px"
							className="object-cover brightness-[1.08] contrast-[1.08] [mask-image:linear-gradient(to_bottom,transparent,#000_25%)] sm:[mask-composite:intersect] sm:[mask-image:linear-gradient(to_right,transparent,#000_35%),linear-gradient(to_bottom,transparent,#000_20%)]"
						/>
					</div>
				</div>
				<div className="flex w-full flex-col gap-5 text-sm md:flex-row xl:max-w-sm xl:flex-col">
					<PromoTile
						href="/products"
						title="Best products"
						tile={tileA}
						className="bg-orange-200"
						gradient="to-[#c26a00]"
					/>
					<PromoTile
						href="/products?sort=newest"
						title="New arrivals"
						tile={tileB}
						className="bg-blue-200"
						gradient="to-[#2f6fd0]"
					/>
				</div>
			</div>
			{marquee}
		</div>
	);
}
