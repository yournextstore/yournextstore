import Image from "next/image";
import { YnsLink } from "../yns-link";

export function Sustainability() {
	return (
		<section className="bg-background py-16 sm:py-24">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-end justify-between mb-10">
					<div>
						<p className="text-[11px] uppercase tracking-[0.22em] text-[--oxblood] font-semibold">
							Made with intent
						</p>
						<h2 className="mt-3 display-section text-3xl sm:text-4xl text-foreground tracking-tight">
							Sustainability & Community
						</h2>
					</div>
					<YnsLink
						href="/products"
						className="hidden sm:inline-flex items-center text-xs uppercase tracking-[0.18em] font-semibold text-foreground/70 hover:text-foreground"
					>
						Learn more →
					</YnsLink>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<article className="group relative aspect-[5/4] overflow-hidden bg-[--ink]">
						<Image
							src="/scraped-4.jpg"
							alt="Sustainable practices"
							fill
							sizes="(max-width: 768px) 100vw, 50vw"
							className="object-cover opacity-90 transition-transform duration-700 group-hover:scale-[1.03]"
						/>
						<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
						<div className="absolute inset-x-0 bottom-0 p-7 sm:p-10 text-white">
							<p className="text-[11px] uppercase tracking-[0.22em] text-white/70">Responsible fabrics</p>
							<h3 className="mt-2 display-section text-2xl sm:text-3xl">
								80% recycled or recyclable by 2027
							</h3>
							<p className="mt-3 text-sm sm:text-base text-white/80 max-w-md">
								Every fiber chosen with a smaller footprint in mind — from recycled poly to plant-based
								Tencel.
							</p>
						</div>
					</article>

					<article className="group relative aspect-[5/4] overflow-hidden bg-[--clay]">
						<Image
							src="/scraped-5.jpg"
							alt="Community impact"
							fill
							sizes="(max-width: 768px) 100vw, 50vw"
							className="object-cover opacity-90 transition-transform duration-700 group-hover:scale-[1.03]"
						/>
						<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
						<div className="absolute inset-x-0 bottom-0 p-7 sm:p-10 text-white">
							<p className="text-[11px] uppercase tracking-[0.22em] text-white/70">Community</p>
							<h3 className="mt-2 display-section text-2xl sm:text-3xl">1% of sales given back, locally</h3>
							<p className="mt-3 text-sm sm:text-base text-white/80 max-w-md">
								Supporting youth athletics, coastal cleanups, and mental wellness programs in every city we
								call home.
							</p>
						</div>
					</article>
				</div>
			</div>
		</section>
	);
}
