import { cacheLife } from "next/cache";
import Link from "next/link";
import { Fragment } from "react";
import { NewsletterButton } from "@/components/newsletter-form";
import { commerce, meGetCached } from "@/lib/commerce";

type FooterLink = { href: string; label: string };

const SOCIAL_LABELS = {
	instagram: "Instagram",
	tiktok: "TikTok",
	facebook: "Facebook",
	x: "X",
	youtube: "YouTube",
	linkedin: "LinkedIn",
} as const;

// Everything the footer shows comes from one cached read, so the whole footer stays in the
// prerendered shell. `new Date()` included: caching pins the year to the entry.
async function getFooterData() {
	"use cache";
	cacheLife("hours");

	const [me, legal, socials] = await Promise.all([
		meGetCached().catch(() => null),
		commerce.legalPageBrowse().catch(() => ({ data: [] })),
		commerce.socialsGet().catch(() => null),
	]);
	const tools = me?.store.settings?.enabledTools;

	const social: FooterLink[] = socials
		? Object.entries(SOCIAL_LABELS).flatMap(([key, label]) => {
				const href = socials.socials[key as keyof typeof SOCIAL_LABELS];
				return href ? [{ href, label }] : [];
			})
		: [];

	const links: FooterLink[] = [
		{ href: "/faq", label: "FAQ" },
		...(tools?.contactForm ? [{ href: "/contact", label: "Contact" }] : []),
		...legal.data.map((page) => ({ href: `/legal${page.href}`, label: page.label })),
	];

	return {
		storeName: me?.store.name || "Your Next Store",
		year: new Date().getFullYear(),
		social,
		links,
	};
}

/** A red bar, 4px from the screen's edges (black on the red about page), as in the original. */
export async function Footer() {
	const { storeName, year, social, links } = await getFooterData();

	return (
		<footer className="site-footer card m-1 flex flex-wrap items-center gap-x-8 gap-y-3 bg-brand text-white lg:grid-site">
			<p className="lg:col-span-3">
				©{year} {storeName}
			</p>
			<nav aria-label="Footer" className="lg:col-span-5 lg:col-start-4">
				{links.map((link, index) => (
					<Fragment key={link.href}>
						<Link href={link.href} className="tap hover:underline">
							{link.label}
						</Link>
						{index < links.length - 1 && ", "}
					</Fragment>
				))}
			</nav>
			{social.length > 0 && (
				<p className="lg:col-span-2 lg:col-start-9">
					{social.map((link, index) => (
						<Fragment key={link.href}>
							<a href={link.href} target="_blank" rel="noopener noreferrer" className="tap hover:underline">
								{link.label}
							</a>
							{index < social.length - 1 && ", "}
						</Fragment>
					))}
				</p>
			)}
			<NewsletterButton className="ml-auto lg:col-span-2 lg:col-start-11 lg:justify-self-end" />
		</footer>
	);
}
