import { cacheLife } from "next/cache";
import Link from "next/link";
import { NewsletterBand } from "@/components/newsletter-band";
import { PaymentMethods } from "@/components/payment-methods";
import { isListedCollection } from "@/lib/catalog";
import { commerce, meGetCached } from "@/lib/commerce";

type FooterLink = { href: string; label: string; external?: boolean };

const SOCIAL_LABELS = {
	instagram: "Instagram",
	facebook: "Facebook",
	tiktok: "TikTok",
	youtube: "YouTube",
	x: "X",
	linkedin: "LinkedIn",
} as const;

// One cached read feeds the whole footer, so it stays in the prerendered shell. `new Date()`
// included: caching pins the year to the entry.
async function getFooterData() {
	"use cache";
	cacheLife("hours");

	const [me, legal, socials, collections] = await Promise.all([
		meGetCached().catch(() => null),
		commerce.legalPageBrowse().catch(() => ({ data: [] })),
		commerce.socialsGet().catch(() => null),
		commerce.collectionBrowse({ limit: 5 }).catch(() => ({ data: [] })),
	]);
	const tools = me?.store.settings?.enabledTools;

	const quick: FooterLink[] = [
		{ href: "/", label: "Home" },
		{ href: "/products", label: "Shop all" },
		{ href: "/about", label: "About" },
		...(tools?.blog ? [{ href: "/blog", label: "Journal" }] : []),
	];
	const help: FooterLink[] = [
		{ href: "/faq", label: "Help & FAQ" },
		{ href: "/search", label: "Search" },
		...(tools?.contactForm ? [{ href: "/contact", label: "Contact" }] : []),
	];
	const collectionLinks: FooterLink[] = collections.data
		.filter(isListedCollection)
		.map((collection) => ({ href: `/collection/${collection.slug}`, label: collection.name }));
	const socialLinks: FooterLink[] = socials
		? Object.entries(SOCIAL_LABELS).flatMap(([key, label]) => {
				const href = socials.socials[key as keyof typeof SOCIAL_LABELS];
				return href ? [{ href, label, external: true }] : [];
			})
		: [];

	return {
		storeName: me?.store.name || "Your Next Store",
		tagline: me?.store.settings?.storeDescription || "Botanical bath and body care",
		quick,
		help,
		collectionLinks,
		socialLinks,
		legalLinks: legal.data.map((page) => ({ href: `/legal${page.href}`, label: page.label })),
		year: new Date().getFullYear(),
	};
}

function FooterColumn({ title, links }: { title: string; links: FooterLink[] }) {
	if (links.length === 0) return null;
	return (
		<div>
			<h2 className="font-sans text-[15px] font-semibold">{title}</h2>
			<ul className="mt-5 space-y-3">
				{links.map((link) => (
					<li key={link.href}>
						{link.external ? (
							<a
								href={link.href}
								target="_blank"
								rel="noopener noreferrer"
								className="text-sm underline-offset-4 hover:underline"
							>
								{link.label}
							</a>
						) : (
							<Link href={link.href} className="text-sm underline-offset-4 hover:underline">
								{link.label}
							</Link>
						)}
					</li>
				))}
			</ul>
		</div>
	);
}

export async function Footer() {
	const data = await getFooterData();

	return (
		<>
			<NewsletterBand storeName={data.storeName} />
			<footer className="bg-blush text-blush-foreground">
				<div className="mx-auto max-w-[70rem] px-5 md:px-10">
					<div className="flex flex-col items-center py-12 text-center lg:py-14">
						<Link
							href="/"
							className="font-heading text-[2.5rem] uppercase leading-none tracking-[0.04em] md:text-6xl"
						>
							{data.storeName}
						</Link>
						<p className="mt-3 text-[11px] uppercase tracking-[0.12em]">{data.tagline}</p>
					</div>
					<div className="grid grid-cols-2 gap-x-6 gap-y-10 border-t border-blush-foreground/60 py-12 md:grid-cols-4">
						<FooterColumn title="Quick links" links={data.quick} />
						<FooterColumn title="Collections" links={data.collectionLinks} />
						<FooterColumn title="Help" links={data.help} />
						{data.socialLinks.length > 0 ? (
							<FooterColumn title="Connect" links={data.socialLinks} />
						) : (
							<FooterColumn title="Legal" links={data.legalLinks} />
						)}
					</div>
					<div className="flex flex-col gap-6 border-t border-blush-foreground/15 py-8 md:flex-row md:items-center md:justify-between">
						<p className="text-sm">
							&copy; {data.year} {data.storeName}. All rights reserved.
						</p>
						{data.socialLinks.length > 0 && data.legalLinks.length > 0 && (
							<ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
								{data.legalLinks.map((link) => (
									<li key={link.href}>
										<Link href={link.href} className="underline-offset-4 hover:underline">
											{link.label}
										</Link>
									</li>
								))}
							</ul>
						)}
						<PaymentMethods />
					</div>
				</div>
			</footer>
		</>
	);
}
