import { cacheLife } from "next/cache";
import Link from "next/link";
import { FooterWordmark } from "@/components/munch/wordmark";
import { getNavCategories, getStoreName } from "@/lib/catalog";
import { commerce, meGetCached } from "@/lib/commerce";

const SOCIAL_LABELS: Record<string, string> = {
	instagram: "Instagram",
	facebook: "Facebook",
	x: "Twitter (X)",
	youtube: "YouTube",
	linkedin: "LinkedIn",
	tiktok: "TikTok",
};

async function getFooterData() {
	"use cache";
	cacheLife("hours");
	const [me, storeName, categories, legal, socials] = await Promise.all([
		meGetCached().catch(() => null),
		getStoreName(),
		getNavCategories(),
		commerce.legalPageBrowse().catch(() => ({ data: [] })),
		commerce.socialsGet().catch(() => null),
	]);
	const tools = me?.store.settings?.enabledTools;
	const socialLinks = Object.entries(socials?.socials ?? {})
		.filter(([key, value]) => key !== "email" && typeof value === "string" && value.length > 0)
		.map(([key, value]) => ({ href: String(value), label: SOCIAL_LABELS[key] ?? key }));
	const email = socials?.socials?.email ?? null;
	return {
		storeName,
		description: me?.store.settings?.storeDescription?.trim() || null,
		email,
		shopLinks: [
			{ href: "/products", label: "Shop all" },
			{ href: "/faq", label: "FAQs" },
			{ href: "/about", label: "About" },
			...(tools?.contactForm ? [{ href: "/contact", label: "Contact" }] : []),
			...(tools?.blog ? [{ href: "/blog", label: "Blog" }] : []),
		],
		categoryLinks: categories.map((category) => ({ href: category.href, label: category.name })),
		legalLinks: legal.data.map((page) => ({ href: `/legal${page.href}`, label: page.label })),
		socialLinks,
	};
}

// `new Date()` is an unstable value: now that the footer is part of the prerendered
// shell, reading it during the prerender is an error. Caching pins it to the entry.
async function getCopyrightYear() {
	"use cache";
	cacheLife("days");
	return new Date().getFullYear();
}

const tinyCaps = "font-display-d text-l-2xs leading-[1.1] tracking-[0.4px] lg:text-l-xs";

/**
 * The original's tomato slab: info columns and two link lists on top, the store name set
 * edge to edge in Climate Crisis, and a tiny-caps legal/social row underneath.
 */
export async function Footer() {
	const [data, year] = await Promise.all([getFooterData(), getCopyrightYear()]);

	return (
		<footer className="w-full bg-slab text-paper">
			<div className="shell flex flex-col gap-2xl pt-6xl pb-m lg:pb-xl">
				<div className="flex flex-col items-start justify-between gap-2xl lg:flex-row">
					<div className="flex w-full justify-between gap-m lg:justify-start lg:gap-6xl">
						{data.description && (
							<p className="max-w-[22rem] text-b-sm leading-[1.5] lg:text-b-md">{data.description}</p>
						)}
						{data.email && (
							<a href={`mailto:${data.email}`} className="text-b-sm leading-[1.5] lg:text-b-md">
								{data.email}
							</a>
						)}
					</div>
					<nav aria-label="Footer" className="flex w-full justify-between gap-m lg:justify-end lg:gap-6xl">
						<ul className="flex flex-1 flex-col gap-xs lg:min-w-49 lg:flex-none">
							{data.shopLinks.map((link) => (
								<li key={link.href}>
									<Link href={link.href} className="text-b-sm leading-[1.5] hover:underline lg:text-b-md">
										{link.label}
									</Link>
								</li>
							))}
						</ul>
						{data.categoryLinks.length > 0 && (
							<ul className="flex flex-1 flex-col gap-xs lg:min-w-49 lg:flex-none">
								{data.categoryLinks.map((link) => (
									<li key={link.href}>
										<Link href={link.href} className="text-b-sm leading-[1.5] hover:underline lg:text-b-md">
											{link.label}
										</Link>
									</li>
								))}
							</ul>
						)}
					</nav>
				</div>
				<div className="@container lg:mt-2xl">
					<FooterWordmark name={data.storeName} />
				</div>
				<div className="flex flex-col justify-between gap-lg lg:flex-row lg:items-center">
					<div className="flex flex-col gap-2xl lg:flex-row">
						<p className={tinyCaps}>© {year}</p>
						{data.legalLinks.length > 0 && (
							<ul className="flex flex-wrap gap-x-2xl gap-y-s">
								{data.legalLinks.map((link) => (
									<li key={link.href}>
										<Link href={link.href} className={`${tinyCaps} whitespace-nowrap hover:underline`}>
											{link.label}
										</Link>
									</li>
								))}
							</ul>
						)}
					</div>
					{data.socialLinks.length > 0 && (
						<ul className="flex flex-wrap gap-2xl">
							{data.socialLinks.map((link) => (
								<li key={link.href}>
									<a
										href={link.href}
										className={`${tinyCaps} hover:underline`}
										rel="noopener"
										target="_blank"
									>
										{link.label}
									</a>
								</li>
							))}
						</ul>
					)}
				</div>
			</div>
		</footer>
	);
}
