import Image from "next/image";

const stockists = [
	{ city: "Brooklyn, NY", spot: "Foragers Market" },
	{ city: "Los Angeles, CA", spot: "Cookbook Echo Park" },
	{ city: "Austin, TX", spot: "Wheatsville Co-op" },
	{ city: "Portland, OR", spot: "Providore Fine Foods" },
	{ city: "Chicago, IL", spot: "Publican Quality Meats" },
	{ city: "Nashville, TN", spot: "Bare Bones Butcher" },
];

export function FindUs() {
	return (
		<section id="find-us" className="relative bg-soot text-cream overflow-hidden">
			<div aria-hidden className="absolute inset-0 bg-soot-gradient opacity-95" />
			<div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 py-20 sm:py-28 grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-20 items-center">
				<div>
					<span className="inline-flex items-center gap-3 text-[11px] font-condensed tracking-[0.32em] text-gold">
						<span aria-hidden className="h-px w-10 bg-gold/60" /> Find Us
					</span>
					<h2 className="mt-4 font-display text-5xl sm:text-6xl text-cream leading-[1.02]">
						In a kitchen near you.
					</h2>
					<p className="mt-6 max-w-md text-cream/75 leading-relaxed">
						We&apos;re in 200+ independent grocers, bottle shops and corner delis across the US — and the
						walk-in pantries of a few chefs who really should know better.
					</p>
					<ul className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
						{stockists.map((s) => (
							<li key={s.city} className="border-t border-cream/15 pt-4">
								<div className="font-condensed tracking-[0.22em] text-[11px] text-gold">{s.city}</div>
								<div className="mt-1 font-display text-2xl text-cream">{s.spot}</div>
							</li>
						))}
					</ul>
				</div>
				<div className="relative aspect-[4/5] sm:aspect-square w-full rounded-sm overflow-hidden border border-cream/10 shadow-[0_30px_80px_rgba(0,0,0,0.55)]">
					<Image
						src="/scraped-5.jpg"
						alt="Abstract flame backdrop"
						fill
						sizes="(max-width: 1024px) 100vw, 560px"
						className="object-cover"
					/>
					<div
						aria-hidden
						className="absolute inset-0 bg-gradient-to-br from-ember/60 via-transparent to-soot/80 mix-blend-multiply"
					/>
					<div className="absolute inset-0 flex flex-col justify-end p-8">
						<div className="font-condensed text-[11px] tracking-[0.32em] text-gold/90">Wholesale</div>
						<div className="mt-2 font-display text-4xl text-cream leading-tight">Put us on your shelf.</div>
						<div className="mt-5">
							<a
								href="mailto:wholesale@yournextstore.com"
								className="inline-flex items-center gap-2 bg-gold text-soot px-5 py-3 font-condensed text-[11px] tracking-[0.22em] hover:bg-cream transition-colors"
							>
								Talk Wholesale →
							</a>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
