import { cacheLife } from "next/cache";
import Link from "next/link";
import { try_ } from "safe-try";
import { PaymentMethods } from "@/components/payment-methods";
import { hasMembers } from "@/lib/catalog";
import { commerce, meGetCached } from "@/lib/commerce";

const SOCIAL_LABELS = {
	instagram: "Instagram",
	facebook: "Facebook",
	x: "X",
	tiktok: "TikTok",
	youtube: "YouTube",
	linkedin: "LinkedIn",
} as const;

// One cached read for everything the strip shows: the footer is part of the prerendered shell,
// and `new Date()` is an unstable value there unless a cache entry pins it.
async function getFooterData() {
	"use cache";
	cacheLife("hours");
	const [me, collections, legal, socials] = await Promise.all([
		meGetCached().catch(() => null),
		commerce.collectionBrowse({ limit: 5 }).catch(() => ({ data: [] })),
		commerce.legalPageBrowse().catch(() => ({ data: [] })),
		try_(commerce.socialsGet()),
	]);
	const tools = me?.store.settings?.enabledTools;
	const [, socialsResult] = socials;
	const socialLinks = socialsResult
		? (Object.keys(SOCIAL_LABELS) as (keyof typeof SOCIAL_LABELS)[])
				.map((key) => ({ label: SOCIAL_LABELS[key], href: socialsResult.socials?.[key] ?? null }))
				.flatMap((s) => (s.href ? [{ label: s.label as string, href: s.href }] : []))
		: [];

	return {
		storeName: me?.store.name || "Your Next Store",
		year: new Date().getFullYear(),
		links: [
			{ href: "/products", label: "Shop all" },
			...collections.data.filter(hasMembers).map((c) => ({ href: `/collection/${c.slug}`, label: c.name })),
			{ href: "/about", label: "About" },
			{ href: "/faq", label: "FAQ" },
			...(tools?.contactForm ? [{ href: "/contact", label: "Contact" }] : []),
			...(tools?.blog ? [{ href: "/blog", label: "Blog" }] : []),
		],
		legal: legal.data.map((page) => ({ href: `/legal${page.href}`, label: page.label })),
		socialLinks,
	};
}

/**
 * Eyesome's footer is one cream strip of centred, wrapping items. It keeps that strip and puts
 * the shop's own links, legal pages and payment marks in it.
 */
export async function Footer() {
	const { storeName, year, links, legal, socialLinks } = await getFooterData();
	const link = "transition-colors hover:text-amber-800";

	return (
		<footer className="mt-10 bg-strip">
			<div className="flex flex-col items-center gap-4 px-[4%] py-6 text-center md:px-[10%]">
				<nav aria-label="Footer">
					<ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
						{links.map((item) => (
							<li key={item.href}>
								<Link href={item.href} className={link}>
									{item.label}
								</Link>
							</li>
						))}
					</ul>
				</nav>
				{socialLinks.length > 0 && (
					<ul className="flex flex-wrap justify-center gap-x-5 gap-y-1 text-sm">
						{socialLinks.map((social) => (
							<li key={social.label}>
								<a href={social.href} target="_blank" rel="noreferrer" className={`underline ${link}`}>
									{social.label}
								</a>
							</li>
						))}
					</ul>
				)}
				<div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-sm text-muted-foreground">
					<p>
						&copy; {year} {storeName}
					</p>
					{legal.length > 0 && (
						<ul className="flex flex-wrap justify-center gap-x-4 gap-y-1">
							{legal.map((item) => (
								<li key={item.href}>
									<Link href={item.href} className={link}>
										{item.label}
									</Link>
								</li>
							))}
						</ul>
					)}
					<PaymentMethods />
				</div>
			</div>
		</footer>
	);
}
