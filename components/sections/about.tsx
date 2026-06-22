import Image from "next/image";
import { YnsLink } from "@/components/yns-link";

function Starburst({ children, className }: { children: React.ReactNode; className?: string }) {
	return (
		<div className={`relative ${className ?? ""}`}>
			<div className="starburst absolute inset-0 bg-[var(--pink)]" aria-hidden="true" />
			<div className="starburst absolute inset-0 bg-[var(--pink)] scale-[0.92]" aria-hidden="true" />
			<div className="relative z-10 flex h-full w-full items-center justify-center px-6 text-center">
				{children}
			</div>
		</div>
	);
}

export function PromoCard() {
	return (
		<section className="bg-purple-wave -mt-px pb-20 sm:pb-28">
			<div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
				<div className="relative overflow-hidden rounded-[2.5rem] bg-promo-card shadow-jelly">
					{/* Decorative doodle stars */}
					<svg
						className="absolute left-6 top-6 h-8 w-8 text-[var(--lime)] wiggle"
						viewBox="0 0 24 24"
						fill="currentColor"
						aria-hidden="true"
					>
						<path d="M12 2 L14 9 L21 9 L15 13 L17 20 L12 16 L7 20 L9 13 L3 9 L10 9 Z" />
					</svg>
					<svg
						className="absolute right-12 bottom-10 h-10 w-10 text-[var(--sun)] wiggle"
						viewBox="0 0 24 24"
						fill="currentColor"
						aria-hidden="true"
					>
						<path d="M12 2 L14 9 L21 9 L15 13 L17 20 L12 16 L7 20 L9 13 L3 9 L10 9 Z" />
					</svg>

					<div className="grid items-center gap-8 px-6 py-12 sm:grid-cols-2 sm:px-12 sm:py-16">
						<div className="text-white">
							<p className="font-display text-xs uppercase tracking-[0.3em] text-[var(--lime)]">
								New flavor drop
							</p>
							<h2 className="mt-4 font-display text-3xl sm:text-4xl lg:text-5xl uppercase leading-[1] text-shadow-jelly">
								Big jiggle.
								<br />
								Tiny calories.
							</h2>
							<p className="mt-5 max-w-md text-base sm:text-lg text-white/90 leading-relaxed">
								Each cup is a real-fruit party of color and wobble. Plant-based, gluten-free, and made with
								juice your grandma would approve of.
							</p>
							<div className="mt-8 flex flex-wrap items-center gap-3">
								<YnsLink
									href="/products"
									prefetch="eager"
									className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold uppercase tracking-wider text-[var(--purple-deep)] transition-transform hover:scale-[1.03]"
								>
									Shop all flavors <span aria-hidden>▸</span>
								</YnsLink>
								<YnsLink
									href="#about-story"
									prefetch="eager"
									className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-6 py-3 text-sm font-semibold uppercase tracking-wider text-white hover:bg-white/20"
								>
									Our story
								</YnsLink>
							</div>
						</div>

						<div className="relative h-64 sm:h-80 lg:h-[420px]">
							<Image
								src="/scraped-3.jpg"
								alt="A swirled fruit jelly cup with silver foil lid"
								fill
								sizes="(max-width: 640px) 100vw, 50vw"
								className="object-contain drop-shadow-2xl float-soft"
							/>
							<Starburst className="absolute -right-2 top-6 h-28 w-28 sm:h-36 sm:w-36 rotate-12">
								<div className="font-display text-[11px] sm:text-xs uppercase leading-tight tracking-wider text-white">
									Under
									<br />
									<span className="text-base sm:text-lg">60 Calories</span>
								</div>
							</Starburst>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

export function About() {
	return (
		<section id="about-story" className="relative bg-[var(--background)]">
			<div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				<div className="grid gap-10 sm:grid-cols-3">
					<div className="sm:col-span-1">
						<p className="font-display text-xs uppercase tracking-[0.3em] text-[var(--pink)]">The Story</p>
						<h2 className="mt-4 font-display text-3xl sm:text-4xl uppercase leading-[1.05] text-[var(--purple-deep)]">
							Snacks shouldn&apos;t be serious.
						</h2>
					</div>
					<div className="sm:col-span-2 space-y-5 text-lg leading-relaxed text-[var(--purple-deep)]/80">
						<p>
							We started Your Next Store because the snack aisle was beige, boring, and full of stuff nobody
							could pronounce. So we made the opposite — gloriously colorful, real-fruit jiggly cups that
							taste like joy and skip the artificial nonsense.
						</p>
						<p>
							Every recipe is plant-based, packed with juice and puree, and built to wobble. We sweat the
							ingredients so you can goof off with the flavor.
						</p>
						<div className="flex flex-wrap gap-2 pt-4">
							{["Plant-based", "Real fruit", "Gluten-free", "No artificial colors", "Under 60 cal"].map(
								(tag) => (
									<span
										key={tag}
										className="rounded-full bg-[var(--lilac)]/20 px-4 py-1.5 text-sm font-semibold text-[var(--purple-deep)]"
									>
										{tag}
									</span>
								),
							)}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
