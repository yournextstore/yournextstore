import {
	BookOpen,
	Info,
	type LucideIcon,
	Mail,
	MessageCircleQuestion,
	ScrollText,
	Store,
} from "lucide-react";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { PaymentMethods } from "@/components/payment-methods";
import { commerce } from "@/lib/commerce";
import { getStoreBasics } from "@/lib/store-basics";

const ICONS = {
	shop: Store,
	about: Info,
	faq: MessageCircleQuestion,
	contact: Mail,
	journal: BookOpen,
	legal: ScrollText,
} satisfies Record<string, LucideIcon>;

// Icons are looked up outside the cache: cached values must be serialisable.
type FooterLink = { href: string; label: string; icon: keyof typeof ICONS };

const SOCIAL_LABELS = {
	instagram: "Instagram",
	facebook: "Facebook",
	x: "X",
	tiktok: "TikTok",
	youtube: "YouTube",
	linkedin: "LinkedIn",
} as const;

// One cached read for everything the footer shows: `new Date()` and the SDK calls must not run
// during the shell prerender uncached.
async function getFooterData() {
	"use cache";
	cacheLife("hours");
	const [basics, legal, socials] = await Promise.all([
		getStoreBasics(),
		commerce.legalPageBrowse().catch(() => ({ data: [] })),
		commerce.socialsGet().catch(() => null),
	]);
	const links: FooterLink[] = [
		{ href: "/products", label: "Shop all", icon: "shop" },
		{ href: "/about", label: "About", icon: "about" },
		{ href: "/faq", label: "FAQ", icon: "faq" },
		...(basics.contactForm ? [{ href: "/contact", label: "Contact", icon: "contact" } as const] : []),
		...(basics.blog ? [{ href: "/blog", label: "Journal", icon: "journal" } as const] : []),
		...legal.data.map((page) => ({ href: `/legal${page.href}`, label: page.label, icon: "legal" as const })),
	];
	const social = Object.entries(SOCIAL_LABELS).flatMap(([key, label]) => {
		const href = socials?.socials?.[key as keyof typeof SOCIAL_LABELS];
		return href ? [{ label, href }] : [];
	});
	return { storeName: basics.storeName, links, social, year: new Date().getFullYear() };
}

/** The original's footer: one quiet row of small icon links in grey, under a hairline. */
export async function Footer() {
	const { storeName, links, social, year } = await getFooterData();

	return (
		<footer className="border-t border-border text-sm text-gray-600">
			<div className="container py-8">
				<nav aria-label="Footer">
					<ul className="grid gap-5 sm:flex sm:flex-wrap sm:items-center sm:gap-x-10 sm:gap-y-4">
						{links.map((link) => {
							const Icon = ICONS[link.icon];
							return (
								<li key={link.href}>
									<Link
										href={link.href}
										className="flex max-w-fit items-center gap-2 transition-colors hover:text-gray-900"
									>
										<Icon className="h-5 w-5 text-gray-500" strokeWidth={1.5} aria-hidden />
										{link.label}
									</Link>
								</li>
							);
						})}
						{social.map((s) => (
							<li key={s.label}>
								<a
									href={s.href}
									target="_blank"
									rel="noopener noreferrer"
									className="flex max-w-fit items-center gap-2 transition-colors hover:text-gray-900"
								>
									{s.label}
								</a>
							</li>
						))}
					</ul>
				</nav>
				<div className="mt-8 flex flex-col gap-4 border-t border-zinc-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
					<p>
						&copy; {year} {storeName}
					</p>
					<PaymentMethods />
				</div>
			</div>
		</footer>
	);
}
