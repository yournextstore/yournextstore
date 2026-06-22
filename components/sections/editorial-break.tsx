import { ArrowRightIcon } from "lucide-react";
import Image from "next/image";
import { YnsLink } from "@/components/yns-link";
import { previewHref } from "@/lib/demo-products";

type EditorialBreakProps = {
	isPreview?: boolean;
};

export function EditorialBreak({ isPreview = false }: EditorialBreakProps) {
	return (
		<section className="bg-cream">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
				<div className="relative overflow-hidden rounded-md min-h-[460px] sm:min-h-[560px]">
					<Image
						src="/scraped-1.jpg"
						alt="Sunlit Mediterranean living room with boucle armchair and travertine table"
						fill
						sizes="(max-width: 1400px) 100vw, 1400px"
						className="object-cover"
					/>
					<div
						aria-hidden="true"
						className="absolute inset-0 bg-gradient-to-r from-walnut/75 via-walnut/35 to-transparent"
					/>
					<div
						aria-hidden="true"
						className="absolute inset-0 bg-gradient-to-t from-walnut/30 via-transparent to-transparent"
					/>

					<div className="relative h-full grid place-items-center sm:place-items-start sm:content-center px-6 sm:px-14 lg:px-20 py-16 sm:py-24">
						<div className="max-w-xl text-cream">
							<p className="text-[11px] uppercase tracking-[0.32em] text-cream/70 mb-6 flex items-center gap-3">
								<span className="inline-block h-px w-8 bg-cream/50" aria-hidden="true" />
								Field notes · No. 12
							</p>
							<blockquote className="font-serif text-3xl sm:text-4xl lg:text-5xl leading-[1.1] text-balance">
								<span className="text-cream/40">&ldquo;</span>
								The most lived-in rooms are the ones that learned to slow down.
								<span className="text-cream/40">&rdquo;</span>
							</blockquote>
							<p className="mt-6 text-sm text-cream/65 italic">— Elena Marrone, atelier founder</p>
							<YnsLink
								href={previewHref("/faq", isPreview)}
								className="mt-10 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-cream border-b border-cream/40 pb-1.5 hover:border-cream transition-colors"
							>
								Read the story
								<ArrowRightIcon className="h-3.5 w-3.5" />
							</YnsLink>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
