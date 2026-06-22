import Image from "next/image";
import { YnsLink } from "../yns-link";

export function EditorialBanner() {
	return (
		<section className="bg-cream-soft">
			<div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
				<div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12 lg:gap-12">
					{/* Image side */}
					<div className="relative overflow-hidden rounded-sm lg:col-span-7">
						<div className="relative aspect-[4/5] sm:aspect-[16/11]">
							<Image
								src="/scraped-2.jpg"
								alt="New Season"
								fill
								sizes="(max-width: 1024px) 100vw, 60vw"
								className="object-cover"
							/>
							<div
								aria-hidden="true"
								className="absolute inset-0 bg-gradient-to-tr from-[#1a1410]/30 via-transparent to-transparent"
							/>
						</div>
					</div>
					{/* Copy side */}
					<div className="flex flex-col justify-center lg:col-span-5 lg:pl-4">
						<p className="text-[11px] font-medium uppercase tracking-[0.28em] text-clay">
							The New Season Edit
						</p>
						<h2
							className="mt-4 font-display text-[44px] italic leading-[1.02] tracking-tight text-foreground sm:text-[60px]"
							style={{ fontFamily: "var(--font-cormorant)" }}
						>
							Whispered florals,
							<br />
							soft-touch silhouettes.
						</h2>
						<p className="mt-6 max-w-md text-[15px] leading-relaxed text-muted-foreground">
							Heirloom lace, brushed satin and barely-there meshes — our spring drop is built around the
							pieces you reach for first. Layer them as loungewear or wear alone for an unhurried morning.
						</p>
						<div className="mt-8 flex flex-col gap-3 sm:flex-row">
							<YnsLink
								prefetch={"eager"}
								href="/products"
								className="inline-flex h-12 items-center justify-center rounded-full bg-foreground px-8 text-[12px] font-semibold uppercase tracking-[0.2em] text-cream transition-colors hover:bg-foreground/85"
							>
								Discover the Edit
							</YnsLink>
							<YnsLink
								prefetch={"eager"}
								href="/products"
								className="inline-flex h-12 items-center justify-center rounded-full border border-foreground/15 bg-transparent px-8 text-[12px] font-semibold uppercase tracking-[0.2em] text-foreground transition-colors hover:border-foreground/40"
							>
								Lookbook
							</YnsLink>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
