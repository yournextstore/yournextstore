import Image from "next/image";

export function Founder() {
	return (
		<section id="story" className="bg-background">
			<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				<div className="grid items-center gap-12 lg:grid-cols-5">
					<div className="relative aspect-[4/5] overflow-hidden rounded-sm lg:col-span-2">
						<Image
							src="/scraped-3.jpg"
							alt="A warmly-lit nightstand with apothecary bottle and tea"
							fill
							sizes="(max-width: 1024px) 100vw, 40vw"
							className="object-cover"
						/>
					</div>
					<div className="lg:col-span-3 max-w-xl">
						<p className="text-[10px] tracking-[0.32em] uppercase text-primary mb-5">— Our story —</p>
						<h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl leading-[1.1] text-foreground">
							&ldquo;I needed something gentler than a sleeping pill, and stronger than a cup of tea.&rdquo;
						</h2>
						<p className="mt-6 text-base leading-relaxed text-muted-foreground">
							Your Next Store began at a kitchen counter in 2021, when our founder — exhausted from years of
							broken sleep — couldn&apos;t find a nighttime ritual that felt honest. The supplements were
							either harsh, full of melatonin, or thinly dosed. So she began formulating her own, with the
							help of clinical researchers and a small studio of herbalists.
						</p>
						<p className="mt-4 text-base leading-relaxed text-muted-foreground">
							Today, every bottle still leaves our apothecary the same way it did then: hand-batched, tested,
							and shipped with a handwritten card.
						</p>
						<p className="mt-8 font-serif italic text-lg text-foreground/85">— Maren, founder</p>
					</div>
				</div>
			</div>
		</section>
	);
}
