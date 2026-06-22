import { ArrowRightIcon } from "lucide-react";
import Image from "next/image";
import { YnsLink } from "../yns-link";

export function PromoBanner() {
	return (
		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
			<div className="grid grid-cols-1 md:grid-cols-12 gap-5">
				{/* 5% Pre-order card */}
				<div className="md:col-span-3 relative overflow-hidden rounded-3xl bg-brand text-brand-foreground p-7 min-h-[260px] flex flex-col justify-between">
					<svg
						aria-hidden="true"
						viewBox="0 0 200 200"
						className="absolute -right-10 -bottom-10 h-44 w-44 opacity-20"
					>
						<circle cx="100" cy="100" r="80" stroke="#f5efe6" strokeWidth="0.5" fill="none" />
						<circle cx="100" cy="100" r="60" stroke="#f5efe6" strokeWidth="0.5" fill="none" />
						<circle cx="100" cy="100" r="40" stroke="#f5efe6" strokeWidth="0.5" fill="none" />
					</svg>
					<div>
						<p className="text-[10px] uppercase tracking-[0.25em] text-cream/70">New Arrivals</p>
						<p className="mt-4 font-display text-5xl leading-none">
							5<span className="text-sand">%</span>
						</p>
						<p className="mt-2 font-display text-2xl leading-tight">
							Pre‑order
							<br />
							Discount
						</p>
					</div>
					<YnsLink
						href="/products"
						className="inline-flex items-center gap-2 text-sm font-medium text-cream hover:text-sand transition-colors"
					>
						Shop Now
						<ArrowRightIcon className="h-4 w-4" />
					</YnsLink>
				</div>

				{/* Nursery image */}
				<div className="md:col-span-5 relative overflow-hidden rounded-3xl min-h-[260px] bg-cream-dark">
					<Image
						src="/scraped-0.jpg"
						alt="Curated nursery interior"
						fill
						className="object-cover"
						sizes="(max-width: 768px) 100vw, 50vw"
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-brand/30 via-transparent to-transparent" />
				</div>

				{/* Baby Heaven card */}
				<div className="md:col-span-4 relative overflow-hidden rounded-3xl bg-cream p-7 min-h-[260px] flex flex-col justify-between">
					<div>
						<p className="text-[10px] uppercase tracking-[0.25em] text-brand/60">New Arrivals</p>
						<p className="mt-3 font-display text-3xl leading-tight text-brand">Baby Heaven</p>
						<p className="mt-2 text-sm text-brand/70 max-w-[15rem] leading-relaxed">
							Soft, safe, and sweetly designed essentials for the calmest nursery.
						</p>
					</div>
					<div className="relative h-24 w-full">
						<Image
							src="/scraped-1.jpg"
							alt="Baby Heaven product"
							fill
							className="object-contain object-right"
							sizes="(max-width: 768px) 100vw, 33vw"
						/>
					</div>
				</div>
			</div>
		</section>
	);
}
