import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { getNavData, getPieceCount, getShelf } from "@/lib/catalog";
import { commerce, getStoreSeo } from "@/lib/commerce";
import { JsonLdScript } from "@/lib/json-ld";
import { formatMoney } from "@/lib/money";
import { displayPrice } from "@/lib/pricing";
import { getStoreConfig } from "@/lib/store-config";
import aboutPortrait from "@/public/images/pexels/look-chair-still.jpg";

// `next dev` and `next build` fail if anything on this route renders per request (AGENTS.md).
export const ensureStatic = "navigation";

export async function generateMetadata(): Promise<Metadata> {
	const { storeName, storeDescription } = await getStoreSeo();
	const description = storeDescription
		? `Learn more about ${storeName}. ${storeDescription}`
		: `Who is behind ${storeName}: how we choose every piece.`;

	return {
		title: "About",
		description,
		alternates: { canonical: "/about" },
		openGraph: { type: "website", title: "About", description, url: "/about" },
	};
}

async function getLowestPrice() {
	"use cache";
	cacheLife("minutes");
	const [config, result] = await Promise.all([
		getStoreConfig(),
		commerce.productBrowse({ active: true, limit: 100 }).catch(() => null),
	]);
	// A free item (a sample, a bundle priced at checkout) is not a meaningful "from" price.
	const prices = (result?.data ?? [])
		.flatMap((product) => product.variants)
		.map((variant) => BigInt(displayPrice(variant, config.taxBehavior)))
		.filter((price) => price > 0n);
	if (prices.length === 0) return null;
	// biome-ignore lint/complexity/useMathMinMax: prices are bigint, which Math.min rejects
	const lowest = prices.reduce((min, price) => (price < min ? price : min));
	return formatMoney({
		amount: lowest,
		currency: config.currency,
		locale: config.locale,
	});
}

const howWeWork = [
	[
		"Chosen slowly.",
		"Every piece is picked for how it looks, how it is made and how it holds up after a year, not a week.",
	],
	["Described plainly.", "Photos and details show each piece as it is, so there are no surprises."],
	["A short list.", "Fewer things, each one on purpose, so the whole shop can be browsed in one sitting."],
	["Clear at checkout.", "Delivery options and costs are shown at checkout, before you pay."],
] as const;

export default async function AboutPage() {
	"use cache";
	cacheLife("hours");

	const [nav, count, shelf, lowest] = await Promise.all([
		getNavData(),
		getPieceCount(),
		getShelf(),
		getLowestPrice(),
	]);
	const { storeName, storeDescription, pages } = nav;
	const contactHref = pages.find((page) => page.href === "/contact")?.href ?? "/faq";
	const numbers = [
		{ num: String(count), label: count === 1 ? "piece in the shop" : "pieces in the shop" },
		{ num: String(shelf.length), label: shelf.length === 1 ? "collection" : "collections" },
		...(lowest ? [{ num: lowest, label: "the lowest price" }] : []),
	];

	return (
		<>
			<JsonLdScript
				data={{
					"@context": "https://schema.org",
					"@type": "AboutPage",
					name: `About ${storeName}`,
					description: storeDescription ?? `How ${storeName} chooses every piece.`,
				}}
			/>
			<section className="mx-auto grid max-w-6xl items-center gap-10 px-5 pb-4 pt-6 sm:pb-8 md:grid-cols-[1.1fr_1fr] md:pt-12">
				<div>
					<span
						aria-hidden
						className="mb-6 inline-flex size-16 items-center justify-center bg-ink font-display text-[34px] font-medium italic text-paper"
					>
						{storeName.charAt(0).toUpperCase()}
					</span>
					<h1 className="text-[clamp(36px,5vw,60px)] font-extrabold leading-[1.02] tracking-tight">
						A small shop with long opinions.
					</h1>
					<p className="mt-5 max-w-[52ch] text-[16px] leading-relaxed text-muted-foreground">
						{storeDescription ??
							`${storeName} started with a refusal: no noise, no rush, nothing meant to be thrown away. What is left is a short list of pieces we would use ourselves, chosen slowly and meant to be kept.`}
					</p>
					<p className="mt-4 max-w-[52ch] text-[16px] leading-relaxed text-muted-foreground">
						We sell directly and describe every piece honestly, so you know what you are buying before you buy
						anything at all.
					</p>
				</div>
				<div className="relative aspect-[4/5] overflow-hidden bg-tile">
					<Image
						src={aboutPortrait}
						alt="A cane chair holding a net bag of fruit beside a linen curtain"
						fill
						priority
						placeholder="blur"
						sizes="(max-width: 768px) 100vw, 520px"
						className="object-cover"
					/>
				</div>
			</section>

			<section className="mx-auto max-w-6xl px-5">
				<dl
					className={`grid gap-4 border border-line bg-tile/60 p-4 text-center sm:gap-8 sm:p-10 ${numbers.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}
				>
					{numbers.map((n) => (
						<div key={n.label} className="flex flex-col-reverse">
							<dt className="mt-1 text-[14px] text-muted-foreground">{n.label}</dt>
							<dd className="font-display text-3xl font-bold text-brand-ink">{n.num}</dd>
						</div>
					))}
				</dl>
			</section>

			<section className="mx-auto max-w-6xl px-5 pt-4 sm:pt-8">
				<div className="grid gap-5 border border-line bg-tile/60 p-4 sm:gap-10 sm:p-10 md:grid-cols-2">
					<div>
						<p className="text-small font-medium text-brand-ink">The honest part</p>
						<h2 className="mt-3 text-[clamp(24px,3vw,32px)] font-bold leading-tight tracking-tight">
							Fewer things, chosen better.
						</h2>
						<p className="mt-4 text-body text-muted-foreground">
							A shop is a list of decisions. Ours are written down below, so you know what you are buying into
							before you buy anything at all.
						</p>
						<Link
							href="/products"
							className="mt-6 inline-block bg-brand px-6 py-3.5 text-body font-semibold text-primary-foreground hover:bg-brand-deep"
						>
							Browse the shop
						</Link>
					</div>
					<div>
						<h3 className="text-[16px] font-semibold">How we work</h3>
						<ul className="mt-4 grid gap-4 text-[14px] leading-relaxed text-muted-foreground">
							{howWeWork.map(([strong, text]) => (
								<li key={strong} className="flex gap-3">
									<span aria-hidden className="mt-1.5 size-2 shrink-0 bg-brand" />
									<span>
										<strong className="font-medium text-ink">{strong}</strong> {text}
									</span>
								</li>
							))}
						</ul>
					</div>
				</div>
			</section>

			<section className="mx-auto flex max-w-3xl flex-col items-center justify-center gap-4 px-5 py-10 text-center sm:py-14">
				<h2 className="text-2xl font-bold">Questions about a piece?</h2>
				<p className="text-body text-muted-foreground">
					{contactHref === "/contact" ? "Write to us any time." : "The answers to common questions are here."}
				</p>
				<Link
					href={contactHref}
					className="bg-brand px-6 py-3.5 text-body font-semibold text-primary-foreground hover:bg-brand-deep"
				>
					{contactHref === "/contact" ? "Contact us" : "Read the FAQ"}
				</Link>
			</section>
		</>
	);
}
