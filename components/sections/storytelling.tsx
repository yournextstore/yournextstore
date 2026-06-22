import Image from "next/image";
import { YnsLink } from "../yns-link";

export function Storytelling() {
	return (
		<section className="bg-background">
			<div className="mx-auto max-w-[1600px] px-6 py-20 lg:px-10">
				<div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
					{/* Image — large lifestyle */}
					<div className="relative lg:col-span-8">
						<div className="relative aspect-[16/10] overflow-hidden bg-cream">
							<Image
								src="/scraped-4.jpg"
								alt="Behind the campaign — the atelier"
								fill
								sizes="(max-width: 1024px) 100vw, 66vw"
								className="object-cover"
							/>
						</div>
						<p className="mt-3 eyebrow text-mushroom">Inside the Atelier — Volume 03</p>
					</div>

					{/* Editorial caption */}
					<aside className="flex flex-col justify-between lg:col-span-4 lg:py-6">
						<div>
							<p className="eyebrow text-mushroom">A Closer Look</p>
							<h2 className="mt-4 font-display text-3xl text-foreground sm:text-4xl lg:text-[40px] lg:leading-[1.1] lg:tracking-[-0.02em]">
								Tailored softly. Worn endlessly.
							</h2>
							<p className="mt-6 text-base leading-relaxed text-mushroom">
								Double-faced wool, fluid drape, and considered cuts — the new season explores quiet confidence
								through fabric. Each piece is patterned in our studio and finished by hand.
							</p>
						</div>
						<div className="mt-8 flex items-center gap-6">
							<YnsLink
								prefetch={"eager"}
								href="/products"
								className="text-sm font-medium text-foreground underline underline-offset-[6px] decoration-[1px] hover:decoration-2 transition-all"
							>
								Read the Story
							</YnsLink>
							<YnsLink
								prefetch={"eager"}
								href="/products"
								className="text-sm font-medium text-foreground underline underline-offset-[6px] decoration-[1px] hover:decoration-2 transition-all"
							>
								Shop the Look
							</YnsLink>
						</div>
					</aside>
				</div>
			</div>
		</section>
	);
}
