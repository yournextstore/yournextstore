import Image from "next/image";
import { YnsLink } from "../yns-link";

export function BrandBanner() {
	return (
		<section className="relative overflow-hidden bg-[#f5f0eb]">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex flex-col lg:flex-row items-center gap-8 py-14 sm:py-20">
					<div className="w-full lg:w-1/2 space-y-6 text-center lg:text-left">
						<p className="text-xs uppercase tracking-[0.2em] text-foreground/60">New Collection</p>
						<h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-medium text-foreground leading-tight">
							Hello! Everyday for Women&apos;s
						</h2>
						<YnsLink
							prefetch={"eager"}
							href="/"
							className="inline-flex items-center justify-center h-12 px-8 bg-foreground text-primary-foreground text-sm font-medium tracking-wide uppercase hover:bg-foreground/90 transition-colors"
						>
							Shop Now
						</YnsLink>
					</div>
					<div className="w-full lg:w-1/2">
						<div className="relative aspect-[4/3] rounded-lg overflow-hidden">
							<Image
								src="/scraped-9.png"
								alt="Everyday collection for women"
								fill
								sizes="(max-width: 1024px) 100vw, 50vw"
								className="object-cover"
							/>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
