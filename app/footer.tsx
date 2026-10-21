import { cacheLife } from "next/cache";
import Link from "next/link";
import { NewsletterForm } from "@/components/newsletter-form";
import { PaymentMethods } from "@/components/payment-methods";
import { collectionHasProducts } from "@/lib/catalog";
import { commerce, meGetCached } from "@/lib/commerce";

type FooterLink = { href: string; label: string };

const SOCIAL_LABELS = {
	instagram: "Instagram",
	facebook: "Facebook",
	tiktok: "TikTok",
	x: "X",
	youtube: "YouTube",
	linkedin: "LinkedIn",
} as const;

// One cached read for everything the footer shows, so it stays in the prerendered shell.
// `new Date()` included: caching pins the year to the entry.
async function getFooterData() {
	"use cache";
	cacheLife("hours");

	const [me, collections, legal, socials] = await Promise.all([
		meGetCached().catch(() => null),
		commerce.collectionBrowse({ limit: 20 }).catch(() => ({ data: [] })),
		commerce.legalPageBrowse().catch(() => ({ data: [] })),
		commerce.socialsGet().catch(() => null),
	]);
	const tools = me?.store.settings?.enabledTools;

	const shop: FooterLink[] = [
		{ href: "/products", label: "Shop All" },
		...collections.data
			.filter(collectionHasProducts)
			.slice(0, 5)
			.map((collection) => ({
				href: `/collection/${collection.slug}`,
				label: collection.name,
			})),
	];
	const info: FooterLink[] = [
		{ href: "/about", label: "Our Story" },
		{ href: "/faq", label: "FAQ" },
		...(tools?.contactForm ? [{ href: "/contact", label: "Contact" }] : []),
		...(tools?.blog ? [{ href: "/blog", label: "Journal" }] : []),
		...legal.data.map((page) => ({ href: `/legal${page.href}`, label: page.label })),
	];
	const social: FooterLink[] = socials
		? Object.entries(SOCIAL_LABELS).flatMap(([key, label]) => {
				const href = socials.socials[key as keyof typeof SOCIAL_LABELS];
				return href ? [{ href, label }] : [];
			})
		: [];

	return {
		storeName: me?.store.name || "Your Next Store",
		description: me?.store.settings?.storeDescription?.trim() || null,
		shop,
		info,
		social,
		year: new Date().getFullYear(),
	};
}

function LinkColumn({ title, links }: { title: string; links: FooterLink[] }) {
	return (
		<nav aria-label={title} className="pt-2">
			<h2 className="mb-4 font-bold">{title}</h2>
			<ul>
				{links.map((link) => (
					<li key={link.href}>
						<Link href={link.href} className="block pb-2 text-sm hover:underline">
							{link.label}
						</Link>
					</li>
				))}
			</ul>
		</nav>
	);
}

export async function Footer() {
	const { storeName, description, shop, info, social, year } = await getFooterData();

	return (
		<footer className="bg-olive py-8 text-white">
			<div className="page-container">
				<div className="grid w-full gap-10 sm:grid-cols-2 sm:gap-16 lg:grid-cols-6">
					<div className="flex flex-col gap-8 sm:col-span-2 sm:gap-9 lg:col-span-2">
						<div className="flex flex-col gap-5">
							<h2 className="font-bold">Coffee &amp; Community</h2>
							<p className="text-sm">
								{description ??
									`${storeName} roasts small-batch single origins and blends, and sells the gear to brew them.`}
							</p>
						</div>
						<Link href="/" className="self-start font-wordmark text-xl uppercase">
							{storeName}
						</Link>
					</div>
					<LinkColumn title="Shop" links={shop} />
					<LinkColumn title="Information" links={info} />
					<div className="flex flex-col gap-8 sm:col-span-2">
						<NewsletterForm />
						{social.length > 0 && (
							<ul aria-label="Social media" className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
								{social.map((link) => (
									<li key={link.href}>
										<a href={link.href} target="_blank" rel="noopener noreferrer" className="hover:underline">
											{link.label}
										</a>
									</li>
								))}
							</ul>
						)}
					</div>
				</div>
				<div className="mt-12 flex flex-col gap-6 max-md:items-center md:flex-row md:items-end md:justify-between">
					<p className="text-sm">
						&copy; {year} {storeName}
					</p>
					<PaymentMethods />
				</div>
			</div>
		</footer>
	);
}
