import { cacheLife } from "next/cache";
import Link from "next/link";
import { PaymentMethods } from "@/components/payment-methods";
import { commerce, meGetCached } from "@/lib/commerce";

const SOCIAL_LABELS = {
	instagram: "Instagram",
	facebook: "Facebook",
	x: "X",
	tiktok: "TikTok",
	youtube: "YouTube",
	linkedin: "LinkedIn",
	email: "Email",
} as const;

async function getFooterData() {
	"use cache";
	cacheLife("hours");

	const [me, legal, socials] = await Promise.all([
		meGetCached().catch(() => null),
		commerce.legalPageBrowse().catch(() => ({ data: [] })),
		commerce.socialsGet().catch(() => null),
	]);
	const tools = me?.store.settings?.enabledTools;

	const links = [
		{ href: "/about", label: "About" },
		{ href: "/faq", label: "FAQ" },
		...(tools?.contactForm ? [{ href: "/contact", label: "Contact" }] : []),
		...(tools?.blog ? [{ href: "/blog", label: "Journal" }] : []),
		...legal.data.map((page) => ({ href: `/legal${page.href}`, label: page.label })),
	];

	const socialLinks = Object.entries(SOCIAL_LABELS).flatMap(([key, label]) => {
		const value = socials?.socials[key as keyof typeof SOCIAL_LABELS];
		if (!value) {
			return [];
		}
		return [{ label, href: key === "email" && !value.startsWith("mailto:") ? `mailto:${value}` : value }];
	});

	return { links, socialLinks, year: new Date().getFullYear() };
}

/** Fluid's footer: a near-black band, centred socials, one quiet line of links and the copyright. */
export async function Footer({ storeName }: { storeName: string }) {
	const { links, socialLinks, year } = await getFooterData();

	return (
		<footer className="bg-ink text-ink-foreground">
			<div className="container flex flex-col items-center gap-8 py-16 text-center sm:py-24">
				{socialLinks.length > 0 && (
					<ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-base font-medium">
						{socialLinks.map((social) => (
							<li key={social.label}>
								<a
									href={social.href}
									target="_blank"
									rel="noreferrer"
									className="underline-offset-4 hover:underline"
								>
									{social.label}
								</a>
							</li>
						))}
					</ul>
				)}
				<nav aria-label="Footer">
					<ul className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-base">
						{links.map((link) => (
							<li key={link.href}>
								<Link href={link.href} className="underline-offset-4 hover:underline">
									{link.label}
								</Link>
							</li>
						))}
					</ul>
				</nav>
				<PaymentMethods className="justify-center" />
				<p className="text-base">
					&copy; {year} {storeName}. All rights reserved.
				</p>
			</div>
		</footer>
	);
}
