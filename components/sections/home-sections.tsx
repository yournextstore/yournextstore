import Image from "next/image";
import Link from "next/link";
import type { ShelfCard } from "@/lib/catalog";
import { cn } from "@/lib/utils";

/** Full-bleed portrait with the centred white statement, the indigo CTA and the barred link. */
export function Hero({ image }: { image: string }) {
	return (
		<section className="relative flex h-[33.5rem] items-center justify-center overflow-hidden bg-[#3a3045] lg:h-[37.875rem]">
			<Image src={image} alt="" fill priority sizes="100vw" className="object-cover" />
			{/* A soft indigo veil keeps the white type legible over the golden-hour photograph. */}
			<div aria-hidden className="absolute inset-0 bg-ink/35" />
			<div className="relative mx-auto flex max-w-[50rem] flex-col items-center px-6 text-center">
				<h1 className="text-title font-semibold text-white [text-shadow:0_1px_12px_rgb(29_10_67/0.25)] lg:text-display">
					No skin is the same.
				</h1>
				<p className="mt-4 text-lede font-semibold text-white [text-shadow:0_1px_12px_rgb(29_10_67/0.3)] lg:mt-3">
					Gentle cleansers, serums and balms in short routines. Find the few your skin actually needs.
				</p>
				<Link href="/products" className="btn-ink mt-10 w-[15.5rem] lg:mt-8">
					Shop the range
				</Link>
				<Link href="/about" className="link-bar mt-8 text-white">
					Our story
				</Link>
			</div>
		</section>
	);
}

/** The three portrait cards: a swipe rail on phones, three columns from lg. */
export function Shelf({ cards, className }: { cards: ShelfCard[]; className?: string }) {
	return (
		<section className={cn("shell py-10 lg:py-[4.5rem]", className)}>
			<h2 className="sr-only">Shop by collection</h2>
			<ul className="-mx-6 flex snap-x snap-mandatory scroll-px-6 gap-6 overflow-x-auto px-6 pb-2 lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-8 lg:overflow-visible lg:px-0 lg:pb-0">
				{cards.map((card) => {
					return (
						<li
							key={card.href}
							className="w-[54vw] max-w-[18rem] shrink-0 snap-start lg:w-auto lg:max-w-none"
						>
							<Link href={card.href} className="group block">
								<div className="relative aspect-[625/824] overflow-hidden rounded-image bg-sand">
									<Image
										src={card.image}
										alt=""
										fill
										sizes="(max-width: 1024px) 54vw, 336px"
										className="object-cover transition-transform duration-500 group-hover:scale-105"
									/>
								</div>
								<h3 className="mt-2 text-label font-semibold text-ink lg:mt-6">{card.title}</h3>
								<p className="mt-2 hidden text-copy text-plum lg:block">{card.description}</p>
							</Link>
						</li>
					);
				})}
			</ul>
		</section>
	);
}

/** Sand band with the two-weight statement. */
export function Statement() {
	return (
		<section className="bg-sand">
			<div className="shell py-10 lg:py-14">
				<p className="max-w-[40rem] text-[1.5rem] leading-snug text-ink lg:text-title">
					Different skin, different needs.{" "}
					<strong className="font-semibold lg:block">Find what yours needs.</strong>
				</p>
			</div>
		</section>
	);
}

/** Store photograph left, statement and the full-width indigo button right. */
export function Caring({ image }: { image: string }) {
	return (
		<section className="shell py-14">
			<div className="grid grid-cols-1 items-center gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,0.75fr)] lg:gap-20">
				<div className="relative aspect-[572/714] w-full overflow-hidden rounded-image bg-sand">
					<Image src={image} alt="" fill sizes="(max-width: 768px) 100vw, 536px" className="object-cover" />
				</div>
				<div>
					<h2 className="text-title font-semibold text-ink lg:text-display">Care that takes a minute</h2>
					<p className="mt-6 text-lede text-ink">
						A cleanser, a serum and a moisturiser go a long way. Every product in the range does one job well,
						with clear ingredients and simple steps you can keep up morning and night.
					</p>
					<Link href="/about" className="btn-ink mt-8 w-full">
						Learn more
					</Link>
				</div>
			</div>
		</section>
	);
}

const PROMISES = [
	{
		icon: "/images/icon-curated.svg",
		title: "Thoughtfully chosen",
		note: "A focused range",
		body: "A short range where every product has one clear job, so building a routine stays easy.",
		footer: "Fewer steps, better habits",
	},
	{
		icon: "/images/icon-plant.svg",
		title: "Made to be used",
		note: "Gentle by default",
		body: "Soft textures and mild formulas, with fragrance-free options for skin that reacts easily.",
		footer: "Every day",
	},
	{
		icon: "/images/icon-tested.svg",
		title: "Easy to love",
		note: "Used to the last drop",
		body: "Products you reach for every morning and night, so each one earns its place on the shelf.",
		footer: "Clear ingredients",
	},
] as const;

/**
 * Horizon's "Loved by them" testimonial band, re-cut for stores without reviews: the same white
 * cards on sand, carrying the shop's promises instead of quotes nobody wrote.
 */
export function Promises() {
	return (
		<section className="bg-sand py-14">
			<div className="mx-auto max-w-[72rem] px-6">
				<h2 className="text-center text-title font-semibold text-ink lg:text-display">
					Made for real routines
				</h2>
				<ul className="-mx-6 mt-8 flex snap-x snap-mandatory scroll-px-6 gap-4 overflow-x-auto px-6 pb-4 md:mx-0 md:grid md:grid-cols-3 md:gap-8 md:overflow-visible md:px-0">
					{PROMISES.map((promise) => (
						<li
							key={promise.title}
							className="flex w-[80vw] max-w-[22rem] shrink-0 snap-start flex-col rounded-image bg-white p-6 shadow-soft md:w-auto md:max-w-none"
						>
							<div className="flex items-center gap-4">
								<span className="flex size-[4.5rem] shrink-0 items-center justify-center rounded-lg bg-butter">
									<Image src={promise.icon} alt="" width={52} height={52} />
								</span>
								<div className="min-w-0">
									<h3 className="caps text-copy font-semibold text-ink lg:text-base">{promise.title}</h3>
									<p className="text-fine text-plum">{promise.note}</p>
								</div>
							</div>
							<p className="mt-4 flex-1 text-copy text-plum">{promise.body}</p>
							<p className="mt-4 text-fine text-plum">{promise.footer}</p>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}
