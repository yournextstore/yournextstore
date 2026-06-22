import Image from "next/image";
import { YnsLink } from "../yns-link";

export function About() {
	return (
		<section id="about" className="bg-paper-warm border-y border-foreground/10">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
					<div className="relative aspect-[5/6] overflow-hidden ring-1 ring-foreground/10 order-2 lg:order-1">
						<Image
							src="/scraped-2.jpg"
							alt="Behind the bake — soft morning light on cookies and oats"
							fill
							sizes="(max-width: 1024px) 100vw, 50vw"
							className="object-cover"
						/>
						<div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs uppercase tracking-[0.2em] text-white/90 bg-foreground/40 backdrop-blur px-4 py-3">
							<span>Vol. 01</span>
							<span>Behind the Bake</span>
							<span>2026</span>
						</div>
					</div>
					<div className="order-1 lg:order-2">
						<span className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.25em] text-[var(--crimson)] mb-5">
							<span aria-hidden="true" className="h-px w-6 bg-[var(--crimson)]" />
							Our Story
						</span>
						<h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-foreground leading-[1.05]">
							Snacks that read like a recipe — not a chemistry set.
						</h2>
						<div className="mt-6 space-y-5 text-base sm:text-lg text-muted-foreground leading-relaxed">
							<p>
								We started Your Next Store after one too many &ldquo;protein&rdquo; bars that tasted like
								cardboard wrapped in disappointment. So we did the obvious thing: opened a tiny bakery,
								measured everything in oats and brown butter, and refused to ship anything we wouldn&apos;t
								eat by the handful.
							</p>
							<p>
								Every batch is mixed slowly, baked low and long, and packaged the same morning it cools. Seven
								simple ingredients. Twenty grams of protein. Zero fine print.
							</p>
						</div>
						<div className="mt-10 grid grid-cols-3 gap-6 max-w-md">
							<div>
								<div className="text-2xl font-semibold text-foreground">7</div>
								<div className="text-xs text-muted-foreground mt-1">Real ingredients</div>
							</div>
							<div>
								<div className="text-2xl font-semibold text-foreground">20g</div>
								<div className="text-xs text-muted-foreground mt-1">Protein per bag</div>
							</div>
							<div>
								<div className="text-2xl font-semibold text-foreground">0</div>
								<div className="text-xs text-muted-foreground mt-1">Mystery additives</div>
							</div>
						</div>
						<YnsLink
							prefetch={"eager"}
							href="/products"
							className="inline-flex items-center mt-10 h-11 px-7 bg-foreground text-background text-sm font-medium tracking-wide hover:bg-foreground/90 transition-colors"
						>
							Taste the difference
						</YnsLink>
					</div>
				</div>
			</div>
		</section>
	);
}
