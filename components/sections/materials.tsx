import Image from "next/image";
import { YnsLink } from "../yns-link";

const studies = [
	{
		eyebrow: "Material I",
		title: "Bent beech",
		body: "Seven thin veneers laminated under pressure into a single continuous shell.",
		image: "/scraped-3.jpg",
		tone: "oklch(0.78 0.085 70)",
	},
	{
		eyebrow: "Material II",
		title: "Honed travertine",
		body: "Quarried in Bagni di Tivoli, hand-cut into surfaces meant to age slowly.",
		image: "/scraped-2.jpg",
		tone: "oklch(0.85 0.04 80)",
	},
	{
		eyebrow: "Material III",
		title: "Brushed brass",
		body: "Solid hardware, polished only where the hand touches it the most.",
		image: "/scraped-4.jpg",
		tone: "oklch(0.7 0.12 65)",
	},
];

export function Materials() {
	return (
		<section className="relative bg-background">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				<div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
					<div>
						<p className="editorial-eyebrow text-muted-foreground">Studies · Material</p>
						<h2 className="mt-4 font-display italic text-4xl sm:text-5xl lg:text-6xl leading-[0.95] tracking-tight">
							Three notes on how
							<br />
							things are made.
						</h2>
					</div>
					<YnsLink
						prefetch={"eager"}
						href="/products"
						className="inline-flex w-fit items-center gap-2 text-[0.7rem] uppercase tracking-[0.22em] font-medium border-b border-foreground/40 hover:border-foreground transition-colors pb-0.5"
					>
						Read the journal
					</YnsLink>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
					{studies.map((s, i) => (
						<article key={s.title} className="group flex flex-col">
							<div
								className="relative aspect-[4/5] overflow-hidden rounded-sm"
								style={{ background: s.tone }}
							>
								<Image
									src={s.image}
									alt={s.title}
									fill
									sizes="(min-width: 768px) 30vw, 90vw"
									className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
								/>
								<span className="absolute top-3 left-3 editorial-eyebrow text-white/90 bg-foreground/40 backdrop-blur-sm px-2 py-1 rounded-sm">
									0{i + 1}
								</span>
							</div>
							<div className="mt-5 flex items-start justify-between gap-4">
								<div>
									<p className="editorial-eyebrow text-muted-foreground">{s.eyebrow}</p>
									<h3 className="mt-2 font-display italic text-2xl text-foreground">{s.title}</h3>
								</div>
								<span className="font-display italic text-foreground/30 text-3xl leading-none">/{i + 1}</span>
							</div>
							<p className="mt-3 text-sm leading-relaxed text-muted-foreground max-w-sm">{s.body}</p>
						</article>
					))}
				</div>
			</div>
		</section>
	);
}
