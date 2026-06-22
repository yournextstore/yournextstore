import Image from "next/image";
import { YnsLink } from "../yns-link";

function Star() {
	return (
		<svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 sm:h-5 sm:w-5 fill-foreground">
			<path d="M12 2.5l2.97 6.02 6.64.97-4.8 4.68 1.13 6.6L12 17.77l-5.94 3 1.13-6.6-4.8-4.68 6.64-.97L12 2.5z" />
		</svg>
	);
}

export function Hero() {
	return (
		<section className="relative bg-putty-grad">
			<div className="grid lg:grid-cols-12 items-stretch min-h-[68vh] lg:min-h-[78vh]">
				<div className="lg:col-span-7 relative overflow-hidden">
					<div className="relative aspect-[5/4] sm:aspect-[16/10] lg:aspect-auto lg:h-full w-full">
						<Image
							src="/scraped-0.jpg"
							alt="Hand holding a Your Next Store satin lipstick in warm nude"
							fill
							priority
							sizes="(max-width: 1024px) 100vw, 60vw"
							className="object-cover object-center"
						/>
						<div
							aria-hidden="true"
							className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[color:var(--color-putty)]/70 hidden lg:block"
						/>
					</div>
				</div>

				<div className="lg:col-span-5 flex items-center justify-start px-6 sm:px-10 lg:px-16 py-12 lg:py-0">
					<div className="max-w-md">
						<div className="flex items-center gap-1.5 mb-7">
							<Star />
							<Star />
							<Star />
							<Star />
							<Star />
						</div>
						<blockquote className="font-display text-4xl sm:text-5xl lg:text-[3.4rem] leading-[1.05] tracking-tight text-foreground">
							&ldquo;Hydrating and buildable color&rdquo;
						</blockquote>
						<p className="mt-7 text-eyebrow text-foreground/70">— Catherine</p>
						<div className="mt-10 flex flex-wrap gap-4">
							<YnsLink
								prefetch={"eager"}
								href="/products"
								className="inline-flex items-center justify-center h-11 px-7 bg-foreground text-background text-[0.78rem] tracking-[0.22em] uppercase font-semibold hover:bg-[color:var(--color-slate-ink)] transition-colors"
							>
								Shop the Edit
							</YnsLink>
							<YnsLink
								prefetch={"eager"}
								href="/#about"
								className="inline-flex items-center justify-center h-11 px-2 text-[0.78rem] tracking-[0.22em] uppercase font-semibold text-foreground/80 hover:text-[color:var(--color-terracotta-deep)] transition-colors border-b border-foreground/30"
							>
								Our Ritual
							</YnsLink>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
