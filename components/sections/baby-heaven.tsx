import { ArrowRightIcon } from "lucide-react";
import Image from "next/image";
import { YnsLink } from "../yns-link";

export function BabyHeaven() {
	return (
		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
				{/* Editorial copy */}
				<div className="lg:col-span-5 flex flex-col justify-center">
					<p className="text-xs uppercase tracking-[0.25em] text-brand/60">New Arrivals</p>
					<h2 className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl text-foreground leading-[1.05]">
						Baby
						<br />
						<span className="italic text-brand">Heaven.</span>
					</h2>
					<p className="mt-6 text-muted-foreground leading-relaxed max-w-md">
						Step into our hand-picked nursery edit — calm palettes, organic fabrics, and heirloom pieces
						designed to grow alongside your little one.
					</p>
					<div className="mt-8">
						<YnsLink
							href="/products"
							className="inline-flex items-center gap-2 h-12 px-7 rounded-full bg-brand text-brand-foreground text-sm font-semibold hover:bg-brand/90 transition-colors"
						>
							Shop the edit
							<ArrowRightIcon className="h-4 w-4" />
						</YnsLink>
					</div>

					<dl className="mt-10 grid grid-cols-3 gap-4 max-w-sm">
						{[
							{ k: "Organic", v: "100%" },
							{ k: "Certified", v: "OEKO‑TEX" },
							{ k: "Hand picked", v: "Always" },
						].map((s) => (
							<div key={s.k} className="border-l border-brand/20 pl-3">
								<dt className="text-[10px] uppercase tracking-widest text-brand/60">{s.k}</dt>
								<dd className="mt-1 font-display text-sm text-foreground">{s.v}</dd>
							</div>
						))}
					</dl>
				</div>

				{/* Image collage */}
				<div className="lg:col-span-7 grid grid-cols-6 grid-rows-6 gap-4 min-h-[500px]">
					<div className="col-span-4 row-span-4 relative rounded-3xl overflow-hidden bg-cream-dark">
						<Image
							src="/scraped-3.jpg"
							alt="Nursery editorial"
							fill
							className="object-cover"
							sizes="(max-width: 1024px) 100vw, 50vw"
						/>
					</div>
					<div className="col-span-2 row-span-3 relative rounded-3xl overflow-hidden bg-brand">
						<Image
							src="/scraped-4.jpg"
							alt="Baby essentials"
							fill
							className="object-cover"
							sizes="(max-width: 1024px) 50vw, 25vw"
						/>
					</div>
					<div className="col-span-2 row-span-3 relative rounded-3xl overflow-hidden bg-sand/40">
						<Image
							src="/scraped-5.jpg"
							alt="Soft toys collection"
							fill
							className="object-cover"
							sizes="(max-width: 1024px) 50vw, 25vw"
						/>
					</div>
					<div className="col-span-4 row-span-2 relative rounded-3xl overflow-hidden bg-cream p-6 flex items-center justify-between">
						<div>
							<p className="text-[10px] uppercase tracking-[0.25em] text-brand/60">Featured</p>
							<p className="mt-1 font-display text-2xl text-brand">Mom Swing Edit</p>
							<p className="text-sm text-brand/70">From $399.00</p>
						</div>
						<YnsLink
							href="/products"
							className="inline-flex h-11 items-center gap-1.5 rounded-full bg-brand px-5 text-xs font-semibold text-brand-foreground hover:bg-brand/90 transition-colors"
						>
							View
							<ArrowRightIcon className="h-3.5 w-3.5" />
						</YnsLink>
					</div>
				</div>
			</div>
		</section>
	);
}
