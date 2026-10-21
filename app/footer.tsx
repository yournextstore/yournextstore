import { cacheLife } from "next/cache";
import Link from "next/link";
import { PaymentMethods } from "@/components/payment-methods";
import { commerce, meGetCached } from "@/lib/commerce";

type FooterLink = { href: string; label: string };
type FooterSection = { title: string; links: FooterLink[] };

const SOCIAL_LABELS = {
	instagram: "Instagram",
	facebook: "Facebook",
	x: "X",
	tiktok: "TikTok",
	youtube: "YouTube",
	linkedin: "LinkedIn",
} as const;

// One cached read feeds the whole footer, so it stays in the prerendered shell.
// `new Date()` included: caching pins the copyright year to the entry.
async function getFooterData() {
	"use cache";
	cacheLife("hours");

	const [me, categories, collections, legal, socials] = await Promise.all([
		meGetCached().catch(() => null),
		commerce.categoriesBrowse({ active: true, limit: 20 }).catch(() => ({ data: [] })),
		commerce.collectionBrowse({ limit: 5 }).catch(() => ({ data: [] })),
		commerce.legalPageBrowse().catch(() => ({ data: [] })),
		commerce.socialsGet().catch(() => null),
	]);
	const tools = me?.store.settings?.enabledTools;

	const sections: FooterSection[] = [
		{
			title: "Categories",
			links: [
				{ href: "/products", label: "Shop All" },
				...categories.data
					.filter((category) => !category.parentId)
					.slice(0, 5)
					.map((category) => ({ href: `/category/${category.slug}`, label: category.name })),
			],
		},
		{
			title: "Collections",
			// Hide inactive collections and manual ones with no members (they would open on an empty page).
			links: collections.data
				.filter(
					(collection) =>
						collection.active &&
						(collection.productCollections.length > 0 || (collection.metafieldRules?.length ?? 0) > 0),
				)
				.map((collection) => ({
					href: `/collection/${collection.slug}`,
					label: collection.name,
				})),
		},
		{
			title: "Navigate",
			links: [
				{ href: "/about", label: "About us" },
				{ href: "/faq", label: "FAQ" },
				...(tools?.contactForm ? [{ href: "/contact", label: "Contact" }] : []),
				...(tools?.blog ? [{ href: "/blog", label: "Blog" }] : []),
				...legal.data.map((page) => ({ href: `/legal${page.href}`, label: page.label })),
			],
		},
	].filter((section) => section.links.length > 0);

	const socialLinks = socials
		? Object.entries(SOCIAL_LABELS).flatMap(([key, label]) => {
				const href = socials.socials[key as keyof typeof SOCIAL_LABELS];
				return href ? [{ href, label }] : [];
			})
		: [];

	return {
		storeName: me?.store.name || "Your Next Store",
		description: me?.store.settings?.storeDescription,
		email: socials?.socials.email ?? null,
		socialLinks,
		sections,
		year: new Date().getFullYear(),
	};
}

export async function Footer() {
	const { storeName, description, email, socialLinks, sections, year } = await getFooterData();

	return (
		<footer className="border-t border-b-4 border-t-contrast-100 border-b-lime bg-background">
			<div className="container-soul py-6 sm:py-10 lg:py-12">
				<div className="flex flex-col justify-between gap-x-16 gap-y-12 md:flex-row">
					<div className="flex flex-col gap-4 md:w-1/3 md:gap-6">
						<Link href="/" className="self-start font-heading text-2xl leading-none">
							{storeName}
						</Link>

						<div className="mb-4 text-lg font-medium sm:text-xl">
							<p className="text-contrast-500">{email ? "Contact Us" : "About us"}</p>
							<div className="text-foreground">
								{email ? (
									<a href={`mailto:${email}`} className="hover:underline">
										{email}
									</a>
								) : (
									<p>
										{description ||
											"Houseplants, planters and plant care, chosen for real rooms and real light."}
									</p>
								)}
							</div>
						</div>

						{socialLinks.length > 0 && (
							<ul className="flex flex-wrap items-center gap-x-4 gap-y-2">
								{socialLinks.map((link) => (
									<li key={link.href}>
										<a
											href={link.href}
											target="_blank"
											rel="noopener noreferrer"
											className="rounded-lg text-sm font-medium text-contrast-500 transition-colors hover:text-foreground"
										>
											{link.label}
										</a>
									</li>
								))}
							</ul>
						)}
					</div>

					<div className="grid max-w-5xl flex-1 grid-cols-1 gap-y-8 xs:grid-cols-2 sm:gap-y-10 lg:grid-cols-3">
						{sections.map((section) => (
							<div key={section.title} className="pr-8">
								<p className="mb-3 block font-semibold">{section.title}</p>
								<ul>
									{section.links.map((link) => (
										<li key={link.href}>
											<Link
												href={link.href}
												className="block rounded-lg py-2 text-sm font-medium text-contrast-500 transition-colors duration-300 hover:text-foreground"
											>
												{link.label}
											</Link>
										</li>
									))}
								</ul>
							</div>
						))}
					</div>
				</div>

				<div className="flex flex-col-reverse items-start gap-y-8 pt-16 md:flex-row md:items-center md:pt-20">
					<p className="flex-1 text-sm text-contrast-500">
						&copy; {year} {storeName}
					</p>
					<PaymentMethods />
				</div>
			</div>
		</footer>
	);
}
