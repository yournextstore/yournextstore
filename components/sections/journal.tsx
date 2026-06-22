import Image from "next/image";
import { YnsLink } from "../yns-link";

export function Journal() {
	return (
		<section className="bg-cream">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				<div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
					<div className="lg:col-span-7 relative aspect-[5/4] rounded-sm overflow-hidden">
						<Image
							src="/scraped-1.jpg"
							alt="An editorial moment from The Silk Journal"
							fill
							sizes="(max-width: 1024px) 100vw, 60vw"
							className="object-cover"
						/>
						<div className="absolute inset-0 bg-gradient-to-tr from-espresso/30 via-transparent to-transparent" />
						<span className="absolute top-5 left-5 text-[10px] tracking-[0.3em] uppercase text-cream bg-espresso/60 backdrop-blur-sm px-3 py-1.5">
							Issue No. 04
						</span>
					</div>

					<div className="lg:col-span-5">
						<p className="text-[11px] tracking-[0.3em] uppercase text-terracotta font-medium mb-5">
							The Silk Journal
						</p>
						<h2 className="font-serif text-4xl sm:text-5xl text-espresso leading-[1.05]">
							A ritual for <span className="italic">slow</span> mornings
						</h2>
						<p className="mt-6 text-base sm:text-lg text-walnut/80 leading-relaxed">
							Notes from our atelier on the craft of mulberry silk, the science behind moisture retention, and
							the quiet hours that shape better hair days.
						</p>
						<div className="mt-8 flex flex-col gap-4">
							<JournalLink title="Why mulberry silk outperforms satin" meta="5 min read · Hair science" />
							<JournalLink title="The case for a 7-night sleep routine" meta="3 min read · Rituals" />
							<JournalLink title="Inside the loom: from cocoon to bonnet" meta="8 min read · Craft" />
						</div>
						<YnsLink
							href="/products"
							prefetch={"eager"}
							className="mt-10 inline-flex items-center h-11 px-7 border border-espresso text-espresso text-[11px] tracking-[0.22em] uppercase font-medium hover:bg-espresso hover:text-cream transition-colors"
						>
							Read the Journal
						</YnsLink>
					</div>
				</div>
			</div>
		</section>
	);
}

function JournalLink({ title, meta }: { title: string; meta: string }) {
	return (
		<a
			href="#"
			className="group flex flex-col gap-1 border-b border-walnut/15 pb-4 last:border-b-0 hover:border-terracotta/60 transition-colors"
		>
			<span className="font-serif text-xl text-espresso group-hover:text-terracotta transition-colors">
				{title}
			</span>
			<span className="text-[11px] tracking-[0.18em] uppercase text-walnut/60">{meta}</span>
		</a>
	);
}
