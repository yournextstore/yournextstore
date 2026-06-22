import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { YnsLink } from "../yns-link";

export function Editorial() {
	return (
		<section className="bg-yns-cream">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				<div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
					<div className="relative aspect-[5/6] rounded-[32px] overflow-hidden yns-grain border border-yns-pink-soft">
						<Image
							src="/scraped-1.jpg"
							alt="Editorial portrait — glossy hair lit by salon strobe"
							fill
							sizes="(max-width: 1024px) 100vw, 50vw"
							className="object-cover"
						/>
						<div
							className="absolute inset-0"
							aria-hidden="true"
							style={{
								background: "radial-gradient(circle at 20% 80%, rgba(248,182,200,0.25) 0%, transparent 60%)",
							}}
						/>
					</div>
					<div>
						<p className="text-[11px] tracking-[0.24em] uppercase font-bold text-yns-mauve">
							The YNS Philosophy
						</p>
						<h2 className="mt-5 yns-display text-4xl sm:text-5xl lg:text-6xl text-yns-ink not-italic leading-[0.95]">
							Salon results, <em className="italic">bottled</em> for your bathroom.
						</h2>
						<p className="mt-6 text-base sm:text-lg leading-relaxed text-yns-ink/70 max-w-lg">
							Every formula is co-developed with editorial stylists and clinical chemists. No greasy residue,
							no shortcuts — just the kind of hair you can&apos;t stop touching.
						</p>
						<div className="mt-10 flex flex-wrap items-center gap-6">
							<YnsLink
								href="/products"
								className="inline-flex items-center gap-2 h-12 px-7 rounded-full bg-yns-ink text-yns-cream text-[11px] tracking-[0.22em] uppercase font-bold hover:bg-yns-ink/85 transition"
							>
								Shop the System
								<ArrowUpRight className="h-4 w-4" />
							</YnsLink>
							<YnsLink
								href="/#about"
								className="text-[11px] tracking-[0.22em] uppercase font-bold text-yns-ink hover:opacity-60 transition border-b border-yns-ink pb-1"
							>
								Read the Story
							</YnsLink>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
