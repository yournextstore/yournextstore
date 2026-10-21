import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { getHomeData } from "@/lib/catalog";
import { commerce, getStoreSeo, meGetCached } from "@/lib/commerce";
import { ABOUT_IMAGE } from "@/lib/editorial";
import { JsonLdScript } from "@/lib/json-ld";
import { YNSMedia } from "@/lib/yns-media";

// `next dev` and `next build` fail if anything on this route renders per request (AGENTS.md).
export const ensureStatic = "navigation";

export async function generateMetadata(): Promise<Metadata> {
	const { storeName, storeDescription } = await getStoreSeo();
	const description = storeDescription
		? `Learn more about ${storeName}. ${storeDescription}`
		: `Who is behind ${storeName}, and how we choose what we sell.`;

	return {
		title: "About",
		description,
		alternates: { canonical: "/about" },
		openGraph: {
			type: "website",
			title: "About",
			description,
			url: "/about",
		},
	};
}

async function getAboutData() {
	"use cache";
	cacheLife("hours");

	const [me, home, products] = await Promise.all([
		meGetCached().catch(() => null),
		getHomeData(),
		commerce.productBrowse({ active: true, limit: 1 }).catch(() => null),
	]);
	const collectionTiles = home.tiles.filter((tile) => tile.href !== "/products");
	return {
		storeName: home.storeName,
		storeDescription: me?.store.settings?.storeDescription || null,
		contactFormEnabled: me?.store.settings?.enabledTools?.contactForm ?? false,
		productCount: products?.meta.count ?? 0,
		collectionCount: collectionTiles.length,
	};
}

const howWeWork = [
	{
		title: "Fewer, better things.",
		text: "We keep the range small enough to know every coffee and device well, and leave out what we would not brew with ourselves.",
	},
	{
		title: "Honest details.",
		text: "Clear descriptions, real prices and stock shown as it is, so what you order is what you expected.",
	},
	{
		title: "Design that lasts.",
		text: "Quiet shapes and good materials over trends: gear chosen to sit on the counter for years.",
	},
	{
		title: "A quick checkout.",
		text: "Card and wallet payments in one secure step, with delivery options and costs shown before you pay.",
	},
];

export default async function AboutPage() {
	const { storeName, storeDescription, contactFormEnabled, productCount, collectionCount } =
		await getAboutData();

	const aboutJsonLd = {
		"@context": "https://schema.org",
		"@type": "AboutPage",
		name: `About ${storeName}`,
		description: storeDescription ?? `About ${storeName}.`,
	};

	const numbers = [
		{ num: String(productCount), label: productCount === 1 ? "product in the shop" : "products in the shop" },
		{ num: String(collectionCount), label: collectionCount === 1 ? "category" : "categories" },
	];
	const blackButton =
		"inline-block border border-white/40 bg-black px-6 py-3.5 text-[13px] font-semibold uppercase tracking-[0.14em] text-white transition hover:border-white";

	return (
		// White content page with black elements; the dark card below inverts back.
		<div className="light-section pb-4">
			<JsonLdScript data={aboutJsonLd} />
			<section className="shell grid items-center gap-10 py-10 md:grid-cols-[1.1fr_1fr] md:py-16">
				<div>
					<span
						aria-hidden
						className="mb-6 flex h-14 w-14 items-center justify-center bg-[#0a0a0a] text-[30px] font-bold text-white"
					>
						{storeName.charAt(0).toUpperCase()}
					</span>
					<h1 className="font-display text-[clamp(26px,5vw,60px)] font-semibold uppercase leading-[1.05] tracking-[0.04em]">
						Chosen in the quiet hours.
					</h1>
					<p className="mt-5 max-w-[52ch] text-[16px] leading-relaxed text-muted-foreground">
						{storeName} started as a short list of things we kept reaching for: well made, easy to live with
						and good to look at. The list grew into a shop.
					</p>
					<p className="mt-4 max-w-[52ch] text-[16px] leading-relaxed text-muted-foreground">
						We still choose every piece the same way, take our time over the details and keep the range small
						enough to know it well.
					</p>
				</div>
				<div className="relative aspect-4/5 overflow-hidden bg-card">
					<YNSMedia
						src={ABOUT_IMAGE}
						alt=""
						fill
						priority
						sizes="(max-width: 768px) 100vw, 520px"
						className="object-cover"
					/>
				</div>
			</section>

			<section aria-label="In numbers" className="shell">
				<div className="grid grid-cols-2 gap-4 border border-border bg-card/60 p-4 text-center sm:grid-cols-2 sm:gap-8 sm:p-10">
					{numbers.map((n) => (
						<div key={n.label}>
							<p className="font-display text-3xl font-bold">{n.num}</p>
							<p className="mt-1 text-[14px] text-muted-foreground">{n.label}</p>
						</div>
					))}
				</div>
			</section>

			{/* Dark card: black block with white type inside the light page (the original's dark-card). */}
			<section className="shell pt-4 sm:pt-8">
				<div className="dark-card grid gap-5 bg-[#0a0a0a] p-6 text-white sm:gap-10 sm:p-10 md:grid-cols-2">
					<div>
						<p className="text-[12px] uppercase tracking-[0.24em] text-white/70">The honest part</p>
						<h2 className="mt-3 font-display text-[clamp(22px,3vw,32px)] font-semibold uppercase leading-tight tracking-[0.04em]">
							Made slowly, on purpose.
						</h2>
						<p className="mt-4 text-[15px] leading-relaxed text-white/75">
							{storeDescription ??
								"Nothing here is rushed. We would rather leave a gap on the shelf than fill it with something we do not believe in."}
						</p>
						<Link href="/products" className={`mt-6 ${blackButton}`}>
							Shop the collection
						</Link>
					</div>
					<div>
						<h3 className="text-[16px] font-semibold uppercase tracking-[0.14em]">How we work</h3>
						<ul className="mt-4 grid gap-4 text-[14px] leading-relaxed text-white/75">
							{howWeWork.map((item) => (
								<li key={item.title} className="flex gap-3">
									<span aria-hidden className="mt-1.5 h-2 w-2 shrink-0 bg-white" />
									<span>
										<strong className="font-medium text-white">{item.title}</strong> {item.text}
									</span>
								</li>
							))}
						</ul>
					</div>
				</div>
			</section>

			<section className="mx-auto flex max-w-3xl flex-col items-center justify-center gap-4 px-5 py-10 text-center sm:py-14">
				<h2 className="font-display text-2xl font-bold uppercase tracking-[0.04em]">
					Questions before you order?
				</h2>
				<p className="text-[15px] text-muted-foreground">
					{contactFormEnabled
						? "Write to us through the contact form."
						: "Most answers are already on our FAQ page, from payment to delivery."}
				</p>
				<Link href={contactFormEnabled ? "/contact" : "/faq"} className={blackButton}>
					{contactFormEnabled ? "Contact us" : "Read the FAQ"}
				</Link>
			</section>
		</div>
	);
}
