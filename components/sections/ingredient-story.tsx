import Image from "next/image";
import { YnsLink } from "../yns-link";

export function IngredientStory() {
	return (
		<section className="relative bg-ink text-parchment" style={{ backgroundColor: "#0e0d0b" }}>
			<div className="grid lg:grid-cols-12 gap-0">
				{/* Image side */}
				<div className="relative lg:col-span-7 aspect-[4/3] lg:aspect-auto lg:min-h-[640px]">
					<Image
						src="/scraped-1.jpg"
						alt="Microalgae suspended in laboratory liquid"
						fill
						sizes="(max-width: 1024px) 100vw, 58vw"
						className="object-cover"
					/>
					<div
						className="absolute inset-0 pointer-events-none"
						style={{
							background:
								"linear-gradient(90deg, rgba(14,13,11,0.0) 0%, rgba(14,13,11,0.0) 60%, rgba(14,13,11,0.55) 100%)",
						}}
					/>
					<div className="absolute top-6 left-6 font-mono text-[0.55rem] tracking-[0.3em] uppercase text-parchment/70">
						<div>Active 001</div>
						<div className="text-parchment/40">Algae Extract — Lat. Spirulina</div>
					</div>
					<div className="absolute bottom-6 left-6 right-6 flex items-end justify-between font-mono text-[0.55rem] tracking-[0.3em] uppercase text-parchment/55">
						<span>00:01:42 / 00:03:11</span>
						<span>F2.0 · ISO 800 · 35mm</span>
					</div>
				</div>

				{/* Text side */}
				<div className="lg:col-span-5 flex items-center px-6 sm:px-10 lg:px-14 py-16 lg:py-24">
					<div className="max-w-md">
						<p className="font-mono text-[0.6rem] tracking-[0.3em] uppercase text-sand mb-6">
							The Origin Active
						</p>
						<h2 className="font-serif text-4xl lg:text-5xl leading-[1.05] text-parchment tracking-tight">
							The first life on earth, decoded for the second skin.
						</h2>
						<p className="mt-6 text-sm font-mono leading-relaxed text-parchment/70">
							Suspended in cold-pressed glacial water and stabilised at -4°C, our proprietary microalgae
							extract carries 11 amino acids and a lipid profile that mirrors the male sebaceous gland.
						</p>
						<dl className="mt-10 space-y-4 border-t border-parchment/10 pt-6">
							{[
								{ k: "Active concentration", v: "12.4%" },
								{ k: "Strain", v: "Spirulina platensis NB-71" },
								{ k: "Source", v: "Atlantic basin, 41°N" },
								{ k: "Cold-chain", v: "Maintained −4°C" },
							].map((row) => (
								<div
									key={row.k}
									className="flex items-baseline justify-between gap-6 font-mono text-[0.7rem] tracking-[0.18em] uppercase"
								>
									<dt className="text-parchment/45">{row.k}</dt>
									<dd className="text-parchment/85 text-right">{row.v}</dd>
								</div>
							))}
						</dl>
						<div className="mt-10">
							<YnsLink
								prefetch={"eager"}
								href="/products"
								className="inline-flex items-center gap-3 font-mono text-[0.7rem] tracking-[0.3em] uppercase text-parchment hover:text-sand transition-colors"
							>
								<span className="inline-block w-6 h-px bg-parchment/60" />
								Read the protocol
							</YnsLink>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
