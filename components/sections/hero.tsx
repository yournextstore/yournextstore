import Image from "next/image";
import Link from "next/link";
import { Odometer } from "@/components/brew/odometer";
import { PressureGauge } from "@/components/brew/pressure-gauge";
import { formatFromPrice, getCatalog } from "@/lib/brew";
import { HERO_PHOTO, hasMembers } from "@/lib/editorial";

/** Splits "4,90 zł" / "$12.00" into the rolling number and its fixed unit, like "93.5 °C". */
function splitUnit(money: string) {
	const match = money.match(/^([^\d]*)([\d.,\s ]*\d)(.*)$/);
	if (!match) return { value: money, unit: "" };
	const [, pre = "", num = "", post = ""] = match;
	return { value: `${pre}${num}`.trim(), unit: post.trim() };
}

export async function Hero() {
	const { products, productCount, collections, freeShipping } = await getCatalog();
	// $0 variants (an unpriced set) would read as the entry price.
	const lowest = await formatFromPrice(
		products
			.flatMap((p) => p.variants)
			.filter((v) => Number(v.price) > 0)
			.slice(0, 200),
	);
	const from = lowest?.split(" – ")[0] ?? null;

	const stats = [
		{ value: String(productCount), unit: "", label: "On the counter" },
		...(from ? [{ ...splitUnit(from), label: "Entry price" }] : []),
		...(freeShipping ? [{ ...splitUnit(freeShipping), label: "Free shipping over" }] : []),
		...(collections.filter(hasMembers).length > 0
			? [{ value: String(collections.filter(hasMembers).length), unit: "", label: "Collections" }]
			: []),
	].slice(0, 4);

	return (
		<section
			data-hero
			className="section-x relative isolate flex min-h-svh flex-col justify-center overflow-hidden pt-[clamp(120px,20vh,190px)] pb-[clamp(28px,5vh,52px)]"
		>
			<Image
				src={HERO_PHOTO.src}
				alt={HERO_PHOTO.alt}
				fill
				priority
				sizes="100vw"
				className="-z-[2] bg-panel object-cover"
			/>
			<div aria-hidden="true" className="hero-scrim pointer-events-none absolute inset-0 -z-[1]" />
			<div className="frame grid flex-1 items-center gap-9 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,.95fr)] lg:gap-[clamp(28px,5vw,72px)]">
				<div className="max-w-[34rem]">
					<p className="eyebrow mb-[1.4rem]">Precision espresso equipment</p>
					<h1 className="title-hero mb-[1.4rem] text-ink">
						Nine bars. <em>Held like a note.</em>
					</h1>
					<p className="mb-8 max-w-[55ch] text-[clamp(1rem,1.3vw,1.14rem)] text-dim">
						Machines, grinders and barista tools for the home counter, each listed with its pressure,
						temperature and dose, so you know how the next shot will run before it lands in the cup.
					</p>
					<div className="flex flex-wrap gap-3.5">
						<Link href="/products" className="btn btn-primary">
							Explore the machines
						</Link>
						<a href="#process" className="btn btn-ghost">
							How it works <span aria-hidden="true">&darr;</span>
						</a>
					</div>
				</div>
				<PressureGauge />
			</div>

			{stats.length > 0 && (
				<ul
					aria-label="The shop at a glance"
					className="frame relative mt-[clamp(28px,5vh,56px)] grid grid-cols-2 border-t border-line md:grid-cols-4"
				>
					{stats.map((stat, i) => (
						<li
							key={stat.label}
							className={
								i === 0
									? "pt-[18px] pb-1 md:pt-[22px]"
									: `border-line pt-[18px] pb-1 md:border-l md:pt-[22px] md:pl-[22px] ${i % 2 === 1 ? "pl-[22px]" : ""} ${i >= 2 ? "border-t md:border-t-0" : ""}`
							}
						>
							<Odometer
								value={stat.value}
								className="font-readout text-[clamp(1.8rem,3.6vw,2.7rem)] leading-none font-medium text-ink"
							/>
							{stat.unit && <span className="font-readout ml-[5px] text-[0.9rem] text-dim">{stat.unit}</span>}
							<span className="font-readout mt-3 block text-[0.7rem] tracking-[0.08em] text-faint uppercase">
								{stat.label}
							</span>
						</li>
					))}
				</ul>
			)}
		</section>
	);
}
