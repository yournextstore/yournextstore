import Image from "next/image";
import { YnsLink } from "../yns-link";

export function RecipeSection() {
	return (
		<section className="relative bg-[#f5e4d2] overflow-hidden">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-20 sm:py-28">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
					{/* Editorial collage */}
					<div className="relative lg:col-span-7 aspect-[5/4] sm:aspect-[6/5]">
						{/* Torn paper background */}
						<div className="absolute inset-0 rounded-[2px] bg-[#fbf3e6] shadow-[8px_8px_0_rgba(31,70,194,0.12)]" />
						<div className="absolute inset-2 sm:inset-4 overflow-hidden bg-[#ecd3b8]">
							<Image
								src="/scraped-3.jpg"
								alt="An afternoon table"
								fill
								sizes="(max-width: 1024px) 100vw, 60vw"
								className="object-cover"
							/>
							<div className="absolute inset-0 bg-gradient-to-tr from-[#1f46c2]/15 via-transparent to-[#e8b547]/15 mix-blend-multiply" />
						</div>
						{/* Floating cut-outs */}
						<div className="absolute -top-6 -right-3 sm:right-6 w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-[#e8b547] shadow-[0_8px_30px_-8px_rgba(232,181,71,0.6)] flex items-center justify-center rotate-[-8deg]">
							<div className="text-center">
								<div className="font-script text-[#1f46c2] text-xl leading-none">our</div>
								<div className="font-display text-[#d8351f] text-base uppercase tracking-[0.18em]">Pick</div>
							</div>
						</div>
						<div className="absolute -bottom-6 left-6 sm:-left-6 px-5 py-3 bg-[#d8351f] text-[#f5e4d2] uppercase font-display tracking-[0.2em] text-sm sm:text-base rotate-[-3deg] shadow-[0_4px_0_rgba(0,0,0,0.15)]">
							Long lunch No. 014
						</div>
					</div>

					{/* Recipe text */}
					<div className="lg:col-span-5">
						<p className="font-script text-[#1f46c2] text-2xl sm:text-3xl leading-none">a small ritual</p>
						<h2 className="mt-2 font-display text-4xl sm:text-5xl lg:text-[56px] text-[#2a2622] leading-[0.95] uppercase">
							How to set
							<br />a slow table
						</h2>
						<p className="mt-5 text-[15px] text-[#6b5e4e] leading-relaxed">
							There is a particular afternoon — somewhere between the second espresso and a swim — that every
							good object in the shop seems to remember. Here&apos;s how we set the stage for it at home.
						</p>

						<ol className="mt-8 space-y-4">
							{[
								{
									step: "01",
									title: "Linen, not pressed",
									body: "Crumpled is the point. A washed flax cloth in butter or ochre.",
								},
								{
									step: "02",
									title: "Citrus in a small bowl",
									body: "Blood orange halves, a lemon, a sprig of rosemary across the rim.",
								},
								{
									step: "03",
									title: "Glass for everyone",
									body: "A coupe, a tumbler, a tiny water glass. None of them have to match.",
								},
								{
									step: "04",
									title: "One candle, lit early",
									body: "Brass holder, beeswax taper. Light it before anyone needs it lit.",
								},
							].map((s) => (
								<li key={s.step} className="flex gap-4">
									<span className="shrink-0 font-display text-[#d8351f] text-3xl leading-none">{s.step}</span>
									<div>
										<p className="font-display text-lg text-[#2a2622]">{s.title}</p>
										<p className="text-sm text-[#6b5e4e] leading-relaxed">{s.body}</p>
									</div>
								</li>
							))}
						</ol>

						<YnsLink
							prefetch={"eager"}
							href="/products"
							className="mt-10 inline-flex items-center justify-center gap-2 h-12 px-7 bg-[#1f46c2] text-[#f5e4d2] uppercase tracking-[0.22em] text-[11px] font-medium hover:bg-[#15348f] transition-colors rounded-full"
						>
							Shop the table
							<span aria-hidden>→</span>
						</YnsLink>
					</div>
				</div>
			</div>
		</section>
	);
}
