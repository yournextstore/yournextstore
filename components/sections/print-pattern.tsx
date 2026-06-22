import Image from "next/image";
import { YnsLink } from "../yns-link";

export function PrintAndPattern() {
	return (
		<section className="bg-background">
			<div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-14 sm:py-20">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
					{/* Large lifestyle tile */}
					<YnsLink
						prefetch="eager"
						href="/products"
						className="group relative col-span-1 lg:col-span-7 block overflow-hidden bg-forest/10"
					>
						<div className="relative aspect-[5/6] sm:aspect-[6/5] lg:aspect-[7/6]">
							<Image
								src="/scraped-3.jpg"
								alt="Print and pattern fabric detail"
								fill
								sizes="(max-width: 1024px) 100vw, 58vw"
								className="object-cover transition-transform duration-[1500ms] ease-out group-hover:scale-[1.04]"
							/>
							<div className="absolute inset-0 bg-gradient-to-r from-ink/35 via-transparent to-transparent" />
							<div className="absolute inset-y-0 left-0 flex items-center px-8 sm:px-12 lg:px-16 max-w-md">
								<div>
									<p className="text-white/85 text-[11px] tracking-[0.32em] uppercase mb-3">
										Hand-Drawn Florals
									</p>
									<h3 className="font-serif text-white text-4xl sm:text-5xl lg:text-6xl leading-[0.95] tracking-tight">
										Print &<br />
										Pattern
									</h3>
									<p className="mt-4 text-white/90 text-sm leading-relaxed font-light max-w-xs">
										Painterly botanicals embroidered onto sage cotton — every motif drawn by our in-house
										studio.
									</p>
									<span className="mt-6 inline-block text-white text-[11px] tracking-[0.24em] uppercase border-b border-white/70 pb-0.5">
										Shop The Print Edit
									</span>
								</div>
							</div>
						</div>
					</YnsLink>

					{/* Side flatlay tile */}
					<YnsLink
						prefetch="eager"
						href="/products"
						className="group relative col-span-1 lg:col-span-5 block overflow-hidden bg-stone/20"
					>
						<div className="relative aspect-[5/6] sm:aspect-[6/5] lg:aspect-[5/6] h-full">
							<Image
								src="/scraped-1.jpg"
								alt="Boho essentials flatlay"
								fill
								sizes="(max-width: 1024px) 100vw, 42vw"
								className="object-cover transition-transform duration-[1500ms] ease-out group-hover:scale-[1.04]"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-ink/0 to-ink/0" />
							<div className="absolute inset-x-0 bottom-0 p-8 sm:p-10">
								<p className="text-white/85 text-[11px] tracking-[0.32em] uppercase mb-2">Layer With</p>
								<h3 className="font-serif text-white text-3xl sm:text-4xl tracking-tight">Boho Essentials</h3>
								<span className="mt-4 inline-block text-white text-[11px] tracking-[0.24em] uppercase border-b border-white/70 pb-0.5">
									Shop The Edit
								</span>
							</div>
						</div>
					</YnsLink>
				</div>
			</div>
		</section>
	);
}
