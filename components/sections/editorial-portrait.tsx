import Image from "next/image";
import { YnsLink } from "../yns-link";

export function EditorialPortrait() {
	return (
		<section className="relative overflow-hidden bg-sand">
			<div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] items-stretch">
				<div className="flex items-center px-6 sm:px-12 lg:px-20 py-16 lg:py-28">
					<div className="max-w-md">
						<div className="font-serif text-xs tracking-[0.4em] uppercase text-clay">
							A Ritual, Not a Routine
						</div>
						<h2 className="mt-5 font-serif text-4xl sm:text-5xl lg:text-6xl leading-[1.05] text-foreground">
							Skin that feels <span className="italic font-light">cared for</span> — every single morning.
						</h2>
						<p className="mt-6 text-base text-muted-foreground leading-relaxed">
							We formulate in small batches with cold-pressed botanicals, beeswax, and naturally derived
							humectants. No fillers. No noise. Just the things your skin recognises.
						</p>

						<dl className="mt-10 grid grid-cols-3 gap-4">
							{[
								{ label: "Plant-based", value: "94%" },
								{ label: "Cruelty-free", value: "100%" },
								{ label: "Made by", value: "Hand" },
							].map((stat) => (
								<div key={stat.label} className="border-t border-foreground/15 pt-3">
									<dt className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
										{stat.label}
									</dt>
									<dd className="font-serif text-2xl text-foreground mt-1">{stat.value}</dd>
								</div>
							))}
						</dl>

						<div className="mt-10">
							<YnsLink
								prefetch={"eager"}
								href="/products"
								className="inline-flex items-center gap-2 h-11 px-6 bg-foreground text-background rounded-full text-sm font-medium tracking-wide hover:bg-foreground/90 transition-colors"
							>
								Discover the range
							</YnsLink>
						</div>
					</div>
				</div>
				<div className="relative min-h-[420px] lg:min-h-[640px]">
					<Image
						src="/scraped-4.jpg"
						alt="Smiling model with glowing skin"
						fill
						sizes="(max-width: 1024px) 100vw, 55vw"
						className="object-cover"
					/>
					<div className="absolute inset-0 bg-gradient-to-r from-sand/40 via-transparent to-transparent" />
					<div className="absolute bottom-6 right-6 sm:bottom-10 sm:right-10 bg-background/95 backdrop-blur px-6 py-5 rounded-sm max-w-[260px] shadow-xl">
						<div className="font-serif italic text-sm text-muted-foreground">
							&ldquo;The lightest, most luxurious thing I&apos;ve ever put on my face.&rdquo;
						</div>
						<div className="mt-3 text-[11px] tracking-[0.2em] uppercase text-clay">— Vogue Beauty</div>
					</div>
				</div>
			</div>
		</section>
	);
}
