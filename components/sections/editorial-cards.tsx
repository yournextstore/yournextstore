import { YnsLink } from "../yns-link";

const cards = [
	{
		title: "For Big Decisions",
		copy: "Career pivots, hard conversations, and choices you can’t un-make. Books that sit with you in the deep end.",
		href: "/products",
		tag: "01",
		accent: "var(--chartreuse)",
		Illustration: BigDecisionsIllo,
	},
	{
		title: "For Little Wonders",
		copy: "The tiny questions you carry on the train. Pocket-sized prompts, oddities, and quiet rituals.",
		href: "/products",
		tag: "02",
		accent: "var(--marigold)",
		Illustration: LittleWondersIllo,
	},
	{
		title: "For Creative Blocks",
		copy: "Stuck mid-sentence, mid-canvas, mid-launch? Workbooks and tools that knock something loose.",
		href: "/products",
		tag: "03",
		accent: "var(--cobalt)",
		Illustration: CreativeBlocksIllo,
	},
] as const;

export function EditorialCards() {
	return (
		<section className="bg-background border-y border-border">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				<div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
					<h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground max-w-xl">
						Pick a shelf. The shelf picks you back.
					</h2>
					<YnsLink
						prefetch="eager"
						href="/products"
						className="text-sm font-semibold tracking-[0.18em] uppercase text-cobalt hover:text-cobalt-dark"
					>
						All collections →
					</YnsLink>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
					{cards.map(({ title, copy, href, tag, accent, Illustration }) => (
						<YnsLink
							key={title}
							prefetch="eager"
							href={href}
							className="group relative flex flex-col rounded-2xl border-2 border-ink bg-card overflow-hidden transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0_var(--ink)]"
						>
							<div
								className="relative aspect-[5/4] flex items-center justify-center overflow-hidden"
								style={{ background: accent }}
							>
								<Illustration />
								<span className="absolute top-4 left-4 font-display text-sm font-black text-ink tracking-widest">
									{tag}
								</span>
							</div>
							<div className="p-6 sm:p-7 border-t-2 border-ink">
								<h3 className="font-display text-2xl sm:text-3xl font-black text-foreground">{title}</h3>
								<p className="mt-3 text-sm text-muted-foreground leading-relaxed">{copy}</p>
								<span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-cobalt">
									Browse the shelf
									<span className="transition-transform group-hover:translate-x-1">→</span>
								</span>
							</div>
						</YnsLink>
					))}
				</div>
			</div>
		</section>
	);
}

function BigDecisionsIllo() {
	return (
		<svg viewBox="0 0 200 160" className="w-3/4 h-3/4">
			<g stroke="var(--ink)" strokeWidth="2.5" fill="none" strokeLinejoin="round" strokeLinecap="round">
				<rect x="40" y="30" width="120" height="90" fill="var(--cream)" rx="3" />
				<line x1="100" y1="30" x2="100" y2="120" />
				<path d="M55 55 L85 55 M55 70 L80 70 M55 85 L88 85 M55 100 L75 100" />
				<path d="M115 55 L145 55 M115 70 L140 70 M115 85 L148 85 M115 100 L135 100" />
				<circle cx="160" cy="35" r="10" fill="var(--marigold)" />
				<path d="M157 35 L162 39 L165 32" stroke="var(--ink)" strokeWidth="2" />
			</g>
		</svg>
	);
}

function LittleWondersIllo() {
	return (
		<svg viewBox="0 0 200 160" className="w-3/4 h-3/4">
			<g stroke="var(--ink)" strokeWidth="2.5" fill="none" strokeLinejoin="round" strokeLinecap="round">
				<circle cx="100" cy="80" r="42" fill="var(--cream)" />
				<circle cx="100" cy="80" r="6" fill="var(--cobalt)" />
				<line x1="100" y1="50" x2="100" y2="60" />
				<line x1="100" y1="100" x2="100" y2="110" />
				<line x1="70" y1="80" x2="80" y2="80" />
				<line x1="120" y1="80" x2="130" y2="80" />
				<line x1="100" y1="80" x2="118" y2="68" stroke="var(--ink)" strokeWidth="3" />
				<path d="M40 40 L48 32 M160 130 L168 122 M40 130 L32 138" />
			</g>
		</svg>
	);
}

function CreativeBlocksIllo() {
	return (
		<svg viewBox="0 0 200 160" className="w-3/4 h-3/4">
			<g stroke="var(--ink)" strokeWidth="2.5" fill="none" strokeLinejoin="round" strokeLinecap="round">
				<rect x="50" y="60" width="35" height="35" fill="var(--chartreuse)" />
				<rect x="90" y="40" width="35" height="55" fill="var(--cream)" />
				<rect x="130" y="70" width="35" height="25" fill="var(--marigold)" />
				<path d="M50 110 L165 110" />
				<path d="M35 30 Q60 20 80 35 T130 30" />
				<circle cx="35" cy="30" r="3" fill="var(--ink)" />
			</g>
		</svg>
	);
}
