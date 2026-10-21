import Image from "next/image";
import Link from "next/link";
import { Scramble } from "@/components/field/scramble";
import { WeatherCanvas } from "@/components/field/weather-canvas";
import { formatFromPrice, GRID_REFS, getFieldCatalog } from "@/lib/field";

export async function Hero() {
	const { products, productCount, collections, freeShipping } = await getFieldCatalog();
	const lowest = await formatFromPrice(
		products
			.flatMap((p) => p.variants)
			.filter((v) => Number(v.price) > 0)
			.slice(0, 200),
	);
	const from = lowest?.split(" – ")[0] ?? null;

	const stats = [
		{
			value: String(productCount),
			label: productCount === 1 ? "item in the kit list" : "items in the kit list",
		},
		...(from ? [{ value: from, label: "entry price" }] : []),
		...(freeShipping ? [{ value: freeShipping, label: "free-shipping line" }] : []),
		...(collections.length > 0
			? [
					{
						value: String(collections.length),
						label: collections.length === 1 ? "collection" : "collections",
					},
				]
			: []),
	];

	return (
		<section
			data-hero
			className="section-x relative flex min-h-svh items-end overflow-hidden pt-[clamp(120px,18vh,180px)] pb-[clamp(56px,10vh,96px)]"
		>
			<div className="absolute inset-0 z-0 bg-panel">
				<Image
					src="/images/pexels/hero-ridge-dusk.jpg"
					alt="An orange tent glowing on a high rocky ridge under low storm cloud at dusk."
					fill
					priority
					sizes="100vw"
					className="object-cover saturate-[.85] contrast-[1.02]"
				/>
				<WeatherCanvas />
				<div aria-hidden="true" className="hero-scrim pointer-events-none absolute inset-0 z-[2]" />
			</div>
			<div className="frame relative z-[3]">
				<p className="eyebrow mb-[1.4rem]">
					<span className="grid-ref" aria-hidden="true">
						[ {GRID_REFS[0]} ]
					</span>
					<Scramble text="EXPEDITION & CAMPING GEAR" />
				</p>
				<h1 className="title-hero mb-[1.6rem] text-ink [text-shadow:0_2px_40px_rgba(10,13,12,.6)]">
					Made for the
					<br />
					long way round.
				</h1>
				<p className="mb-[2.2rem] max-w-[55ch] text-[clamp(1.02rem,1.5vw,1.2rem)] text-ink/90 [text-shadow:0_1px_16px_rgba(10,13,12,.7)]">
					Tents, sleeping bags, packs and camp kitchen kit for nights above the tree line and trips that run
					past the last road. Plain specs, rated for the weather, nothing you won't carry.
				</p>
				<div className="mb-[2.6rem] flex flex-wrap gap-3.5">
					<Link href="/products" className="btn btn-primary">
						Shop the range
					</Link>
					<a href="#terrain" className="btn btn-ghost">
						Read the forecast <span aria-hidden="true">↓</span>
					</a>
				</div>
				<ul
					aria-label="The range at a glance"
					className="font-field flex flex-wrap gap-x-[clamp(16px,3vw,38px)] gap-y-3 text-[0.8rem] tracking-[0.02em] text-dim"
				>
					{stats.map((stat) => (
						<li key={stat.label} className="relative pl-4">
							<span
								aria-hidden="true"
								className="absolute top-[.55em] left-0 h-1.5 w-1.5 bg-signal opacity-85 [clip-path:polygon(50%_0,100%_100%,0_100%)]"
							/>
							<b className="text-[0.94rem] font-bold text-ink">
								<Scramble text={stat.value} />
							</b>{" "}
							{stat.label}
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}
