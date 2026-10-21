import Image from "next/image";
import { Em } from "@/components/brand/em";
import { BottleIcon, DropIcon, HourglassIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

const MATERIALS = [
	{
		src: "/images/materials/cedar.jpg",
		label: "Cedar",
		alt: "Cedar shavings and split cedar wood on a dark stone block",
		className: "lg:col-span-5",
		position: "object-[50%_60%]",
	},
	{
		src: "/images/materials/iris.jpg",
		label: "Iris",
		alt: "A purple iris flower beside dried orris roots and pale powder",
		className: "lg:col-span-5",
		position: "object-[50%_45%]",
	},
	{
		src: "/images/materials/amber.jpg",
		label: "Amber",
		alt: "Glowing pieces of golden amber resin",
		className: "sm:col-span-2 lg:col-span-4",
		position: "object-[50%_55%]",
	},
	{
		src: "/images/materials/smoke.jpg",
		label: "Smoke",
		alt: "Birch bark and a smouldering wood chip with a ribbon of smoke",
		className: "sm:col-span-2 lg:col-span-3",
		position: "object-[50%_45%]",
	},
] as const;

const STEPS = [
	{ Icon: DropIcon, title: "Notes written out", detail: "Top, heart and base on every scent" },
	{ Icon: HourglassIcon, title: "Made to unfold", detail: "Each one changes over the hours you wear it" },
	{ Icon: BottleIcon, title: "One accord, many forms", detail: "Perfume, candle and body care" },
] as const;

const tile = "relative overflow-hidden rounded-xl border border-line bg-surface";

function Material({ item, sizes }: { item: (typeof MATERIALS)[number]; sizes: string }) {
	return (
		<figure className={cn(tile, "group min-h-[15rem]", item.className)}>
			<Image
				src={item.src}
				alt={item.alt}
				fill
				sizes={sizes}
				className={cn(
					"object-cover transition-transform duration-700 ease-[var(--ease-out-quart)] group-hover:scale-[1.04]",
					item.position,
				)}
			/>
			<figcaption className="absolute bottom-3 left-3 rounded-full bg-page/70 px-3.5 py-1.5 text-sm text-ink backdrop-blur-[10px]">
				{item.label}
			</figcaption>
		</figure>
	);
}

/** The house, as a bento: a drape-backed statement, raw-material close-ups and how the scents are made. */
export function Story({ description }: { description: string }) {
	return (
		<section id="craft" className="py-24 md:py-32">
			<div className="container-page">
				<div className="grid gap-x-5 gap-y-6 sm:auto-rows-[minmax(15rem,auto)] sm:grid-cols-2 lg:grid-cols-12 lg:grid-rows-[15rem_15rem_16rem]">
					<div className={cn(tile, "flex min-h-[26rem] items-end sm:col-span-2 lg:col-span-7 lg:row-span-2")}>
						<Image
							src="/images/drape-backdrop.webp"
							alt=""
							fill
							sizes="(min-width: 1024px) 58vw, 100vw"
							className="object-cover"
						/>
						<div
							aria-hidden="true"
							className="absolute inset-0 bg-gradient-to-t from-page/90 via-page/45 to-page/10"
						/>
						<div className="relative max-w-xl p-7 md:p-10">
							<h2 className="font-display text-title-md text-balance md:text-title-xl">
								Composed slowly, <Em>worn closely</Em>
							</h2>
							<p className="mt-5 max-w-[52ch] text-lead text-ink/80">
								{description ||
									"A handful of warm accords, each built around one material and written out note by note, so you know what you are wearing before you wear it."}
							</p>
						</div>
					</div>
					{MATERIALS.slice(0, 2).map((item) => (
						<Material key={item.src} item={item} sizes="(min-width: 1024px) 40vw, 100vw" />
					))}
					<div className="glass flex flex-col justify-center gap-5 p-7 sm:col-span-2 lg:col-span-5">
						<h3 className="font-display text-title-sm">How we compose</h3>
						<ul className="space-y-4">
							{STEPS.map(({ Icon, title, detail }) => (
								<li key={title} className="flex items-center gap-4">
									<span className="grid size-11 shrink-0 place-items-center rounded-full border border-ink/20 text-gold">
										<Icon />
									</span>
									<div>
										<p className="text-ink">{title}</p>
										<p className="text-sm text-muted-foreground">{detail}</p>
									</div>
								</li>
							))}
						</ul>
					</div>
					{MATERIALS.slice(2).map((item) => (
						<Material key={item.src} item={item} sizes="(min-width: 1024px) 33vw, 100vw" />
					))}
				</div>
			</div>
		</section>
	);
}
