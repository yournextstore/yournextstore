import Image from "next/image";
import { YnsLink } from "../yns-link";

export function Editorial() {
	return (
		<section id="story" className="bg-background">
			<div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 py-24 sm:py-32">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
					{/* Lifestyle still life */}
					<div className="lg:col-span-7 order-2 lg:order-1">
						<div className="relative aspect-[5/4] overflow-hidden bg-sand">
							<Image
								src="/scraped-4.jpg"
								alt="A still life of the daily ritual"
								fill
								sizes="(max-width: 1024px) 100vw, 60vw"
								className="object-cover object-center"
							/>
							<div className="absolute inset-0 ring-1 ring-inset ring-cocoa/5" />
						</div>
					</div>

					{/* Narrative */}
					<div className="lg:col-span-5 order-1 lg:order-2">
						<p className="text-[11px] tracking-arame uppercase text-foreground/55">— The Brand</p>
						<h2 className="mt-5 font-serif text-4xl sm:text-5xl text-foreground leading-[1.05]">
							A quiet rebellion in
							<br />
							<em className="font-serif italic">an ordinary cabinet.</em>
						</h2>
						<div className="mt-7 space-y-5 text-[15px] leading-[1.75] text-muted-foreground">
							<p>
								Your Next Store was born from a simple observation: the most-used objects in our homes are
								often the loudest, the most plastic, the least considered.
							</p>
							<p>
								We craft daily essentials the way a perfumer composes a fragrance — with restraint,
								provenance, and an obsession with what touches the skin. Nothing is rushed, nothing is loud.
							</p>
						</div>
						<YnsLink
							prefetch={"eager"}
							href="/products"
							className="mt-9 inline-block font-serif text-base italic text-foreground border-b border-foreground/40 pb-1 hover:border-foreground transition-colors"
						>
							Read our manifesto
						</YnsLink>
					</div>
				</div>
			</div>
		</section>
	);
}
