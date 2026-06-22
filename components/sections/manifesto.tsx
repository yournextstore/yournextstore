import Image from "next/image";
import { YnsLink } from "../yns-link";

export function Manifesto() {
	return (
		<section className="bg-bone">
			<div className="max-w-[1400px] mx-auto px-6 sm:px-10 py-24 sm:py-32 lg:py-40">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
					<div className="order-2 lg:order-1">
						<p className="eyebrow text-rosewood mb-8">A Manifesto</p>
						<h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-ink leading-[1.08] font-light">
							We were made to feel —{" "}
							<span className="italic text-rosewood">slowly, fully, without apology.</span>
						</h2>
						<div className="mt-10 space-y-5 max-w-md text-ink/70 text-base leading-relaxed">
							<p>
								Your Next Store is a quiet ritual disguised as a brand. We craft objects of warm, attentive
								care — botanicals pressed for their patience, materials chosen for their honesty.
							</p>
							<p>
								Each piece is an invitation to return to the body, to the present, to the unhurried pleasure
								of being human.
							</p>
						</div>
						<div className="mt-10">
							<YnsLink
								prefetch={"eager"}
								href="#about"
								className="inline-flex items-center gap-3 eyebrow text-ink border-b border-ink/30 pb-1 hover:border-ink transition-colors"
							>
								Read Our Philosophy
								<span className="text-base font-light leading-none">→</span>
							</YnsLink>
						</div>
					</div>

					<div className="order-1 lg:order-2 relative">
						<div className="relative aspect-[4/5] w-full overflow-hidden">
							<Image
								src="/scraped-1.jpg"
								alt="A still life of warm-toned wellness essentials"
								fill
								sizes="(max-width: 1024px) 100vw, 50vw"
								className="object-cover"
							/>
						</div>
						<div className="absolute -bottom-6 -left-4 sm:-left-10 hidden lg:block">
							<div className="bg-bone px-6 py-4 max-w-[16rem]">
								<p className="font-serif italic text-ink text-lg leading-snug">
									&ldquo;A study in skin, silk, and slow time.&rdquo;
								</p>
								<p className="eyebrow text-ink/60 text-[0.6rem] mt-2">— Atelier Note 03</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
