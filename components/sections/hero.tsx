import { ArrowRightIcon } from "lucide-react";
import { cacheLife } from "next/cache";
import Image from "next/image";
import { commerce } from "@/lib/commerce";
import { YnsLink } from "../yns-link";

const accents = [
	{ bg: "#7FD9A8", label: "Mint Fresh" },
	{ bg: "#F2B441", label: "Honey Crunch" },
	{ bg: "#5BC8DC", label: "Cool Vanilla" },
	{ bg: "#C99683", label: "Cocoa Rich" },
];

export async function Hero() {
	"use cache";
	cacheLife("minutes");

	const { data } = await commerce.productBrowse({ active: true, limit: 4 });
	const products = data.slice(0, 4);

	return (
		<section className="relative bg-black text-white overflow-hidden">
			{/* Glow gradients */}
			<div
				aria-hidden
				className="pointer-events-none absolute inset-x-0 -top-32 h-[80vh] yns-gradient-cyan"
			/>
			<div
				aria-hidden
				className="pointer-events-none absolute inset-0 opacity-40"
				style={{
					backgroundImage: "url(/hero-bg-1.svg)",
					backgroundSize: "cover",
					backgroundPosition: "center",
					mixBlendMode: "screen",
				}}
			/>

			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-20 sm:pb-28">
				{/* Pint row — uses real product imagery */}
				<div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5 lg:gap-8 mb-12 sm:mb-16">
					{products.length > 0
						? products.map((product, i) => {
								const accent = accents[i % accents.length];
								const image = product.images?.[0];
								return (
									<YnsLink
										prefetch="eager"
										key={product.id}
										href={`/product/${product.slug}`}
										className="group relative flex flex-col items-center"
									>
										<div
											aria-hidden
											className="absolute -inset-x-4 -inset-y-6 rounded-[60%] blur-3xl opacity-30 group-hover:opacity-50 transition-opacity"
											style={{ background: accent.bg }}
										/>
										<div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-zinc-900 ring-1 ring-white/10 transition-transform duration-500 group-hover:-translate-y-2">
											{image ? (
												<Image
													src={image}
													alt={product.name}
													fill
													sizes="(max-width:768px) 45vw, 22vw"
													className="object-cover"
												/>
											) : (
												<div
													className="absolute inset-0"
													style={{
														background: `linear-gradient(160deg, ${accent.bg} 0%, #000 100%)`,
													}}
												/>
											)}
										</div>
										<span className="relative mt-4 font-display uppercase text-[11px] sm:text-xs tracking-[0.2em] text-white/80 group-hover:text-white">
											{product.name}
										</span>
									</YnsLink>
								);
							})
						: accents.map((accent) => (
								<div key={accent.label} className="relative flex flex-col items-center">
									<div
										aria-hidden
										className="absolute -inset-x-4 -inset-y-6 rounded-[60%] blur-3xl opacity-30"
										style={{ background: accent.bg }}
									/>
									<div
										className="relative aspect-square w-full overflow-hidden rounded-2xl ring-1 ring-white/10"
										style={{
											background: `linear-gradient(160deg, ${accent.bg} 0%, #000 100%)`,
										}}
									/>
									<span className="relative mt-4 font-display uppercase text-[11px] sm:text-xs tracking-[0.2em] text-white/80">
										{accent.label}
									</span>
								</div>
							))}
				</div>

				{/* Headline */}
				<div className="text-center max-w-4xl mx-auto">
					<h1 className="font-display uppercase text-5xl sm:text-7xl lg:text-8xl leading-[0.92] tracking-tight">
						<span className="block">Protein Packed.</span>
						<span className="block text-white/90">Full Flavor.</span>
						<span className="block">
							No <span className="text-[var(--yns-cyan)]">Fake Stuff.</span>
						</span>
					</h1>
					<p className="mt-8 text-base sm:text-lg text-white/60 max-w-xl mx-auto">
						Real ingredients. 30g of protein per pint. Made for people who refuse to choose between dessert
						and a clean label.
					</p>
					<div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
						<YnsLink
							prefetch="eager"
							href="#products"
							className="yns-pill-shadow inline-flex h-14 items-center justify-center gap-2 rounded-full bg-white px-10 font-display uppercase tracking-[0.14em] text-[14px] text-black hover:bg-[var(--yns-cyan)] transition-colors"
						>
							Shop the Drop
							<ArrowRightIcon className="h-4 w-4" />
						</YnsLink>
						<YnsLink
							prefetch="eager"
							href="#story"
							className="inline-flex h-14 items-center justify-center gap-2 rounded-full border border-white/20 px-8 font-display uppercase tracking-[0.14em] text-[13px] text-white hover:border-white/60 transition-colors"
						>
							Our Story
						</YnsLink>
					</div>
				</div>
			</div>
		</section>
	);
}
