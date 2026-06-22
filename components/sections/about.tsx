import Image from "next/image";

const features = [
	{
		title: "Free Delivery",
		caption: "Apply to all orders over $100",
		icon: "🚚",
		bg: "bg-peach-soft",
	},
	{
		title: "Great Daily Deal",
		caption: "Curated picks from organic vendors",
		icon: "🌿",
		bg: "bg-lime/30",
	},
];

const vendors = [
	{ name: "M&M Food Market", eta: "12 min", price: "20.42", tag: null },
	{ name: "T&T Food Market", eta: "13 min", price: "19.50", tag: "Lower price" },
	{ name: "Loblaws Pantry", eta: "18 min", price: "21.10", tag: null },
	{ name: "FreshCo Organic", eta: "22 min", price: "19.95", tag: null },
];

export function About() {
	return (
		<section id="about" className="bg-cream">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
				{/* Two-up promo cards */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
					{features.map((feature) => (
						<div
							key={feature.title}
							className={`${feature.bg} rounded-2xl p-6 flex items-center gap-5 border border-border/60`}
						>
							<div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-cream/80 text-2xl shadow-sm">
								{feature.icon}
							</div>
							<div>
								<h3 className="font-display font-semibold text-forest-deep text-lg">{feature.title}</h3>
								<p className="text-sm text-forest-deep/70 mt-1">{feature.caption}</p>
							</div>
						</div>
					))}
				</div>

				{/* Others store */}
				<div className="flex items-end justify-between mb-8">
					<div>
						<p className="text-xs uppercase tracking-[0.18em] font-semibold text-forest/70 mb-2">
							Local partners
						</p>
						<h2 className="font-display text-3xl sm:text-4xl font-semibold text-forest-deep">Others store</h2>
					</div>
					<button
						type="button"
						className="text-sm font-semibold text-forest hover:text-forest-deep transition-colors"
					>
						Visit stores →
					</button>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{vendors.map((vendor) => (
						<div
							key={vendor.name}
							className="relative bg-background rounded-2xl border border-border p-5 flex items-center justify-between gap-4 hover:border-forest hover:shadow-[0_8px_24px_-12px_rgba(14,59,46,0.2)] transition-all overflow-hidden"
						>
							<div className="flex items-center gap-4">
								<div className="h-12 w-12 rounded-full bg-lime/20 flex items-center justify-center text-forest-deep text-lg font-bold">
									{vendor.name.charAt(0)}
								</div>
								<div>
									<h3 className="font-display font-semibold text-forest-deep">{vendor.name}</h3>
									<p className="text-xs text-forest/70 flex items-center gap-1.5 mt-0.5">
										<span className="h-1.5 w-1.5 rounded-full bg-lime" />
										Delivery in {vendor.eta}
									</p>
								</div>
							</div>
							<div className="text-right">
								<p className="font-display text-xl font-bold text-forest-deep">${vendor.price}</p>
								{vendor.tag && (
									<span className="inline-block mt-1 text-[10px] font-semibold uppercase tracking-wider bg-forest-deep text-cream px-2 py-0.5 rounded-full">
										{vendor.tag}
									</span>
								)}
							</div>
						</div>
					))}
				</div>

				{/* Story + image */}
				<div className="mt-20 grid lg:grid-cols-2 gap-10 items-center">
					<div className="relative aspect-[4/5] lg:aspect-[5/6] rounded-3xl overflow-hidden">
						<Image
							src="/scraped-1.jpg"
							alt="Fresh organic produce flat-lay"
							fill
							sizes="(max-width: 1024px) 100vw, 50vw"
							className="object-cover"
						/>
						<div className="absolute bottom-6 left-6 right-6 flex items-center justify-between rounded-2xl bg-cream/95 backdrop-blur px-5 py-4 shadow-xl">
							<div>
								<p className="text-[10px] uppercase tracking-wider text-forest-deep/60">Our growers</p>
								<p className="text-sm font-display font-semibold text-forest-deep">
									120+ local farms partnered
								</p>
							</div>
							<div className="flex -space-x-2">
								{[0, 1, 2].map((i) => (
									<div
										key={i}
										className="h-8 w-8 rounded-full ring-2 ring-cream bg-gradient-to-br from-lime to-forest"
									/>
								))}
							</div>
						</div>
					</div>
					<div>
						<p className="text-xs uppercase tracking-[0.18em] font-semibold text-forest/70 mb-3">
							Why Your Next Store
						</p>
						<h2 className="font-display text-3xl sm:text-4xl font-semibold text-forest-deep text-balance">
							Real food, traceable from soil to your kitchen counter.
						</h2>
						<p className="mt-5 text-base text-muted-foreground leading-relaxed">
							Every item carries a name and a story. We work directly with growers, bakers, and roasters so
							you know exactly who tended your tomatoes, milled your flour, and pressed your olive oil.
						</p>
						<dl className="mt-8 grid grid-cols-2 gap-6">
							<div>
								<dt className="font-display text-3xl font-bold text-forest-deep">120+</dt>
								<dd className="text-sm text-muted-foreground mt-1">Partner farms</dd>
							</div>
							<div>
								<dt className="font-display text-3xl font-bold text-forest-deep">15 min</dt>
								<dd className="text-sm text-muted-foreground mt-1">Avg. local delivery</dd>
							</div>
							<div>
								<dt className="font-display text-3xl font-bold text-forest-deep">100%</dt>
								<dd className="text-sm text-muted-foreground mt-1">Compostable packaging</dd>
							</div>
							<div>
								<dt className="font-display text-3xl font-bold text-forest-deep">4.9★</dt>
								<dd className="text-sm text-muted-foreground mt-1">From 24k shoppers</dd>
							</div>
						</dl>
					</div>
				</div>
			</div>
		</section>
	);
}
