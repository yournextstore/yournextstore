import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { Shelf } from "@/components/shelf";
import { editorial, getHomeData } from "@/lib/catalog";
import { cn } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";

const outlineCta =
	"inline-block rounded-md border-2 border-white px-7 py-3 text-[14px] font-bold uppercase tracking-wide text-white transition hover:bg-white hover:text-on-brass";
const textCta =
	"inline-block px-2 py-3 text-[14px] font-bold uppercase tracking-wide text-white/85 underline decoration-white/40 underline-offset-4 transition hover:text-white";

/** Centred uppercase heading over a full-bleed photograph; the tiles below overlap its foot. */
export function Hero() {
	return (
		<section data-hero className="relative h-[68vh] min-h-[460px]">
			<Image src={editorial.hero} alt="" fill priority sizes="100vw" className="object-cover" />
			<div aria-hidden className="absolute inset-0 bg-black/55" />
			<div className="absolute inset-0 flex items-center justify-center px-5 pt-16 pb-24">
				<div className="max-w-3xl text-center text-white">
					<h1 className="font-display text-[clamp(38px,6vw,72px)] font-black uppercase leading-[1.02] tracking-tight">
						Plant-made. Kept simple.
					</h1>
					<p className="mx-auto mt-5 max-w-[54ch] text-[16px] leading-relaxed text-white/85">
						Cleansers, oils, creams and bath goods blended in small batches from plant oils, herbs and clays —
						a short routine, plainly described.
					</p>
					<div className="mt-8 flex flex-wrap items-center justify-center gap-4">
						<Link href="/products" className={outlineCta}>
							Shop the apothecary
						</Link>
						<Link href="/about" className={textCta}>
							Our story
						</Link>
					</div>
				</div>
			</div>
		</section>
	);
}

/** Staggered 2-1-2-1 tiles pulled up over the hero: collections first, then "shop all". */
export async function CollectionTiles() {
	const { tiles } = await getHomeData();
	const isCentered = (i: number) => i % 3 === 2;

	return (
		<section aria-label="Collections" className="shell relative z-10 -mt-24">
			<div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
				{tiles.map((tile, i) => (
					<Link
						key={tile.href}
						href={tile.href}
						className={cn(
							"group relative block overflow-hidden rounded-xl bg-card",
							isCentered(i) && "sm:col-span-2 sm:mx-auto sm:w-[calc(50%-10px)]",
						)}
					>
						<div className="relative aspect-video">
							{tile.image && (
								<YNSMedia
									src={tile.image}
									alt=""
									fill
									priority={i < 2}
									sizes="(max-width: 640px) 100vw, 560px"
									className="object-cover transition duration-500 group-hover:scale-[1.04]"
								/>
							)}
						</div>
						<div
							aria-hidden
							className="absolute inset-0 bg-linear-to-t from-black/80 via-black/25 to-black/10"
						/>
						<div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5 text-white">
							<div className="min-w-0">
								<h2 className="font-display text-[19px] font-extrabold uppercase tracking-wide">
									{tile.title}
								</h2>
								{tile.description && (
									<p className="mt-1 line-clamp-2 max-w-[40ch] text-[13px] text-white/80">
										{tile.description}
									</p>
								)}
							</div>
							<span
								aria-hidden
								className="mb-1 shrink-0 text-[18px] text-white/75 transition group-hover:translate-x-1 group-hover:text-brass"
							>
								›
							</span>
						</div>
					</Link>
				))}
			</div>
		</section>
	);
}

/** One slider per shelf, with an outlined "all" button under it. */
export async function Shelves() {
	const { shelves } = await getHomeData();

	return shelves.map((shelf) => (
		<section key={shelf.title} className="shell pt-14">
			<h2 className="font-display text-[26px] font-extrabold uppercase tracking-wide">{shelf.title}</h2>
			<Shelf label={shelf.title}>
				{shelf.products.map((product) => (
					<div key={product.id} className="w-[260px] shrink-0 snap-start sm:w-[300px]">
						<ProductCard product={product} kicker={shelf.kicker} />
					</div>
				))}
			</Shelf>
			<div className="mt-6 text-center">
				<Link
					href={shelf.href}
					className="inline-block rounded-md border border-border px-7 py-3 text-[14px] font-semibold transition hover:border-brass hover:text-brass"
				>
					{shelf.allLabel}
				</Link>
			</div>
		</section>
	));
}

const services = [
	{
		title: "Clear delivery",
		text: "Delivery options and costs for your address are shown at checkout, before you pay.",
		paths: ["M1 5h14v12H1z", "M15 9h4l3 3v5h-7z", "M6 19a1.6 1.6 0 1 0 0-.01", "M18 19a1.6 1.6 0 1 0 0-.01"],
	},
	{
		title: "Small batches",
		text: "Each cream, oil and balm is blended in short runs, with every ingredient listed on the page.",
		paths: ["M12 22c-4.4 0-8-3.6-8-8 0-5 8-12 8-12s8 7 8 12c0 4.4-3.6 8-8 8z", "M12 22v-7"],
	},
	{
		title: "Secure payment",
		text: "Card and wallet payments, encrypted end to end at checkout.",
		paths: ["M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5z"],
	},
	{
		title: "Here to help",
		text: "A question before or after you order? Send us a message from the contact page.",
		paths: ["M21 12a8 8 0 0 1-8 8H4l1.5-3A8 8 0 1 1 21 12z"],
	},
];

/** Fixed white band: icon larger than the title, vertical separators on desktop. */
export function Services() {
	return (
		<section aria-label="Why shop with us" className="mt-16 bg-white text-[#120d0a]">
			<div className="mx-auto grid max-w-6xl grid-cols-1 gap-y-8 px-5 py-10 sm:grid-cols-2 sm:py-12 lg:grid-cols-4 lg:divide-x lg:divide-[#e5ddd0]">
				{services.map((service) => (
					<div key={service.title} className="lg:px-7 lg:first:pl-0 lg:last:pr-0">
						<div className="flex items-center gap-3">
							<svg
								aria-hidden
								width="38"
								height="38"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="1.5"
								strokeLinecap="round"
								strokeLinejoin="round"
								className="shrink-0 text-[#93842f]"
							>
								{service.paths.map((d) => (
									<path key={d} d={d} />
								))}
							</svg>
							<h2 className="text-[15px] font-extrabold uppercase tracking-wide">{service.title}</h2>
						</div>
						<p className="mt-3 text-[14px] leading-relaxed text-[#5c534a]">{service.text}</p>
					</div>
				))}
			</div>
		</section>
	);
}

/** Editorial banner: photograph, white text on the left, outline CTA. */
export async function Colophon() {
	const { storeName } = await getHomeData();

	return (
		<section className="relative overflow-hidden">
			<Image src={editorial.banner} alt="" fill sizes="100vw" className="object-cover" />
			<div aria-hidden className="absolute inset-0 bg-black/60" />
			<div className="relative mx-auto max-w-6xl px-5 py-20 md:py-28">
				<div className="max-w-xl text-white">
					<p className="text-[13px] font-medium text-white/80">
						{storeName} · botanical skincare in small batches
					</p>
					<h2 className="mt-3 text-balance font-display text-[clamp(26px,3.5vw,40px)] font-black uppercase leading-tight tracking-tight">
						Blended slowly. Worth the wait.
					</h2>
					<p className="mt-4 text-[15px] leading-relaxed text-white/85">
						Every jar on these shelves starts as a few plant oils, herbs and clays on our bench. Read what
						goes in, pick what suits your skin — checkout takes a minute.
					</p>
					<div className="mt-7 flex flex-wrap gap-3">
						<Link href="/about" className={outlineCta}>
							Read our story
						</Link>
						<Link href="/products" className={cn(textCta, "px-7")}>
							Shop all
						</Link>
					</div>
				</div>
			</div>
		</section>
	);
}
