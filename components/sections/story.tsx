import Image from "next/image";
import { YnsLink } from "../yns-link";

export function Story() {
	return (
		<section id="story" className="bg-background">
			<div className="max-w-7xl mx-auto px-6 lg:px-10 py-20 sm:py-28">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
					<div className="relative aspect-[4/5] overflow-hidden rounded-sm">
						<Image
							src="/scraped-1.jpg"
							alt="Brewing ritual"
							fill
							sizes="(max-width: 1024px) 100vw, 50vw"
							className="object-cover"
						/>
					</div>
					<div className="lg:pr-6">
						<p className="text-[11px] tracking-[0.4em] uppercase text-[color:var(--color-yns-blue-400)]">
							The ritual
						</p>
						<h2 className="mt-5 font-serif font-light text-4xl sm:text-5xl text-[color:var(--color-yns-navy)] leading-[1.05]">
							Slowness, steeped
							<br />
							into every cup.
						</h2>
						<p className="mt-6 text-base text-[color:var(--color-yns-navy)]/70 leading-relaxed max-w-md">
							We source single-garden leaves from third-generation growers along the Cornish coast and the
							hills of Sri Lanka. Whole leaves, slow oxidation, and a brewing kit designed in our Margate
							studio — because tea is the most honest thing in your kitchen.
						</p>
						<YnsLink
							prefetch={"eager"}
							href="/products"
							className="mt-9 inline-flex items-center gap-2 text-[12px] tracking-[0.32em] uppercase text-[color:var(--color-yns-navy)] border-b border-[color:var(--color-yns-navy)] pb-1 hover:gap-3 transition-all"
						>
							Read our story
							<span aria-hidden="true">→</span>
						</YnsLink>
					</div>
				</div>
			</div>
		</section>
	);
}
