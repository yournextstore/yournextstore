import Link from "next/link";
import { ScopeCanvas } from "@/components/rack/scope";
import { getRackCatalog } from "@/lib/rack";

export async function Hero() {
	const { productCount, storeName, storeDescription, freeShipping, priceFrom } = await getRackCatalog();

	const facts = [
		{ term: "In the line", value: String(productCount), unit: productCount === 1 ? "module" : "modules" },
		...(priceFrom ? [{ term: "Starts at", value: priceFrom, unit: "" }] : []),
		...(freeShipping ? [{ term: "Free shipping", value: freeShipping, unit: "+" }] : []),
	];

	return (
		<section
			aria-labelledby="hero-title"
			className="section-x pt-[clamp(3rem,7vw,5.6rem)] pb-[clamp(3rem,6vw,5rem)]"
		>
			<div className="frame grid items-center gap-[clamp(1.6rem,4vw,3.6rem)] lg:grid-cols-[1.05fr_.95fr]">
				<div className="min-w-0">
					<p className="font-plate mb-[1.4rem] text-[0.74rem] tracking-[0.2em] text-faint uppercase">
						[ Eurorack modules · {storeName} · rack nº 12 ]
					</p>
					<h1 id="hero-title" className="title-hero mt-1 text-ink">
						<span className="rise-line">
							<span>Signal in.</span>
						</span>
						<span className="rise-line">
							<span>Sound out.</span>
						</span>
						<span className="rise-line">
							<span className="text-signal">No presets.</span>
						</span>
					</h1>
					<p className="mt-6 max-w-[47ch] text-dim">
						{storeDescription ??
							`${storeName} stocks eurorack modules, cases and cables with every spec printed — HP, power draw and stock. Build your rack module by module; every system you patch is one of one.`}
					</p>
					<div className="mt-[1.8rem] flex flex-wrap gap-[0.7rem]">
						<a href="#patch" className="btn btn-primary">
							Patch something
						</a>
						<Link href="/products" className="btn btn-ghost">
							See the line <span aria-hidden="true">→</span>
						</Link>
					</div>
					<dl className="mt-[2.4rem] flex flex-wrap gap-x-[1.8rem] gap-y-4 border-t border-line pt-[1.4rem]">
						{facts.map((fact) => (
							<div key={fact.term} className="flex flex-col gap-[0.2rem]">
								<dt className="plate-label">{fact.term}</dt>
								<dd className="font-display text-[1.45rem] text-ink">
									{fact.value}{" "}
									{fact.unit && (
										<span className="font-sans text-[0.85rem] font-medium text-dim">{fact.unit}</span>
									)}
								</dd>
							</div>
						))}
					</dl>
				</div>

				<figure className="relative m-0 min-w-0" aria-labelledby="scope-cap">
					<div className="rounded-[14px] border border-line bg-[linear-gradient(175deg,var(--rk-face),var(--rk-face-2))] px-4 pt-4 pb-[1.1rem] shadow-[var(--rk-shadow)]">
						<div className="mb-[0.7rem] flex items-center justify-between">
							<span className="font-plate text-[0.72rem] tracking-[0.18em] text-plate uppercase">
								PB-scope · shop test rig
							</span>
							<span className="flex gap-2" aria-hidden="true">
								<i className="led led--amber led--blink" />
								<i className="led led--green" />
							</span>
						</div>
						<div className="scope-screen">
							<ScopeCanvas />
						</div>
						<div className="mt-[0.9rem] flex items-center justify-between gap-4" aria-hidden="true">
							<div className="flex gap-[0.9rem]">
								<span className="knob-ui [--turn:-40deg]" />
								<span className="knob-ui [--turn:25deg]" />
								<span className="knob-ui [--turn:80deg]" />
							</div>
							<span className="font-plate text-[0.72rem] tracking-[0.18em] text-plate uppercase">
								trig · int
							</span>
						</div>
					</div>
					<figcaption
						id="scope-cap"
						className="font-plate mt-4 flex flex-wrap justify-between gap-x-4 gap-y-1 text-[0.72rem] text-faint"
					>
						<span>CH 1 — the shop's signal, resonance at noon</span>
						<span>2 V/div · 5 ms</span>
					</figcaption>
				</figure>
			</div>
		</section>
	);
}
