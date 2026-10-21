import { cacheLife } from "next/cache";
import Link from "next/link";
import { FooterNewsletter } from "@/components/footer-newsletter";
import { PaymentMethods } from "@/components/payment-methods";
import { capitalize, getCatalogCategories, getStoreIdentity } from "@/lib/catalog";
import { commerce } from "@/lib/commerce";

const SOCIAL_LABELS = {
	instagram: "Instagram",
	facebook: "Facebook",
	x: "X",
	tiktok: "TikTok",
	youtube: "YouTube",
	linkedin: "LinkedIn",
} as const;

type FooterLink = { href: string; label: string };
type FooterSection = { title: string; links: FooterLink[] };

async function getFooterData() {
	"use cache";
	cacheLife("hours");
	const [identity, categories, collections, socials, legal] = await Promise.all([
		getStoreIdentity(),
		getCatalogCategories(),
		commerce.collectionBrowse({ limit: 5 }).catch(() => ({ data: [] })),
		commerce.socialsGet().catch(() => null),
		commerce.legalPageBrowse().catch(() => ({ data: [] })),
	]);
	const socialLinks = Object.entries(SOCIAL_LABELS).flatMap(([key, label]) => {
		const href = socials?.socials[key as keyof typeof SOCIAL_LABELS];
		return href ? [{ href, label }] : [];
	});
	const sections: FooterSection[] = [
		{
			title: "Shop",
			links: [
				{ href: "/products", label: "All products" },
				...categories
					.slice(0, 5)
					.map((category) => ({ href: `/category/${category.slug}`, label: capitalize(category.name) })),
			],
		},
		...(collections.data.length > 0
			? [
					{
						title: "Collections",
						links: collections.data.map((collection) => ({
							href: `/collection/${collection.slug}`,
							label: collection.name,
						})),
					},
				]
			: []),
		{
			title: "Company",
			links: [
				{ href: "/about", label: "About" },
				{ href: "/faq", label: "FAQ" },
				...(identity.blogEnabled ? [{ href: "/blog", label: "Blog" }] : []),
				...(identity.contactFormEnabled ? [{ href: "/contact", label: "Contact" }] : []),
			],
		},
		...(legal.data.length > 0
			? [
					{
						title: "Legal",
						links: legal.data.map((page) => ({ href: `/legal${page.href}`, label: page.label })),
					},
				]
			: []),
	];
	return {
		storeName: identity.storeName,
		socialLinks,
		sections,
		// `new Date()` is an unstable value in the prerendered shell; caching pins it to the entry.
		year: new Date().getFullYear(),
	};
}

function FooterColumn({ section }: { section: FooterSection }) {
	return (
		<div>
			<h3 className="text-sm font-semibold tracking-wider text-gray-500 uppercase">{section.title}</h3>
			<ul className="mt-4 space-y-4">
				{section.links.map((link) => (
					<li key={link.href}>
						<Link href={link.href} className="text-base text-gray-600 hover:text-gray-900">
							{link.label}
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}

export async function Footer() {
	const { storeName, socialLinks, sections, year } = await getFooterData();
	return (
		<footer className="bg-white">
			<h2 id="footer-heading" className="sr-only">
				Footer
			</h2>
			<div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
				<div className="xl:grid xl:grid-cols-3 xl:gap-8">
					<div className="grid grid-cols-2 gap-8 md:grid-cols-4 xl:col-span-2">
						{sections.map((section) => (
							<FooterColumn key={section.title} section={section} />
						))}
					</div>
					<div id="newsletter" className="mt-8 scroll-mt-8 xl:mt-0">
						<FooterNewsletter />
					</div>
				</div>
				<div className="mt-8 border-t border-gray-200 pt-8 md:flex md:items-center md:justify-between">
					<div className="flex flex-wrap items-center gap-x-6 gap-y-4 md:order-2">
						{socialLinks.length > 0 && (
							<ul aria-label="Social media" className="flex flex-wrap gap-x-6 gap-y-2">
								{socialLinks.map((link) => (
									<li key={link.href}>
										<a
											href={link.href}
											target="_blank"
											rel="noopener noreferrer"
											className="text-sm text-gray-500 hover:text-gray-700"
										>
											{link.label}
										</a>
									</li>
								))}
							</ul>
						)}
						<PaymentMethods />
					</div>
					<p className="mt-8 text-base text-gray-500 md:order-1 md:mt-0">
						&copy; {year} {storeName}. All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
}
