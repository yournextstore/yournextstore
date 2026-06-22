import Image from "next/image";
import { YnsLink } from "@/components/yns-link";

export function Lookbook() {
	return (
		<section id="kynfolk" className="bg-background">
			<div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-16 sm:py-24">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
					<div className="lg:col-span-9 relative aspect-[16/9] overflow-hidden bg-secondary">
						<Image
							src="/scraped-2.jpg"
							alt="The YNS Folk lookbook — a sun-bleached Mediterranean editorial"
							fill
							sizes="(max-width: 1024px) 100vw, 75vw"
							className="object-cover"
							priority={false}
						/>
						<div
							aria-hidden
							className="absolute inset-0 bg-gradient-to-tr from-black/25 via-transparent to-black/10"
						/>
						<div className="absolute top-6 left-6 sm:top-10 sm:left-10">
							<p className="font-eyebrow text-[10px] text-white/85">— The YNS Folk · Spring Editorial —</p>
						</div>
					</div>
					<div className="lg:col-span-3 lg:pb-4">
						<h2 className="font-serif font-light text-foreground text-[40px] sm:text-[52px] tracking-tight leading-[0.95]">
							A slower
							<br />
							summer.
						</h2>
						<p className="mt-6 text-[15px] leading-[1.75] text-muted-foreground">
							Followed from courtyards in Tinos to ateliers in Como — the new YNS Folk lookbook studies what
							it means to dress quietly, well, and for many seasons.
						</p>
						<YnsLink
							href="#"
							className="inline-flex items-center gap-2 mt-7 font-eyebrow text-[11px] text-foreground editorial-underline"
						>
							Read the journal →
						</YnsLink>
					</div>
				</div>
			</div>
		</section>
	);
}
