import { ArrowRightIcon } from "lucide-react";
import Image from "next/image";
import { YnsLink } from "../yns-link";

const fabricSwatches = [
	{ name: "Oat", color: "#e6dcc4" },
	{ name: "Bone", color: "#efe8d8" },
	{ name: "Stone", color: "#cfc6b3" },
	{ name: "Sage", color: "#9aa899" },
	{ name: "Clay", color: "#b9763a" },
	{ name: "Ochre", color: "#caa15a" },
	{ name: "Walnut", color: "#7a5a40" },
	{ name: "Cream", color: "#f6f1e4" },
];

const leatherSwatches = [
	{ name: "Tan", color: "#c89b6e" },
	{ name: "Sand", color: "#b9a07a" },
	{ name: "Putty", color: "#d8cdb6" },
	{ name: "Mist", color: "#e6e3da" },
	{ name: "Olive", color: "#7b7459" },
	{ name: "Black", color: "#1d1d1b" },
];

export function Hero() {
	return (
		<section className="bg-paper-grain border-b hairline">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 lg:pt-14 lg:pb-24">
				<div className="grid grid-cols-1 lg:grid-cols-[1.35fr_1fr] gap-10 lg:gap-14 items-start">
					{/* LEFT: stacked editorial product photography */}
					<div className="space-y-4 lg:space-y-5">
						<div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-[var(--cream-deep)]">
							<Image
								src="/scraped-0.jpg"
								alt="Modular sofa in Scandinavian living room"
								fill
								priority
								sizes="(max-width: 1024px) 100vw, 60vw"
								className="object-cover"
							/>
						</div>
						<div className="relative grid grid-cols-[1fr_1.05fr] gap-4 lg:gap-5">
							<div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-[var(--cream-deep)]">
								<Image
									src="/scraped-1.jpg"
									alt="Sofa detail"
									fill
									sizes="(max-width: 1024px) 50vw, 30vw"
									className="object-cover"
								/>
							</div>
							<div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-[var(--forest)] text-[var(--cream)] p-7 lg:p-9 flex flex-col justify-between">
								<svg
									aria-hidden="true"
									viewBox="0 0 100 100"
									className="absolute -right-6 -top-6 w-44 h-44 text-[var(--cream)]/8"
								>
									<title>Decorative</title>
									<circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.5" />
									<circle cx="50" cy="50" r="34" fill="none" stroke="currentColor" strokeWidth="0.5" />
									<circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="0.5" />
								</svg>
								<div className="relative">
									<p className="eyebrow text-[var(--cream)]/60 mb-4">No. 04 — Editorial</p>
									<p className="font-display text-2xl lg:text-[1.6rem] leading-[1.2]">
										Elegant and considered, this sofa lends the interior a modern warmth — refined,
										sophisticated, quietly assured.
									</p>
								</div>
								<p className="relative font-display italic text-sm text-[var(--cream)]/70 leading-relaxed">
									Scandinavian design — defined by simple shapes and natural materials.
								</p>
							</div>
						</div>
					</div>

					{/* RIGHT: product detail card */}
					<aside className="lg:sticky lg:top-28">
						<div className="flex items-center gap-6 text-[0.7rem] tracking-[0.18em] uppercase text-foreground/50 border-b hairline pb-4 mb-6">
							<span className="text-foreground/80">
								<span className="font-display text-base normal-case tracking-normal mr-1.5">01</span>
								Material
							</span>
							<span>
								<span className="font-display text-base normal-case tracking-normal mr-1.5">02</span>
								Configuration
							</span>
							<span>
								<span className="font-display text-base normal-case tracking-normal mr-1.5">03</span>
								Delivery
							</span>
						</div>

						<p className="eyebrow text-[var(--clay)] mb-3">New arrival</p>
						<h1 className="font-display text-5xl lg:text-6xl leading-[0.95] tracking-tight text-foreground">
							Applaryd
						</h1>
						<p className="mt-3 text-sm uppercase tracking-[0.2em] text-foreground/55">
							Upholstery — Modular Series
						</p>

						{/* Cloth swatches */}
						<div className="mt-9">
							<div className="flex items-baseline justify-between mb-3">
								<span className="text-sm tracking-wide text-foreground">Cloth</span>
								<span className="text-xs uppercase tracking-[0.16em] text-foreground/50">8 finishes</span>
							</div>
							<div className="grid grid-cols-4 gap-2.5">
								{fabricSwatches.map((s) => (
									<button
										type="button"
										key={s.name}
										aria-label={s.name}
										className="group relative aspect-square rounded-sm border hairline transition-all hover:border-foreground/40"
										style={{ background: s.color }}
									>
										<span className="absolute inset-x-0 -bottom-5 text-[10px] uppercase tracking-[0.14em] text-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity text-center">
											{s.name}
										</span>
									</button>
								))}
							</div>
						</div>

						{/* Leather swatches */}
						<div className="mt-7">
							<div className="flex items-baseline justify-between mb-3">
								<span className="text-sm tracking-wide text-foreground">Leather</span>
								<span className="text-xs uppercase tracking-[0.16em] text-foreground/50">6 finishes</span>
							</div>
							<div className="grid grid-cols-6 gap-2.5">
								{leatherSwatches.map((s) => (
									<button
										type="button"
										key={s.name}
										aria-label={s.name}
										className="aspect-square rounded-sm border hairline transition-all hover:border-foreground/40"
										style={{ background: s.color }}
									/>
								))}
							</div>
						</div>

						{/* Size selector */}
						<div className="mt-9 grid grid-cols-3 gap-2">
							{["2 seat", "3 seat", "Sectional"].map((label, i) => (
								<button
									type="button"
									key={label}
									className={`h-11 text-[0.78rem] tracking-[0.14em] uppercase rounded-sm border transition-colors ${
										i === 1
											? "bg-foreground text-background border-foreground"
											: "hairline text-foreground/70 hover:border-foreground/50 hover:text-foreground"
									}`}
								>
									{label}
								</button>
							))}
						</div>

						{/* Price + CTA */}
						<div className="mt-9 flex items-end justify-between gap-5 border-t hairline pt-6">
							<div>
								<p className="text-xs uppercase tracking-[0.2em] text-foreground/50">Starting at</p>
								<p className="font-display text-3xl text-foreground leading-none mt-2">€2,300.00</p>
							</div>
							<div className="flex items-center gap-2">
								<YnsLink
									prefetch={"eager"}
									href="/products"
									className="h-11 px-5 inline-flex items-center text-[0.78rem] tracking-[0.14em] uppercase text-foreground/70 hover:text-foreground transition-colors"
								>
									Configure
								</YnsLink>
								<YnsLink
									prefetch={"eager"}
									href="/products"
									className="h-11 px-6 inline-flex items-center gap-2 bg-[var(--forest)] text-[var(--cream)] rounded-sm text-[0.78rem] tracking-[0.16em] uppercase hover:bg-[var(--forest-deep)] transition-colors"
								>
									Shop now
									<ArrowRightIcon className="h-3.5 w-3.5" />
								</YnsLink>
							</div>
						</div>
					</aside>
				</div>
			</div>
		</section>
	);
}
