import Image from "next/image";
import { YnsLink } from "../yns-link";

const tiers = [
	{ size: "6-Pack", price: "$18", per: "$3.00 / bar", popular: false },
	{ size: "12-Pack", price: "$32", per: "$2.67 / bar", popular: true },
	{ size: "24-Pack", price: "$58", per: "$2.42 / bar", popular: false },
];

export function Bundle() {
	return (
		<section className="bg-cocoa border-y border-cream/5">
			<div className="max-w-screen-2xl mx-auto px-4 sm:px-8 py-24 sm:py-32">
				<div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
					<div>
						<p className="font-display tracking-[0.32em] text-[11px] text-bronze-light mb-6">
							SUBSCRIBE + SAVE 20%
						</p>
						<h2 className="font-display text-5xl sm:text-6xl lg:text-7xl text-cream leading-[0.9] mb-6">
							Build your
							<br />
							own stack.
						</h2>
						<p className="text-cream/70 text-lg leading-relaxed max-w-md mb-10">
							Mix any flavors. Ship every 2, 4, or 8 weeks. Cancel whenever — no scripts, no haggling.
						</p>

						<div className="space-y-3 max-w-md mb-10">
							{tiers.map((tier) => (
								<div
									key={tier.size}
									className={`flex items-center justify-between p-5 border ${tier.popular ? "border-bronze bg-bronze/5" : "border-cream/10"} transition-colors hover:border-bronze-light`}
								>
									<div>
										<p className="font-display text-2xl text-cream tracking-tight">{tier.size}</p>
										<p className="text-cream/50 text-xs uppercase tracking-widest mt-1">{tier.per}</p>
									</div>
									<div className="text-right">
										<p className="font-display text-3xl text-cream">{tier.price}</p>
										{tier.popular && (
											<p className="font-display text-[10px] tracking-[0.18em] text-bronze-light mt-1">
												BEST VALUE
											</p>
										)}
									</div>
								</div>
							))}
						</div>

						<YnsLink
							prefetch={"eager"}
							href="/products"
							className="inline-flex items-center justify-center h-12 px-10 bg-bronze text-espresso font-display tracking-[0.18em] text-sm hover:bg-bronze-light transition-colors"
						>
							START YOUR STACK →
						</YnsLink>
					</div>

					<div className="relative aspect-square">
						<Image
							src="/scraped-5.jpg"
							alt="Bundle of bars"
							fill
							sizes="(max-width: 1024px) 100vw, 50vw"
							className="object-cover"
						/>
						<div className="absolute inset-0 bg-linear-to-l from-transparent via-transparent to-cocoa/40 pointer-events-none" />
					</div>
				</div>
			</div>
		</section>
	);
}
