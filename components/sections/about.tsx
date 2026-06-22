import { YnsLink } from "@/components/yns-link";

export function About() {
	return (
		<section id="about" className="bg-editorial-stone paper-grain">
			<div className="max-w-[1100px] mx-auto px-5 sm:px-8 lg:px-12 py-24 sm:py-32 text-center">
				<p className="font-eyebrow text-[10px] text-muted-foreground mb-6">— Founded 2021 —</p>
				<h2 className="font-serif font-light text-foreground text-[40px] sm:text-[56px] tracking-tight leading-[1.05]">
					Quietly made, in conversation with the women who wear it.
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 mt-14 text-left">
					<p className="text-[15px] leading-[1.85] text-foreground/80">
						Your Next Store began as a small atelier studying the brush-painted silks of Northern Italy. Today
						it remains the same — a single design table, a careful list of growers, and a refusal to chase the
						season.
					</p>
					<p className="text-[15px] leading-[1.85] text-foreground/80">
						Every garment is cut to soften with wear and to fit the way you actually live. We release three
						capsules a year, never more, so each piece arrives only when it is genuinely ready to leave the
						studio.
					</p>
				</div>
				<YnsLink
					href="#sustainability"
					className="inline-block mt-12 font-eyebrow text-[11px] text-foreground editorial-underline"
				>
					Read our manifesto
				</YnsLink>
			</div>
		</section>
	);
}
