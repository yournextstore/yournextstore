import Image from "next/image";
import { YnsLink } from "../yns-link";

const ENTRIES = [
	{
		image: "/scraped-2.jpg",
		date: "may 14, 2026",
		category: "ritual",
		title: "i tried sleeping like a victorian for a week",
		excerpt:
			"no screens after sundown, lavender pillow, weighted blanket. on day four i cried into a teacup.",
		href: "/products",
	},
	{
		image: "/scraped-3.jpg",
		date: "may 02, 2026",
		category: "science",
		title: "what your 3 a.m. brain is actually doing",
		excerpt:
			"a neurologist explains the cortisol spike, the to-do list spiral, and the cure (it isn’t scrolling).",
		href: "/products",
	},
	{
		image: "/scraped-4.jpg",
		date: "apr 21, 2026",
		category: "interview",
		title: "the ballerina who sleeps in two shifts",
		excerpt: "on biphasic rest, jet lag, lipstick before bed, and the secret choreography of falling asleep.",
		href: "/products",
	},
];

export function Diaries() {
	return (
		<section className="bg-[var(--yns-paper)]">
			<div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				<div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 mb-12 sm:mb-16">
					<div>
						<div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-[var(--yns-red)] mb-4">
							<span className="inline-block w-8 h-px bg-[var(--yns-red)]" />
							journal
						</div>
						<h2 className="font-[family-name:var(--font-display)] italic text-5xl sm:text-6xl lg:text-7xl tracking-tight text-[var(--yns-ink)] leading-[0.95]">
							dead tired diaries<span className="text-[var(--yns-red)] not-italic">.</span>
						</h2>
					</div>
					<YnsLink
						prefetch={"eager"}
						href="/products"
						className="text-xs uppercase tracking-[0.25em] text-[var(--yns-ink)] hover:text-[var(--yns-red)] border-b border-[var(--yns-ink)]/30 pb-1 transition-colors"
					>
						read every entry →
					</YnsLink>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
					{ENTRIES.map((entry) => (
						<YnsLink prefetch={"eager"} key={entry.title} href={entry.href} className="group block">
							<div className="relative aspect-[4/5] bg-[var(--yns-red)] overflow-hidden mb-5">
								<Image
									src={entry.image}
									alt=""
									fill
									sizes="(max-width: 768px) 100vw, 33vw"
									className="object-cover mix-blend-multiply transition-transform duration-700 group-hover:scale-[1.04]"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-[var(--yns-oxblood)]/30 to-transparent" />
								<div className="absolute top-4 left-4 right-4 flex items-center justify-between text-white text-[10px] uppercase tracking-[0.3em]">
									<span>{entry.category}</span>
									<span>{entry.date}</span>
								</div>
							</div>
							<h3 className="font-[family-name:var(--font-display)] italic text-2xl sm:text-3xl text-[var(--yns-ink)] leading-tight group-hover:text-[var(--yns-red)] transition-colors">
								{entry.title}
							</h3>
							<p className="mt-3 text-sm text-[var(--yns-ink)]/65 leading-relaxed lowercase">
								{entry.excerpt}
							</p>
							<span className="mt-4 inline-block text-[10px] uppercase tracking-[0.3em] text-[var(--yns-red)]">
								read on →
							</span>
						</YnsLink>
					))}
				</div>
			</div>
		</section>
	);
}
