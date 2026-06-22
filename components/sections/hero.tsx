import { ArrowRight, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { cacheLife } from "next/cache";
import Image from "next/image";
import { commerce } from "@/lib/commerce";
import { CURRENCY, LOCALE } from "@/lib/constants";
import { formatMoney } from "@/lib/money";
import { YnsLink } from "../yns-link";

async function FeaturedProductCard() {
	"use cache";
	cacheLife("minutes");

	const { data } = await commerce.productBrowse({ active: true, limit: 1 });
	const product = data[0];

	if (!product) return null;

	const variant = product.variants?.[0];
	const price = variant ? formatMoney({ amount: variant.price, currency: CURRENCY, locale: LOCALE }) : null;
	const image = product.images?.[0] ?? variant?.images?.[0];

	return (
		<YnsLink
			href={`/product/${product.slug}`}
			prefetch={"eager"}
			className="luxe-glass group block rounded-3xl p-3 sm:p-4"
		>
			<div className="flex items-center gap-3 sm:gap-4">
				<div className="relative aspect-square h-20 w-20 sm:h-24 sm:w-24 shrink-0 overflow-hidden rounded-2xl bg-[color:var(--color-luxe-cream)]">
					{image ? (
						<Image src={image} alt={product.name} fill sizes="96px" className="object-cover" unoptimized />
					) : null}
				</div>
				<div className="min-w-0 flex-1">
					<div className="flex items-center gap-1.5">
						<span className="rounded-full bg-[color:var(--color-luxe-violet)]/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[color:var(--color-luxe-violet)]">
							New
						</span>
					</div>
					<h3 className="mt-1 truncate text-sm font-semibold text-foreground">{product.name}</h3>
					<div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
						<div className="flex">
							{Array.from({ length: 5 }).map((_, i) => (
								<Star
									key={`star-${i}`}
									className="h-2.5 w-2.5 fill-[color:var(--color-luxe-violet)] text-[color:var(--color-luxe-violet)]"
								/>
							))}
						</div>
						<span>(340)</span>
					</div>
					<div className="mt-2 flex items-center justify-between gap-2">
						<span className="text-sm font-bold text-foreground">{price}</span>
						<span className="inline-flex items-center gap-1 rounded-full bg-foreground px-3 py-1.5 text-[11px] font-semibold text-background transition-transform group-hover:scale-[1.03]">
							Shop Now
							<ArrowRight className="h-3 w-3" />
						</span>
					</div>
				</div>
			</div>
			<div className="mt-3 flex items-center justify-between border-t border-white/40 pt-2.5 text-[11px] text-muted-foreground">
				<div className="flex items-center gap-1">
					<button
						type="button"
						aria-label="Previous"
						className="flex h-6 w-6 items-center justify-center rounded-full border border-border/60 hover:bg-white"
					>
						<ChevronLeft className="h-3 w-3" />
					</button>
					<button
						type="button"
						aria-label="Next"
						className="flex h-6 w-6 items-center justify-center rounded-full border border-border/60 hover:bg-white"
					>
						<ChevronRight className="h-3 w-3" />
					</button>
				</div>
				<span className="font-mono">1 / 7</span>
			</div>
		</YnsLink>
	);
}

function AvatarStack() {
	const stops = [
		["#7B5BD6", "#C9A7E8"],
		["#F0B8C8", "#7B5BD6"],
		["#C9A7E8", "#F0B8C8"],
		["#2A1F4A", "#7B5BD6"],
	] as const;

	return (
		<div className="flex -space-x-2">
			{stops.map(([a, b], i) => (
				<div
					key={`av-${i}`}
					className="h-7 w-7 rounded-full border-2 border-white shadow-sm"
					style={{ background: `linear-gradient(135deg, ${a}, ${b})` }}
				/>
			))}
			<div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-foreground text-[10px] font-semibold text-background">
				+
			</div>
		</div>
	);
}

function OrdersChart() {
	return (
		<div className="luxe-glass rounded-3xl p-4 w-56">
			<div className="flex items-start justify-between">
				<div>
					<p className="text-[11px] text-muted-foreground">Orders on</p>
					<p className="text-sm font-semibold text-foreground">Platform</p>
				</div>
				<div className="flex h-7 w-7 items-center justify-center rounded-full bg-foreground text-background">
					<ArrowRight className="h-3 w-3 -rotate-45" />
				</div>
			</div>
			<svg viewBox="0 0 200 80" className="mt-3 w-full" aria-hidden>
				<defs>
					<linearGradient id="luxeLine" x1="0%" y1="0%" x2="100%" y2="0%">
						<stop offset="0%" stopColor="#7B5BD6" />
						<stop offset="100%" stopColor="#F0B8C8" />
					</linearGradient>
					<linearGradient id="luxeFill" x1="0%" y1="0%" x2="0%" y2="100%">
						<stop offset="0%" stopColor="#7B5BD6" stopOpacity="0.35" />
						<stop offset="100%" stopColor="#7B5BD6" stopOpacity="0" />
					</linearGradient>
				</defs>
				<path
					d="M0 60 C 25 55, 40 48, 55 50 S 90 30, 110 35 S 150 12, 200 20 L 200 80 L 0 80 Z"
					fill="url(#luxeFill)"
				/>
				<path
					d="M0 60 C 25 55, 40 48, 55 50 S 90 30, 110 35 S 150 12, 200 20"
					fill="none"
					stroke="url(#luxeLine)"
					strokeWidth="2.5"
					strokeLinecap="round"
				/>
				<circle cx="155" cy="22" r="4" fill="#7B5BD6" stroke="white" strokeWidth="2" />
				<g transform="translate(135 0)">
					<rect x="0" y="0" width="42" height="18" rx="9" fill="#1A1530" />
					<text x="21" y="12" textAnchor="middle" fill="white" fontSize="10" fontWeight="600">
						+2.3k
					</text>
				</g>
			</svg>
			<div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
				<span>Jan</span>
				<span>Feb</span>
				<span>Mar</span>
				<span>Apr</span>
			</div>
			<p className="mt-2 text-right text-[10px] font-mono text-muted-foreground">#2026</p>
		</div>
	);
}

function HeroBottle() {
	return (
		<div className="relative mx-auto h-full w-full max-w-[560px]">
			{/* glow */}
			<div className="absolute left-1/2 top-1/2 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 bg-luxe-violet-glow" />
			<div className="absolute left-1/3 top-2/3 h-[60%] w-[60%] -translate-x-1/2 -translate-y-1/2 bg-luxe-pink-glow" />

			{/* SVG bottle */}
			<div className="relative h-[480px] sm:h-[540px] flex items-end justify-center animate-luxe-float">
				<svg viewBox="0 0 280 460" className="h-full w-auto drop-shadow-[0_30px_60px_rgba(123,91,214,0.45)]">
					<defs>
						<linearGradient id="bottleBody" x1="0%" y1="0%" x2="100%" y2="100%">
							<stop offset="0%" stopColor="#F0B8C8" />
							<stop offset="35%" stopColor="#C9A7E8" />
							<stop offset="70%" stopColor="#7B5BD6" />
							<stop offset="100%" stopColor="#2A1F4A" />
						</linearGradient>
						<linearGradient id="bottleHighlight" x1="0%" y1="0%" x2="100%" y2="0%">
							<stop offset="0%" stopColor="white" stopOpacity="0.5" />
							<stop offset="50%" stopColor="white" stopOpacity="0" />
							<stop offset="100%" stopColor="white" stopOpacity="0.35" />
						</linearGradient>
						<linearGradient id="capGrad" x1="0%" y1="0%" x2="0%" y2="100%">
							<stop offset="0%" stopColor="#3C2D5E" />
							<stop offset="55%" stopColor="#8A6BC4" />
							<stop offset="100%" stopColor="#1A1530" />
						</linearGradient>
						<radialGradient id="ring" cx="50%" cy="50%" r="50%">
							<stop offset="0%" stopColor="#F0B8C8" />
							<stop offset="100%" stopColor="#7B5BD6" />
						</radialGradient>
					</defs>

					{/* base shadow */}
					<ellipse cx="140" cy="450" rx="110" ry="10" fill="#1A1530" opacity="0.35" />

					{/* bottle body */}
					<rect x="50" y="160" width="180" height="280" rx="28" fill="url(#bottleBody)" />
					<rect x="50" y="160" width="180" height="280" rx="28" fill="url(#bottleHighlight)" opacity="0.6" />

					{/* vertical stripes for fluted glass */}
					{Array.from({ length: 7 }).map((_, i) => (
						<rect
							key={`stripe-${i}`}
							x={60 + i * 24}
							y={170}
							width="2"
							height="260"
							rx="1"
							fill="white"
							opacity="0.15"
						/>
					))}

					{/* neck ring (neon) */}
					<rect x="40" y="140" width="200" height="32" rx="16" fill="url(#ring)" />
					<rect x="40" y="140" width="200" height="32" rx="16" fill="white" opacity="0.18" />

					{/* shoulder ring gold */}
					<rect x="60" y="172" width="160" height="6" fill="#D4A463" opacity="0.9" />

					{/* neck */}
					<rect x="100" y="100" width="80" height="50" rx="6" fill="url(#capGrad)" />

					{/* cap */}
					<rect x="92" y="60" width="96" height="46" rx="10" fill="url(#capGrad)" />
					<rect x="92" y="60" width="96" height="10" rx="5" fill="white" opacity="0.25" />

					{/* atomizer pin */}
					<rect x="132" y="44" width="16" height="20" rx="3" fill="#1A1530" />
					<circle cx="140" cy="42" r="6" fill="#D4A463" />

					{/* logo plate */}
					<rect x="80" y="310" width="120" height="30" rx="6" fill="#1A1530" opacity="0.85" />
					<text
						x="140"
						y="330"
						textAnchor="middle"
						fill="#F4E9F1"
						fontFamily="'Bebas Neue', sans-serif"
						fontSize="20"
						letterSpacing="3"
					>
						YNS
					</text>
				</svg>
			</div>
		</div>
	);
}

export function Hero() {
	return (
		<section className="relative">
			<div className="relative mx-3 mt-3 overflow-hidden rounded-[28px] bg-luxe-canvas luxe-grain border border-white/60 shadow-[0_30px_80px_-30px_rgba(26,21,48,0.45)] sm:mx-5 sm:mt-5">
				{/* Top row: oversized headline + rating + badge */}
				<div className="relative px-4 pt-8 sm:px-10 sm:pt-12 lg:px-16 lg:pt-14">
					<div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:gap-6">
						<h1 className="font-display text-[14vw] leading-[0.88] sm:text-7xl lg:text-[8.5rem] xl:text-[9.5rem] text-foreground luxe-text-gradient max-w-[10ch]">
							Scented
							<br />
							Stories of
							<br />
							Luxury
						</h1>
						<div className="flex items-end gap-4 pb-4">
							<div>
								<p className="font-display text-5xl lg:text-6xl text-foreground">4.8</p>
								<p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Reviews</p>
							</div>
							{/* hand-drawn arrow */}
							<svg
								viewBox="0 0 120 80"
								className="hidden h-16 w-24 text-[color:var(--color-luxe-ink)] lg:block"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								aria-hidden
							>
								<path d="M5 60 Q 40 5, 95 30" strokeDasharray="3 5" />
								<path d="M90 22 L 100 33 L 88 38" fill="none" />
							</svg>
							<div className="relative ml-auto h-24 w-24 sm:h-28 sm:w-28">
								<div className="absolute inset-0 luxe-starburst" />
								<div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
									<span className="font-display text-2xl leading-none">1180+</span>
									<span className="text-[10px] uppercase tracking-widest">Products</span>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Main composition */}
				<div className="grid grid-cols-12 gap-4 px-4 pb-8 pt-6 sm:px-10 sm:pb-12 lg:px-16 lg:gap-8 lg:pb-16">
					{/* Left column — intro + CTA + social proof + chart */}
					<div className="col-span-12 flex flex-col gap-6 lg:col-span-3">
						<p className="text-sm leading-relaxed text-muted-foreground max-w-xs">
							Our exclusive collection of perfumes has been meticulously crafted to envelop you in a world of
							luxury and sophistication.
						</p>
						<div className="flex items-center gap-2">
							<YnsLink
								href="#products"
								prefetch={"eager"}
								className="luxe-pill inline-flex h-12 items-center gap-2 rounded-full px-6 text-sm font-semibold"
							>
								Join Us
								<span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15">
									<ArrowRight className="h-3.5 w-3.5" />
								</span>
							</YnsLink>
						</div>

						<div className="luxe-glass rounded-2xl px-4 py-3">
							<p className="font-display text-3xl leading-none text-foreground">
								2K<span className="text-[color:var(--color-luxe-violet)]">+</span>
							</p>
							<div className="mt-2 flex items-center gap-3">
								<AvatarStack />
								<p className="text-[11px] text-muted-foreground">Satisfied Customers</p>
							</div>
						</div>

						<div className="hidden lg:block">
							<OrdersChart />
						</div>
					</div>

					{/* Center — bottle */}
					<div className="relative col-span-12 lg:col-span-6">
						<HeroBottle />

						{/* Floating chip card with second product */}
						<div className="absolute left-0 top-1/3 hidden -translate-x-1/4 rotate-[-8deg] sm:block">
							<div className="luxe-glass rounded-3xl p-3 animate-luxe-float">
								<div className="relative h-20 w-20 overflow-hidden rounded-2xl bg-[color:var(--color-luxe-cream)]">
									<svg viewBox="0 0 80 80" className="h-full w-full">
										<defs>
											<linearGradient id="mini" x1="0%" y1="0%" x2="100%" y2="100%">
												<stop offset="0%" stopColor="#F0B8C8" />
												<stop offset="100%" stopColor="#7B5BD6" />
											</linearGradient>
										</defs>
										<rect x="20" y="22" width="40" height="46" rx="4" fill="url(#mini)" />
										<rect x="28" y="14" width="24" height="10" rx="2" fill="#1A1530" />
										<rect x="32" y="8" width="16" height="8" rx="2" fill="#D4A463" />
									</svg>
								</div>
							</div>
						</div>
					</div>

					{/* Right column — 20% off + featured product card */}
					<div className="col-span-12 flex flex-col gap-6 lg:col-span-3">
						<div className="text-right">
							<p className="font-display text-5xl text-foreground sm:text-6xl">20% OFF</p>
							<p className="mt-1 text-sm text-muted-foreground">Our all new arrivals</p>
							<YnsLink
								href="/products"
								prefetch={"eager"}
								className="mt-3 inline-block text-sm font-semibold underline decoration-[color:var(--color-luxe-violet)] decoration-2 underline-offset-4 hover:text-[color:var(--color-luxe-violet)]"
							>
								Explore More
							</YnsLink>
						</div>

						<FeaturedProductCard />
					</div>
				</div>
			</div>
		</section>
	);
}
