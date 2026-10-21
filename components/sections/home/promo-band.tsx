import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { getFeaturedProduct } from "@/lib/catalog";
import { YNSMedia } from "@/lib/yns-media";

/** "PREMIUM ISOLATE": one product on a blue band, its name split navy / sky, store copy and a CTA. */
export async function PromoBand() {
	const featured = await getFeaturedProduct();
	if (!featured) return null;
	const { product, price } = featured;
	const words = product.name.trim().split(/\s+/);
	const last = words.pop() ?? product.name;
	const first = words.join(" ");
	const image = product.images[0];

	return (
		<section
			aria-labelledby="promo-band"
			className="relative overflow-hidden bg-[linear-gradient(120deg,#2f5f97_0%,#3d71aa_48%,#0b2f63_100%)]"
		>
			{/* Faded oversized initial standing in for the original's athlete silhouette. */}
			<span
				aria-hidden="true"
				className="pointer-events-none absolute -top-16 right-[4%] select-none font-anton text-[26rem] leading-none text-white/[0.06] lg:text-[34rem]"
			>
				{last.charAt(0).toUpperCase()}
			</span>
			<div className="relative mx-auto grid max-w-6xl items-center gap-10 px-6 py-16 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:py-24">
				<Link
					href={`/product/${product.slug}`}
					tabIndex={-1}
					aria-hidden="true"
					className="relative mx-auto block aspect-square w-60 -rotate-3 overflow-hidden rounded-2xl bg-tile shadow-[0_24px_48px_rgb(2_20_50/0.45)] transition-transform hover:rotate-0 sm:w-72"
				>
					{image && <YNSMedia src={image} alt="" fill sizes="288px" className="object-cover" />}
				</Link>
				<div className="text-center md:text-right">
					<h2
						id="promo-band"
						className="font-montserrat text-[2.75rem] leading-[0.95] font-black tracking-[-0.03em] uppercase sm:text-6xl lg:text-[4.5rem]"
					>
						{first && <span className="text-navy">{first} </span>}
						<span className="text-sky">{last}</span>
					</h2>
					{product.summary && (
						<p className="mt-6 ml-auto max-w-md text-base leading-relaxed text-page md:text-lg">
							{product.summary}
						</p>
					)}
					<div className="mt-8 flex flex-wrap items-center justify-center gap-5 md:justify-end">
						<span className="font-montserrat text-2xl font-bold text-page">{price}</span>
						<Link
							href={`/product/${product.slug}`}
							className="inline-flex h-12 items-center gap-3 rounded-full bg-page px-7 text-sm font-bold tracking-wider text-main uppercase transition hover:scale-105"
						>
							Shop now
							<ArrowRight className="h-4 w-4" aria-hidden="true" />
							<span className="sr-only">: {product.name}</span>
						</Link>
					</div>
				</div>
			</div>
		</section>
	);
}
