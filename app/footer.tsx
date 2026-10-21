import { cacheLife } from "next/cache";
import Link from "next/link";
import { NewsletterForm } from "@/components/newsletter-form";
import { PaymentMethods } from "@/components/payment-methods";
import { commerce, meGetCached } from "@/lib/commerce";

type FooterLink = { href: string; label: string; external?: boolean };

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

	const [me, legal, socials, categories] = await Promise.all([
		meGetCached().catch(() => null),
		commerce.legalPageBrowse().catch(() => ({ data: [] })),
		commerce.socialsGet().catch(() => null),
		commerce.categoriesBrowse({ active: true, limit: 20 }).catch(() => ({ data: [] })),
	]);
	const tools = me?.store.settings?.enabledTools;

	const help: FooterLink[] = [
		{ href: "/faq", label: "FAQ" },
		{ href: "/about", label: "About" },
		...(tools?.contactForm ? [{ href: "/contact", label: "Contact" }] : []),
		...(tools?.blog ? [{ href: "/blog", label: "Journal" }] : []),
	];

	const socialLinks: FooterLink[] = socials
		? Object.entries(SOCIAL_LABELS).flatMap(([key, label]) => {
				const href = socials.socials[key as keyof typeof SOCIAL_LABELS];
				return href ? [{ href, label, external: true }] : [];
			})
		: [];
	// No social profiles configured: the second column points into the catalog instead.
	const second: FooterLink[] =
		socialLinks.length > 0
			? socialLinks
			: [
					{ href: "/products", label: "Shop" },
					...categories.data
						.filter((category) => !category.parentId)
						.slice(0, 3)
						.map((category) => ({ href: `/category/${category.slug}`, label: category.name })),
				];

	const legalLinks: FooterLink[] = legal.data.map((page) => ({
		href: `/legal${page.href}`,
		label: page.label,
	}));

	return {
		storeName: me?.store.name || "Your Next Store",
		year: new Date().getFullYear(),
		columns: [help, second, legalLinks].filter((column) => column.length > 0),
	};
}

function FooterColumn({ links }: { links: FooterLink[] }) {
	return (
		<ul className="flex flex-col gap-6 md:gap-3.5">
			{links.map((link) => (
				<li key={link.href}>
					{link.external ? (
						<a href={link.href} target="_blank" rel="noopener noreferrer" className="hover:underline">
							{link.label}
						</a>
					) : (
						<Link href={link.href} className="hover:underline">
							{link.label}
						</Link>
					)}
				</li>
			))}
		</ul>
	);
}

export async function Footer() {
	const { storeName, year, columns } = await getFooterData();

	return (
		<footer className="bg-grayscale-50 py-8 md:py-20">
			<div className="layout">
				<div className="col-span-full flex justify-between max-lg:flex-col max-md:px-4 md:gap-20">
					<div className="flex flex-1 justify-between max-lg:order-2 max-lg:w-full max-sm:flex-col sm:gap-30 md:items-start lg:gap-20">
						<div className="max-md:mb-9 md:flex-1">
							<Link
								href="/"
								className="mb-2 block max-w-35 text-title-lg leading-none md:mb-6 md:text-title-xl md:leading-[0.9]"
							>
								{storeName}
							</Link>
							<p className="text-body-xs">
								&copy; {year}, {storeName}
							</p>
							<PaymentMethods className="mt-6" />
						</div>
						<nav
							aria-label="Footer"
							className="flex flex-1 justify-between gap-10 max-md:text-body-xs lg:justify-center xl:gap-18"
						>
							{columns.map((links) => (
								<FooterColumn key={links[0]?.href} links={links} />
							))}
						</nav>
					</div>
					<NewsletterForm className="flex-1 max-lg:order-1 max-lg:w-full max-md:mb-16 lg:max-w-90 xl:max-w-96" />
				</div>
			</div>
		</footer>
	);
}
