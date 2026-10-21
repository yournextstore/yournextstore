import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { editorial, getHomeData } from "@/lib/catalog";
import { commerce, getStoreSeo, meGetCached } from "@/lib/commerce";
import { JsonLdScript } from "@/lib/json-ld";
import { YNSMedia } from "@/lib/yns-media";

// `next dev` and `next build` fail if anything on this route renders per request (AGENTS.md).
export const ensureStatic = "navigation";

export async function generateMetadata(): Promise<Metadata> {
	const { storeName, storeDescription } = await getStoreSeo();
	const description = storeDescription
		? `Learn more about ${storeName}. ${storeDescription}`
		: `About ${storeName}: botanical skincare made in small batches.`;

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
	const collectionTiles = home.tiles.filter((tile) => tile.href.startsWith("/collection/"));
	return {
		storeName: home.storeName,
		storeDescription: me?.store.settings?.storeDescription || null,
		contactFormEnabled: me?.store.settings?.enabledTools?.contactForm ?? false,
		productCount: products?.meta.count ?? 0,
		collectionCount: collectionTiles.length,
		image: editorial.about,
	};
}

const howWeWork = [
	{
		title: "A short list.",
		text: "A few cleansers, oils, creams and bath goods, each made for one job in a simple routine.",
	},
	{
		title: "Shown as it is.",
		text: "Every product is photographed and described plainly, so you know what you are getting.",
	},
	{
		title: "Policies up front.",
		text: "Shipping and return terms live on our policy pages, linked at the bottom of every page.",
	},
	{
		title: "A quick checkout.",
		text: "Card and wallet payments in one secure step, with delivery options and costs shown before you pay.",
	},
];

export default async function AboutPage() {
	const { storeName, storeDescription, contactFormEnabled, productCount, collectionCount, image } =
		await getAboutData();

	const aboutJsonLd = {
		"@context": "https://schema.org",
		"@type": "AboutPage",
		name: `About ${storeName}`,
		description: storeDescription ?? `${storeName}: botanical skincare made in small batches.`,
	};

	const numbers = [
		{ num: String(productCount), label: "products on the shelf" },
		{ num: String(collectionCount), label: collectionCount === 1 ? "collection" : "collections" },
	];

	return (
		<>
			<JsonLdScript data={aboutJsonLd} />
			<section className="shell grid items-center gap-10 pt-6 pb-4 sm:pb-8 md:grid-cols-[1.1fr_1fr] md:pt-12">
				<div>
					<span
						aria-hidden
						className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-brass text-[34px] font-extrabold text-on-brass"
					>
						{storeName.charAt(0).toUpperCase()}
					</span>
					<h1 className="font-display text-[clamp(36px,5vw,60px)] font-extrabold leading-[1.02] tracking-tight">
						It starts with a short list.
					</h1>
					<p className="mt-5 max-w-[52ch] text-[16px] leading-relaxed text-muted-foreground">
						{storeName} keeps a short list of things worth owning: pieces you reach for every day, chosen for
						how they look, how they feel and how long they last.
					</p>
					<p className="mt-4 max-w-[52ch] text-[16px] leading-relaxed text-muted-foreground">
						Each one is photographed and described plainly, so what arrives is what you saw. No noise, no
						filler, and a checkout that takes a minute.
					</p>
				</div>
				<div className="relative aspect-4/5 overflow-hidden rounded-xl bg-card">
					<YNSMedia
						src={image}
						alt=""
						fill
						priority
						sizes="(max-width: 768px) 100vw, 520px"
						className="object-cover"
					/>
				</div>
			</section>

			<section aria-label="In numbers" className="shell">
				<div className="grid gap-4 rounded-2xl border border-border bg-card/60 p-4 text-center sm:grid-cols-2 sm:gap-8 sm:p-10">
					{numbers.map((n) => (
						<div key={n.label}>
							<p className="font-display text-3xl font-bold text-brass">{n.num}</p>
							<p className="mt-1 text-[14px] text-muted-foreground">{n.label}</p>
						</div>
					))}
				</div>
			</section>

			<section className="shell pt-4 sm:pt-8">
				<div className="grid gap-5 rounded-2xl border border-border bg-card/60 p-4 sm:gap-10 sm:p-10 md:grid-cols-2">
					<div>
						<p className="text-[13px] font-medium text-brass">The honest part</p>
						<h2 className="mt-3 font-display text-[clamp(24px,3vw,32px)] font-bold leading-tight tracking-tight">
							Blended slowly, on purpose.
						</h2>
						<p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
							{storeDescription ??
								"We would rather make a few things from plants we know well than a long shelf we have to explain."}
						</p>
						<Link
							href="/products"
							className="mt-6 inline-block rounded-md bg-primary px-6 py-3.5 text-[15px] font-semibold text-primary-foreground transition hover:brightness-110"
						>
							Browse the shop
						</Link>
					</div>
					<div>
						<h3 className="text-[16px] font-semibold">How we work</h3>
						<ul className="mt-4 grid gap-4 text-[14px] leading-relaxed text-muted-foreground">
							{howWeWork.map((item) => (
								<li key={item.title} className="flex gap-3">
									<span aria-hidden className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brass" />
									<span>
										<strong className="font-medium text-foreground">{item.title}</strong> {item.text}
									</span>
								</li>
							))}
						</ul>
					</div>
				</div>
			</section>

			<section className="mx-auto flex max-w-3xl flex-col items-center justify-center gap-4 px-5 py-10 text-center sm:py-14">
				<h2 className="font-display text-2xl font-bold">Questions?</h2>
				<p className="text-[15px] text-muted-foreground">
					{contactFormEnabled
						? "Write to us and we will get back to you."
						: "Most answers are already on our FAQ page."}
				</p>
				<Link
					href={contactFormEnabled ? "/contact" : "/faq"}
					className="rounded-md bg-primary px-6 py-3.5 text-[15px] font-semibold text-primary-foreground transition hover:brightness-110"
				>
					{contactFormEnabled ? "Contact us" : "Read the FAQ"}
				</Link>
			</section>
		</>
	);
}
