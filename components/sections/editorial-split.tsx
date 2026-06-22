import Image from "next/image";
import { previewHref } from "@/lib/demo-products";
import { YnsLink } from "../yns-link";

export function EditorialSplit({ preview = false }: { preview?: boolean }) {
	return (
		<section id="story" className="bg-[#f4efe6]">
			<div className="grid lg:grid-cols-2 min-h-[80vh]">
				<div className="relative aspect-square lg:aspect-auto bg-[#e8dcc8] overflow-hidden">
					<Image
						src="/scraped-2.jpg"
						alt="A hand-poured candle resting on travertine"
						fill
						sizes="(max-width: 1024px) 100vw, 50vw"
						className="object-cover"
					/>
					<div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#f4efe6]/20" />
				</div>
				<div className="flex items-center px-6 sm:px-12 lg:px-20 py-20 sm:py-28">
					<div className="max-w-lg">
						<p className="text-[11px] tracking-luxe uppercase text-[#8b6b4a] mb-6">A House of Light</p>
						<h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-foreground leading-[1.1]">
							We make fragrance the slow way, in batches small enough to remember.
						</h2>
						<div className="mt-8 space-y-5 text-base text-muted-foreground leading-[1.85] font-light">
							<p>
								Each candle in our maison is poured by hand in a sunlit atelier just outside Grasse. We work
								with growers who let the seasons set the pace — orris root harvested at three years, vetiver
								dried for a full summer, bergamot pressed within hours of the morning pick.
							</p>
							<p>
								The wax is a coconut-and-apricot blend that we cool overnight on travertine slabs. The wicks
								are braided cotton, dipped twice. The result is a flame that flickers low and a fragrance that
								arrives quietly, the way light does in the late afternoon.
							</p>
						</div>
						<YnsLink
							prefetch="eager"
							href={previewHref("/products", preview)}
							className="mt-10 inline-flex items-center gap-3 text-xs tracking-luxe uppercase text-foreground border-b border-[#c9a87c] pb-1 hover:text-[#8b6b4a] transition-colors"
						>
							Read the journal
						</YnsLink>
					</div>
				</div>
			</div>
		</section>
	);
}
