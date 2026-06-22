import { ArrowUpRightIcon } from "lucide-react";
import Image from "next/image";
import { previewHref } from "@/lib/demo-products";
import { YnsLink } from "../yns-link";

export function Toolkit({ preview = false }: { preview?: boolean }) {
	return (
		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
			<div className="relative overflow-hidden rounded-[2.5rem] bg-lumen-violet text-background">
				<div
					aria-hidden="true"
					className="absolute inset-0 opacity-50 [background-image:radial-gradient(circle_at_85%_15%,oklch(0.85_0.13_88/0.55),transparent_45%),radial-gradient(circle_at_5%_85%,oklch(0.95_0.05_295/0.35),transparent_50%)]"
				/>
				<div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 p-8 sm:p-12 lg:p-16 items-center">
					<div className="lg:col-span-7">
						<span className="inline-flex items-center gap-2 rounded-full bg-background/15 px-3 py-1 text-xs font-medium uppercase tracking-wider ring-1 ring-background/20 backdrop-blur-sm">
							Artist toolkit
						</span>
						<h2 className="mt-5 font-serif text-4xl sm:text-5xl lg:text-6xl leading-[1] tracking-tight">
							A powerful artist toolkit — beautifully &amp;{" "}
							<em className="not-italic italic">completely controlled.</em>
						</h2>
						<p className="mt-5 max-w-lg text-base sm:text-lg text-background/80 leading-relaxed">
							From storefront to checkout to fulfilment, everything is yours to brand. Connect Stripe, ship
							your drop, and watch the earnings roll in.
						</p>
						<div className="mt-8 flex flex-wrap items-center gap-3">
							<YnsLink
								prefetch={"eager"}
								href={previewHref("/products", preview)}
								className="inline-flex items-center gap-2 rounded-full bg-background px-5 py-3 text-sm font-semibold text-[var(--violet-deep)] hover:bg-[var(--butter)] hover:text-foreground transition-colors"
							>
								Explore the toolkit
								<ArrowUpRightIcon className="h-3.5 w-3.5" />
							</YnsLink>
							<YnsLink
								prefetch={"eager"}
								href={previewHref("/faq", preview)}
								className="inline-flex items-center gap-2 rounded-full ring-1 ring-background/30 bg-background/10 px-5 py-3 text-sm font-medium hover:bg-background/20 transition-colors"
							>
								Read the docs
							</YnsLink>
						</div>
						<dl className="mt-10 grid grid-cols-3 gap-6 max-w-md">
							{[
								{ label: "Creators", value: "12k+" },
								{ label: "Avg launch", value: "8 min" },
								{ label: "Royalty kept", value: "100%" },
							].map((stat) => (
								<div key={stat.label}>
									<dt className="text-xs uppercase tracking-wider text-background/60">{stat.label}</dt>
									<dd className="mt-1 font-serif text-3xl tracking-tight">{stat.value}</dd>
								</div>
							))}
						</dl>
					</div>

					{/* Right: Product preview thumbnail card */}
					<div className="lg:col-span-5">
						<div className="relative aspect-[4/5] sm:aspect-[5/6] lg:aspect-[4/5] w-full overflow-hidden rounded-3xl bg-background/10 ring-1 ring-background/20 shadow-2xl">
							<Image
								src="/scraped-4.jpg"
								alt="Storefront preview"
								fill
								sizes="(max-width: 1024px) 100vw, 40vw"
								className="object-cover"
							/>
							<div
								aria-hidden="true"
								className="absolute inset-0 bg-gradient-to-t from-[var(--violet-deep)]/40 to-transparent"
							/>
							<div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-background/95 backdrop-blur-sm p-4 ring-1 ring-background/40 text-foreground">
								<div className="flex items-center justify-between gap-3">
									<div>
										<p className="text-xs text-muted-foreground">Today's drop</p>
										<p className="text-sm font-semibold">Aurora Lightroom Presets</p>
									</div>
									<span className="rounded-full bg-[var(--butter)] px-2.5 py-1 text-xs font-semibold text-foreground">
										$18
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
