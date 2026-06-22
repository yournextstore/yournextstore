import { ArrowUpRight, Check } from "lucide-react";
import Image from "next/image";
import { YnsLink } from "../yns-link";

const newArrivals = [
	{
		src: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80",
		alt: "Amber serum bottle",
	},
	{
		src: "https://images.unsplash.com/photo-1607602132700-068258431c6c?auto=format&fit=crop&w=600&q=80",
		alt: "Cream jar on linen",
	},
	{
		src: "https://images.unsplash.com/photo-1583241475880-083f84372725?auto=format&fit=crop&w=600&q=80",
		alt: "Polished lipsticks in soft light",
	},
];

const purchasePerks = [
	"A complimentary spa-grade ritual kit",
	"Free engraving on signature glassware",
	"Members-only access to seasonal drops",
];

export function Hero() {
	return (
		<section className="bg-background border-b border-foreground">
			<div className="max-w-[1280px] mx-auto px-5 md:px-10 lg:px-16 py-10 md:py-14">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-6">
					{/* Block 1 — New arrivals (cream, top-left) */}
					<article className="lg:col-span-6 neo-border bg-[var(--color-surface-container-low)] p-7 md:p-9 flex flex-col">
						<div className="flex items-start justify-between gap-6 mb-7">
							<div>
								<span className="label-caps text-[var(--color-on-surface-variant)]">{`/ 01 — Spring 2026`}</span>
								<h2 className="font-serif text-4xl md:text-5xl leading-[1] mt-3 text-foreground">
									New
									<br />
									<span className="script-accent">arrivals</span>
								</h2>
							</div>
							<YnsLink
								prefetch={"eager"}
								href="/products"
								aria-label="Browse new arrivals"
								className="shrink-0 w-12 h-12 neo-border bg-[var(--color-surface-container-lowest)] grid place-items-center hover:bg-[var(--color-primary-container)] transition-colors"
							>
								<ArrowUpRight className="w-5 h-5" strokeWidth={1.5} />
							</YnsLink>
						</div>
						<div className="grid grid-cols-3 gap-3 mt-auto">
							{newArrivals.map((img) => (
								<div
									key={img.src}
									className="relative aspect-[3/4] neo-border bg-[var(--color-surface-container-lowest)] overflow-hidden"
								>
									<Image
										src={img.src}
										alt={img.alt}
										fill
										sizes="(max-width: 1024px) 33vw, 200px"
										className="object-cover"
										unoptimized
									/>
								</div>
							))}
						</div>
						<p className="font-sans text-sm leading-relaxed text-[var(--color-on-surface-variant)] mt-6 max-w-sm">
							Hand-blended formulas and small-batch tools — quietly arriving on the shelf this season.
						</p>
					</article>

					{/* Block 2 — Manifesto (dark olive, top-right) */}
					<article className="lg:col-span-6 neo-border bg-[var(--color-tertiary)] text-[var(--color-on-tertiary)] p-7 md:p-10 relative overflow-hidden flex flex-col min-h-[420px]">
						<div className="flex items-center justify-between gap-4">
							<span className="label-caps text-[var(--color-on-tertiary)]/70">Editor&apos;s note</span>
							<span className="label-caps text-[var(--color-on-tertiary)]/70">No. 04</span>
						</div>
						<h2 className="font-serif text-5xl md:text-6xl lg:text-[68px] leading-[0.95] mt-6 max-w-md">
							You are
							<br />
							<span className="script-accent">more</span> than
							<br />
							your body.
						</h2>
						<div className="mt-auto flex items-end justify-between gap-6 pt-10">
							<p className="font-sans text-sm leading-relaxed text-[var(--color-on-tertiary)]/80 max-w-[18rem]">
								A philosophy, not a product line. Slow rituals, considered ingredients, and care that begins
								before the mirror.
							</p>
							<YnsLink
								prefetch={"eager"}
								href="/collection/signature"
								className="label-caps inline-flex items-center gap-2 shrink-0 px-5 py-3 neo-border bg-[var(--color-on-tertiary)] text-[var(--color-tertiary)] hover:bg-[var(--color-primary-container)] hover:text-[var(--color-on-primary-container)] transition-colors"
							>
								Read the issue
								<ArrowUpRight className="w-4 h-4" strokeWidth={2} />
							</YnsLink>
						</div>
						{/* Decorative product imagery */}
						<div className="hidden md:block absolute right-6 top-1/2 -translate-y-1/2 w-40 h-56 neo-border bg-[var(--color-surface-container-lowest)] rotate-[6deg] overflow-hidden pointer-events-none">
							<Image
								src="https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=600&q=80"
								alt=""
								fill
								sizes="200px"
								className="object-cover"
								unoptimized
							/>
						</div>
					</article>

					{/* Block 3 — Purchase & win (peach, middle-left) */}
					<article className="lg:col-span-7 neo-border bg-[var(--color-secondary-container)] text-[var(--color-on-secondary-container)] p-7 md:p-9 grid grid-cols-1 sm:grid-cols-5 gap-6 items-stretch">
						<div className="sm:col-span-3 flex flex-col">
							<span className="label-caps">Limited gift, May only</span>
							<h2 className="font-serif text-4xl md:text-5xl leading-[1] mt-4">
								Purchase
								<br />
								now <span className="script-accent">&amp; win.</span>
							</h2>
							<ul className="mt-6 space-y-3">
								{purchasePerks.map((perk) => (
									<li key={perk} className="flex items-start gap-3 text-sm leading-relaxed">
										<span className="mt-0.5 w-5 h-5 neo-border bg-[var(--color-surface-container-lowest)] grid place-items-center shrink-0">
											<Check className="w-3 h-3" strokeWidth={2.5} />
										</span>
										<span>{perk}</span>
									</li>
								))}
							</ul>
							<YnsLink
								prefetch={"eager"}
								href="/products"
								className="label-caps mt-7 self-start inline-flex items-center gap-2 px-5 py-3 neo-border bg-foreground text-background hover:bg-[var(--color-tertiary)] hover:text-[var(--color-on-tertiary)] transition-colors"
							>
								Enter the giveaway
								<ArrowUpRight className="w-4 h-4" strokeWidth={2} />
							</YnsLink>
						</div>
						<div className="sm:col-span-2 relative neo-border bg-[var(--color-surface-container-lowest)] overflow-hidden min-h-[260px]">
							<Image
								src="https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=800&q=80"
								alt="Botanical oils and serums"
								fill
								sizes="(max-width: 1024px) 100vw, 320px"
								className="object-cover"
								unoptimized
							/>
							<div className="absolute top-3 left-3 neo-border bg-[var(--color-primary-container)] text-[var(--color-on-primary-container)] px-3 py-1.5 label-caps">
								Worth $240
							</div>
						</div>
					</article>

					{/* Block 4 — Lifestyle photo (middle-right) */}
					<article className="lg:col-span-5 neo-border relative overflow-hidden min-h-[360px] bg-[var(--color-tertiary-container)]">
						<Image
							src="https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=900&q=80"
							alt="A spread of gift-ready skincare and botanicals"
							fill
							sizes="(max-width: 1024px) 100vw, 480px"
							className="object-cover"
							priority
							unoptimized
						/>
						<div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3">
							<div className="neo-border bg-[var(--color-surface-container-lowest)] px-4 py-3 max-w-[14rem]">
								<p className="label-caps text-[var(--color-on-surface-variant)]">Gifting, made gentle</p>
								<p className="font-serif text-xl leading-tight mt-1">Hand-tied, hand-delivered.</p>
							</div>
							<YnsLink
								prefetch={"eager"}
								href="/collection/gifts"
								aria-label="Shop gift sets"
								className="shrink-0 w-12 h-12 neo-border bg-[var(--color-primary-container)] grid place-items-center hover:bg-foreground hover:text-background transition-colors"
							>
								<ArrowUpRight className="w-5 h-5" strokeWidth={1.5} />
							</YnsLink>
						</div>
					</article>
				</div>
			</div>
		</section>
	);
}
