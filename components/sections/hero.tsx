import { commerce } from "@/lib/commerce";
import { YNSMedia } from "@/lib/yns-media";
import { YnsLink } from "../yns-link";

export async function Hero() {
	const browse = await commerce.productBrowse({ active: true, limit: 2 });
	const featured = browse.data[0];
	const companion = browse.data[1] ?? browse.data[0];

	const featuredImage = featured?.images?.[0] ?? featured?.variants?.[0]?.images?.[0];
	const companionImage = companion?.images?.[0] ?? companion?.variants?.[0]?.images?.[0];

	return (
		<section className="relative overflow-hidden hero-backdrop">
			<div className="max-w-[1400px] mx-auto px-6 lg:px-10 pt-10 pb-24 lg:pt-14 lg:pb-32">
				{/* Top metadata strip */}
				<div className="grid grid-cols-12 gap-6 text-[11px] tracking-[0.22em] uppercase text-foreground/60">
					<div className="col-span-12 lg:col-span-4 flex items-center gap-3">
						<span className="block h-px w-8 bg-foreground/30" />
						<span>Vol. 07 — Editorial</span>
					</div>
					<div className="col-span-12 lg:col-span-4 text-center hidden lg:block">
						Featured object · No. 1955
					</div>
					<div className="col-span-12 lg:col-span-4 lg:text-right">
						<span className="inline-flex items-center gap-3">
							<span>Spring / Summer Catalogue</span>
							<span className="block h-px w-8 bg-foreground/30" />
						</span>
					</div>
				</div>

				{/* Main editorial composition */}
				<div className="relative mt-10 lg:mt-14">
					{/* Headline split across viewport */}
					<div className="relative grid grid-cols-12 items-center">
						<h1
							aria-label="The Series Seven"
							className="col-span-12 text-center pointer-events-none select-none"
						>
							<div className="display-italic text-[20vw] lg:text-[15vw] leading-[0.85] tracking-[-0.04em] text-foreground relative z-0">
								<span className="block">
									<span className="align-middle text-[0.4em] tracking-[0.18em] uppercase font-sans not-italic text-foreground/50 mr-4">
										(&nbsp;The&nbsp;)
									</span>
									<span>Series</span>
								</span>
								<span className="block -mt-[0.18em] text-right">
									Seven
									<span className="align-baseline text-[0.32em] tracking-[0.18em] uppercase font-sans not-italic text-foreground/50 ml-4">
										(&nbsp;07&nbsp;)
									</span>
								</span>
							</div>
						</h1>

						{/* Centered chair / featured product — overlays the headline */}
						<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
							<div className="relative w-[46%] lg:w-[34%] aspect-[3/4]">
								<div className="absolute inset-x-0 bottom-[-6%] h-[18%] hero-ground" />
								{featuredImage ? (
									<YNSMedia
										src={featuredImage}
										alt={featured?.name ?? "Featured product"}
										fill
										priority
										sizes="(max-width: 1024px) 60vw, 34vw"
										className="object-contain drop-shadow-[0_30px_40px_rgba(26,26,26,0.25)]"
									/>
								) : (
									<HeroChairPlaceholder />
								)}
							</div>
						</div>
					</div>

					{/* Bottom meta columns */}
					<div className="relative mt-10 lg:mt-16 grid grid-cols-12 gap-6 lg:gap-10 items-end">
						<div className="col-span-12 sm:col-span-6 lg:col-span-3 space-y-3">
							<div
								className="text-[11px] tracking-[0.22em] uppercase text-ember"
								style={{ color: "#c97a2b" }}
							>
								70 years of design
							</div>
							<p className="text-sm text-foreground/70 leading-relaxed max-w-[24ch]">
								Celebrating seven decades of the world&apos;s most iconic chair — still hand-finished, one
								form at a time.
							</p>
							<div className="pt-2 flex items-center gap-3 text-[11px] tracking-[0.2em] uppercase text-foreground/60">
								<span>(&nbsp;01&nbsp;)</span>
								<span className="block h-px w-12 bg-foreground/30" />
								<span>Story</span>
							</div>
						</div>

						<div className="hidden lg:flex col-span-6 items-center justify-center gap-6 text-foreground/40 text-[11px] tracking-[0.24em] uppercase">
							<span>Scroll</span>
							<span className="block h-[1px] w-24 bg-foreground/30" />
							<span>Begin</span>
						</div>

						<div className="col-span-12 sm:col-span-6 lg:col-span-3 lg:text-right space-y-3">
							<div className="text-[11px] tracking-[0.22em] uppercase text-foreground/60">
								Iconic shape · Danish design
							</div>
							<p className="text-sm text-foreground/70 leading-relaxed max-w-[28ch] lg:ml-auto">
								Discover our edit of design objects — sculptural, archival, and made to outlive the trend
								cycle.
							</p>
							<div className="pt-2 flex lg:justify-end items-center gap-3 text-[11px] tracking-[0.2em] uppercase text-foreground/60">
								<span>Catalogue</span>
								<span className="block h-px w-12 bg-foreground/30" />
								<span>(&nbsp;∞&nbsp;)</span>
							</div>
						</div>
					</div>

					{/* Floating companion product card — warm orange */}
					<div className="absolute right-0 -bottom-6 hidden md:block">
						<YnsLink
							prefetch={"eager"}
							href={companion ? `/product/${companion.slug}` : "/products"}
							className="group relative flex w-[200px] overflow-hidden rounded-md shadow-[0_20px_40px_-12px_rgba(26,26,26,0.4)]"
						>
							<div className="ember-card relative w-[110px] aspect-[3/4] grain">
								{companionImage ? (
									<YNSMedia
										src={companionImage}
										alt={companion?.name ?? "Companion"}
										fill
										sizes="110px"
										className="object-contain p-3 transition-transform duration-700 group-hover:scale-105"
									/>
								) : (
									<HeroChairPlaceholder fill="#fff8ed" />
								)}
							</div>
							<div
								className="flex-1 bg-paper text-foreground p-3 flex flex-col justify-between"
								style={{ backgroundColor: "#F4F1EC" }}
							>
								<div>
									<div className="text-[9px] tracking-[0.2em] uppercase text-foreground/50">Companion</div>
									<div className="mt-1 display-italic text-base leading-tight">
										{companion?.name ?? "Series 3107"}
									</div>
								</div>
								<div className="text-[10px] tracking-[0.18em] uppercase text-foreground/60 flex items-center gap-1">
									Shop
									<span>→</span>
								</div>
							</div>
						</YnsLink>
					</div>
				</div>
			</div>

			{/* Soft window-light decorative stripes */}
			<div
				aria-hidden
				className="pointer-events-none absolute inset-0"
				style={{
					backgroundImage:
						"linear-gradient(115deg, transparent 35%, rgba(255,255,255,0.35) 45%, transparent 55%, transparent 70%, rgba(255,255,255,0.18) 80%, transparent 90%)",
					mixBlendMode: "overlay",
				}}
			/>
		</section>
	);
}

function HeroChairPlaceholder({ fill = "#d4a574" }: { fill?: string }) {
	return (
		<svg viewBox="0 0 240 320" className="absolute inset-0 w-full h-full" aria-hidden>
			<defs>
				<linearGradient id="chairGrad" x1="0" y1="0" x2="1" y2="1">
					<stop offset="0%" stopColor={fill} stopOpacity="1" />
					<stop offset="100%" stopColor="#a8743b" stopOpacity="1" />
				</linearGradient>
			</defs>
			<path d="M55 30 Q120 0 185 30 L175 165 Q120 175 65 165 Z" fill="url(#chairGrad)" opacity="0.95" />
			<ellipse cx="120" cy="180" rx="80" ry="14" fill="#a8743b" />
			<rect x="60" y="180" width="6" height="120" fill="#8a8a8a" />
			<rect x="174" y="180" width="6" height="120" fill="#8a8a8a" />
			<rect x="117" y="180" width="6" height="120" fill="#8a8a8a" />
			<ellipse cx="120" cy="305" rx="62" ry="8" fill="#1a1a1a" opacity="0.18" />
		</svg>
	);
}
