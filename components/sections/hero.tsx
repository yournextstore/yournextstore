import { ArrowUpRightIcon, SparklesIcon, StarIcon } from "lucide-react";
import Image from "next/image";
import { previewHref } from "@/lib/demo-products";
import { YnsLink } from "../yns-link";

export function Hero({ preview = false }: { preview?: boolean }) {
	return (
		<section className="relative overflow-hidden bg-lumen-noise pb-20 pt-12 sm:pt-16 lg:pb-28">
			<div
				aria-hidden="true"
				className="absolute inset-0 opacity-40 mix-blend-overlay [background-image:radial-gradient(circle_at_top_left,rgba(255,255,255,0.6),transparent_55%)]"
			/>
			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
					{/* Left: Headline + CTA */}
					<div className="lg:col-span-6 order-2 lg:order-1">
						<span className="inline-flex items-center gap-2 rounded-full bg-background/70 px-3 py-1 text-xs font-medium text-[var(--violet-deep)] backdrop-blur-sm ring-1 ring-[var(--violet)]/20">
							<SparklesIcon className="h-3.5 w-3.5" />
							For creators & makers
						</span>
						<h1 className="mt-6 font-serif text-5xl sm:text-6xl lg:text-7xl leading-[0.95] tracking-tight text-foreground text-balance">
							Craft joy, <em className="text-[var(--violet-deep)] not-italic font-serif italic">magnify</em>{" "}
							thrill and earn more.
						</h1>
						<p className="mt-6 max-w-md text-lg text-foreground/70 leading-relaxed">
							A storefront made for independent creators selling digital goods, courses, and one-of-a-kind
							drops. Launch in minutes, keep your audience close.
						</p>
						<div className="mt-9 flex flex-col sm:flex-row items-start sm:items-center gap-4">
							<YnsLink
								prefetch={"eager"}
								href={previewHref("/products", preview)}
								className="group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3.5 text-sm font-medium text-background shadow-lg shadow-[var(--violet-deep)]/15 hover:bg-[var(--violet-deep)] transition-colors"
							>
								Start selling today
								<span className="grid place-items-center h-6 w-6 rounded-full bg-background text-foreground transition-transform group-hover:rotate-45">
									<ArrowUpRightIcon className="h-3.5 w-3.5" />
								</span>
							</YnsLink>
							<YnsLink
								prefetch={"eager"}
								href={previewHref("#about", preview)}
								className="inline-flex items-center gap-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors underline underline-offset-4 decoration-[var(--violet)]/40"
							>
								See how it works
							</YnsLink>
						</div>
					</div>

					{/* Right: Portrait image with floating metric card */}
					<div className="lg:col-span-6 order-1 lg:order-2 relative">
						<div className="relative aspect-[5/6] sm:aspect-[4/5] lg:aspect-[5/6] w-full overflow-hidden rounded-[2rem] bg-[var(--lilac)] shadow-xl shadow-[var(--violet-deep)]/15">
							<Image
								src="/scraped-0.jpg"
								alt="A creator on the Your Next Store platform"
								fill
								priority
								sizes="(max-width: 1024px) 100vw, 50vw"
								className="object-cover"
							/>
							<div
								aria-hidden="true"
								className="absolute inset-0 bg-gradient-to-tr from-[var(--violet-deep)]/20 via-transparent to-[var(--butter)]/10 mix-blend-soft-light"
							/>
							{/* Top-left pill badge */}
							<div className="absolute top-5 left-5 inline-flex items-center gap-1.5 rounded-full bg-background/85 px-3 py-1 text-[11px] font-medium text-foreground backdrop-blur-md ring-1 ring-background/40">
								<span className="h-1.5 w-1.5 rounded-full bg-[var(--violet-deep)]" />
								Live now
							</div>
							{/* Floating testimonial / metric card */}
							<div className="absolute bottom-5 right-5 max-w-[78%] sm:max-w-xs rounded-2xl bg-background/95 backdrop-blur-md p-4 shadow-2xl shadow-[var(--violet-deep)]/20 ring-1 ring-background/40">
								<div className="flex items-center gap-2 text-foreground">
									<div className="flex">
										{Array.from({ length: 5 }).map((_, i) => (
											<StarIcon
												key={`star-${i.toString()}`}
												className="h-3.5 w-3.5 fill-[var(--butter)] text-[var(--butter)]"
											/>
										))}
									</div>
									<span className="text-xs font-medium">4.9 from 2,400+ creators</span>
								</div>
								<p className="mt-2 text-sm leading-snug text-foreground">
									“My drops sell out in under an hour now — the storefront just works.”
								</p>
								<div className="mt-3 flex items-center gap-2">
									<span className="inline-block h-7 w-7 rounded-full bg-gradient-to-br from-[var(--violet)] to-[var(--butter)] ring-2 ring-background" />
									<span className="text-xs text-muted-foreground">Amara, illustrator</span>
								</div>
							</div>
						</div>
						{/* Decorative floating chip */}
						<div className="hidden lg:block absolute -left-6 top-10 animate-lumen-float">
							<div className="rounded-2xl bg-background/95 backdrop-blur-md p-3 shadow-xl ring-1 ring-border/60">
								<div className="flex items-center gap-2">
									<span className="grid place-items-center h-8 w-8 rounded-xl bg-[var(--butter)]/30 text-[var(--violet-deep)]">
										<SparklesIcon className="h-4 w-4" />
									</span>
									<div>
										<p className="text-[10px] uppercase tracking-wider text-muted-foreground">This week</p>
										<p className="text-sm font-semibold">+$12,480 earned</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
