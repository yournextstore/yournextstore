import { LeafIcon, RecycleIcon, SproutIcon } from "lucide-react";
import Image from "next/image";

const PILLARS = [
	{
		icon: SproutIcon,
		title: "Single-origin botanicals",
		body: "Every herb is traced to a farm or grower we know by name.",
	},
	{
		icon: RecycleIcon,
		title: "Carbon-neutral journey",
		body: "Glass packaging, refill program, and offset shipping by default.",
	},
	{
		icon: LeafIcon,
		title: "Slow formulation",
		body: "Small-batch blends rested and lab-tested before they reach you.",
	},
];

export function About() {
	return (
		<section id="about" className="relative overflow-hidden bg-leaf-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
					{/* image collage */}
					<div className="lg:col-span-5">
						<div className="relative aspect-[4/5] rounded-[24px] overflow-hidden ring-1 ring-leaf-200">
							<Image
								src="/scraped-1.jpg"
								alt="Golden-hour ritual in the field"
								fill
								sizes="(max-width: 1024px) 100vw, 40vw"
								className="object-cover"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-[#0f2412]/30 to-transparent" />
						</div>
						<div className="relative -mt-16 ml-auto mr-6 sm:mr-12 w-56 aspect-square rounded-[20px] overflow-hidden ring-4 ring-leaf-50 shadow-xl">
							<Image
								src="/scraped-2.jpg"
								alt="Botanical flat lay"
								fill
								sizes="220px"
								className="object-cover"
							/>
						</div>
					</div>

					{/* copy */}
					<div className="lg:col-span-7">
						<p className="text-xs uppercase tracking-[0.2em] text-leaf-700 font-semibold">
							A rooted philosophy
						</p>
						<h2 className="mt-3 font-display text-4xl sm:text-5xl lg:text-6xl tracking-tight text-foreground text-balance">
							Wellness, the way <span className="italic font-light">nature</span> intended.
						</h2>
						<p className="mt-6 text-lg leading-relaxed text-muted-foreground text-pretty max-w-xl">
							We believe daily wellness should feel like a return to the earth — quiet, considered, and
							quietly powerful. Each Your Next Store formula begins on a partner farm and ends in your ritual,
							with nothing in between but care.
						</p>

						<div className="mt-10 grid sm:grid-cols-3 gap-5">
							{PILLARS.map(({ icon: Icon, title, body }) => (
								<div
									key={title}
									className="rounded-2xl bg-card p-5 ring-1 ring-leaf-200/70 hover:ring-leaf-300 transition-all"
								>
									<span className="grid place-items-center h-10 w-10 rounded-full bg-primary text-primary-foreground">
										<Icon className="h-4 w-4" />
									</span>
									<h3 className="mt-4 text-sm font-semibold text-foreground">{title}</h3>
									<p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{body}</p>
								</div>
							))}
						</div>

						<dl className="mt-12 grid grid-cols-3 gap-6 border-t border-leaf-200 pt-8">
							<div>
								<dt className="text-xs uppercase tracking-wider text-muted-foreground">Founded</dt>
								<dd className="mt-1 font-display text-3xl text-foreground">2019</dd>
							</div>
							<div>
								<dt className="text-xs uppercase tracking-wider text-muted-foreground">Partner farms</dt>
								<dd className="mt-1 font-display text-3xl text-foreground">27</dd>
							</div>
							<div>
								<dt className="text-xs uppercase tracking-wider text-muted-foreground">Refills shipped</dt>
								<dd className="mt-1 font-display text-3xl text-foreground">142K</dd>
							</div>
						</dl>
					</div>
				</div>
			</div>
		</section>
	);
}
