import { cacheLife } from "next/cache";
import Link from "next/link";
import type { ReactNode } from "react";
import { NewsletterForm } from "@/components/newsletter-form";
import { PaymentMethods } from "@/components/payment-methods";
import { commerce, meGetCached } from "@/lib/commerce";

type FooterLink = { href: string; label: string };

type SocialKey = "facebook" | "x" | "instagram" | "youtube" | "linkedin" | "tiktok";

const SOCIALS: { key: SocialKey; label: string; icon: ReactNode }[] = [
	{
		key: "facebook",
		label: "Facebook",
		icon: (
			<svg aria-hidden="true" viewBox="0 0 24 24" className="size-6" fill="currentColor">
				<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
			</svg>
		),
	},
	{
		key: "x",
		label: "X",
		icon: (
			<svg aria-hidden="true" viewBox="0 0 1200 1227" className="size-6" fill="currentColor">
				<path d="M714.163 519.284 1160.89 0h-105.86L667.137 450.887 357.328 0H0l468.492 681.821L0 1226.37h105.866l409.625-476.152 327.181 476.152H1200L714.137 519.284h.026ZM569.165 687.828l-47.468-67.894-377.686-540.24h162.604l304.797 435.991 47.468 67.894 396.2 566.721H892.476L569.165 687.854v-.026Z" />
			</svg>
		),
	},
	{
		key: "instagram",
		label: "Instagram",
		icon: (
			<svg aria-hidden="true" viewBox="0 0 16 16" className="size-6" fill="currentColor">
				<path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334" />
			</svg>
		),
	},
	{
		key: "youtube",
		label: "YouTube",
		icon: (
			<svg aria-hidden="true" viewBox="0 0 461.001 461.001" className="size-8" fill="currentColor">
				<path d="M365.257 67.393H95.744C42.866 67.393 0 110.259 0 163.137v134.728c0 52.878 42.866 95.744 95.744 95.744h269.513c52.878 0 95.744-42.866 95.744-95.744V163.137c0-52.878-42.866-95.744-95.744-95.744zm-64.751 169.663-126.06 60.123c-3.359 1.602-7.239-.847-7.239-4.568V168.607c0-3.774 3.982-6.22 7.348-4.514l126.06 63.881c3.748 1.899 3.683 7.274-.109 9.082z" />
			</svg>
		),
	},
	{
		key: "linkedin",
		label: "LinkedIn",
		icon: (
			<svg aria-hidden="true" viewBox="0 0 24 24" className="size-6" fill="currentColor">
				<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
				<rect width="4" height="12" x="2" y="9" />
				<circle cx="4" cy="4" r="2" />
			</svg>
		),
	},
	{
		key: "tiktok",
		label: "TikTok",
		icon: (
			<svg aria-hidden="true" viewBox="0 0 24 24" className="size-6" fill="currentColor">
				<path d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5 2.59 2.59 0 0 1-2.59-2.59 2.59 2.59 0 0 1 3.4-2.46V9.69a5.74 5.74 0 0 0-.81-.06A5.69 5.69 0 0 0 4.17 15.3a5.69 5.69 0 0 0 5.69 5.69 5.69 5.69 0 0 0 5.69-5.69V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3a4.3 4.3 0 0 1-3.25-1.48z" />
			</svg>
		),
	},
];

async function getFooterData() {
	"use cache";
	cacheLife("hours");

	const [me, categories, legal, socials] = await Promise.all([
		meGetCached().catch(() => null),
		commerce.categoriesBrowse({ active: true, limit: 20 }).catch(() => ({ data: [] })),
		commerce.legalPageBrowse().catch(() => ({ data: [] })),
		commerce.socialsGet().catch(() => null),
	]);
	const tools = me?.store.settings?.enabledTools;

	const shop: FooterLink[] = [
		{ href: "/products", label: "All Products" },
		...categories.data
			.filter((category) => !category.parentId)
			.slice(0, 3)
			.map((category) => ({ href: `/category/${category.slug}`, label: category.name })),
	];
	const support: FooterLink[] = [
		{ href: "/about", label: "About Us" },
		...(tools?.contactForm ? [{ href: "/contact", label: "Contact Us" }] : []),
		{ href: "/faq", label: "FAQ" },
		...(tools?.blog ? [{ href: "/blog", label: "Blog" }] : []),
	];
	const legalLinks: FooterLink[] = legal.data.map((page) => ({
		href: `/legal${page.href}`,
		label: page.label,
	}));
	const socialLinks = SOCIALS.flatMap((social) => {
		const href = socials?.socials[social.key];
		return href ? [{ ...social, href }] : [];
	});

	return {
		storeName: me?.store.name || "Your Next Store",
		// `new Date()` cannot be read during the prerender; the cache pins it to the entry.
		year: new Date().getFullYear(),
		shop,
		support,
		legalLinks,
		socialLinks,
	};
}

function FooterColumn({ title, links }: { title: string; links: FooterLink[] }) {
	return (
		<div className="space-y-4">
			<h2 className="text-lg font-semibold text-primary">{title}</h2>
			<ul className="space-y-2">
				{links.map((link) => (
					<li key={link.href}>
						<Link href={link.href} className="transition-colors hover:text-gray-700">
							{link.label}
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}

export async function Footer() {
	const { storeName, year, shop, support, legalLinks, socialLinks } = await getFooterData();

	return (
		<footer className="border-t border-border bg-white text-muted-foreground">
			<div className="mx-auto max-w-shop px-6 py-12">
				<div className="grid gap-8 sm:grid-cols-2">
					<NewsletterForm />
					<div className="flex justify-center gap-24 sm:justify-end">
						<FooterColumn title="Shop" links={shop} />
						<FooterColumn title="Support" links={support} />
					</div>
				</div>
				<div className="mt-8 border-t border-muted-foreground/20 pt-8">
					<div className="flex flex-col items-center justify-between gap-4 md:flex-row">
						{socialLinks.length > 0 ? (
							<ul className="flex items-center gap-4 text-ink">
								{socialLinks.map((social) => (
									<li key={social.key}>
										<a
											href={social.href}
											target="_blank"
											rel="noopener noreferrer"
											aria-label={social.label}
											className="flex h-8 items-center transition-opacity hover:opacity-70"
										>
											{social.icon}
										</a>
									</li>
								))}
							</ul>
						) : (
							<ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
								{legalLinks.map((link) => (
									<li key={link.href}>
										<Link href={link.href} className="transition-colors hover:text-gray-700">
											{link.label}
										</Link>
									</li>
								))}
							</ul>
						)}
						<p className="text-sm">
							© {year} {storeName}.
						</p>
					</div>
					<div className="mt-8 flex flex-col items-center justify-between gap-4 md:flex-row">
						{socialLinks.length > 0 ? (
							<ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
								{legalLinks.map((link) => (
									<li key={link.href}>
										<Link href={link.href} className="transition-colors hover:text-gray-700">
											{link.label}
										</Link>
									</li>
								))}
							</ul>
						) : (
							<span />
						)}
						<PaymentMethods />
					</div>
				</div>
			</div>
		</footer>
	);
}
