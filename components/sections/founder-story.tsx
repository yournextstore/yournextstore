import Image from "next/image";
import { YnsLink } from "../yns-link";

export function FounderStory() {
	return (
		<section className="relative bg-spotlight py-20 sm:py-28">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
					<div className="lg:col-span-5 relative">
						<div className="relative aspect-[4/5] max-w-md rounded-2xl overflow-hidden ring-1 ring-bone/8">
							<Image
								src="/scraped-2.jpg"
								alt="Founder portrait"
								fill
								sizes="(max-width: 1024px) 100vw, 40vw"
								className="object-cover grayscale contrast-110"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
							<div
								aria-hidden
								className="absolute inset-0 mix-blend-overlay opacity-40"
								style={{
									backgroundImage:
										"url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.7'/></svg>\")",
								}}
							/>
						</div>
					</div>

					<div className="lg:col-span-7">
						<p className="text-xs uppercase tracking-[0.22em] text-ember/90 font-medium">The story</p>
						<h2 className="mt-3 font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-bone text-balance">
							We built a small object to make the loud one shut up.
						</h2>
						<div className="mt-6 space-y-5 text-[15px] leading-relaxed text-muted-foreground max-w-xl">
							<p>
								Your Next Store began with a simple, embarrassing fact: we were spending more time in our
								phones than with the people in the room. We tried every app. None of them worked, because the
								phone was always the one in charge.
							</p>
							<p>
								So we made a piece of hardware. Heavier than software. Slower than a notification. A small tag
								you tap once, and the room comes back.
							</p>
						</div>
						<YnsLink
							href="/products"
							prefetch={"eager"}
							className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-bone hover:text-ember transition-colors"
						>
							Read the full story
							<span aria-hidden>→</span>
						</YnsLink>
					</div>
				</div>
			</div>
		</section>
	);
}
