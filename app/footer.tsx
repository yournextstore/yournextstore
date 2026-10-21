import { cacheLife } from "next/cache";
import Link from "next/link";
import { PaymentMethods } from "@/components/payment-methods";
import { commerce, meGetCached } from "@/lib/commerce";

type FooterLink = { href: string; label: string };

// Text labels rather than brand marks: lucide no longer ships logos, and drawing them is off-limits.
const SOCIALS: Record<string, { label: string }> = {
	instagram: { label: "Instagram" },
	tiktok: { label: "TikTok" },
	facebook: { label: "Facebook" },
	x: { label: "X" },
	youtube: { label: "YouTube" },
	linkedin: { label: "LinkedIn" },
	email: { label: "Email" },
};

async function getFooterData() {
	"use cache";
	cacheLife("hours");

	const [me, legal, socials, categories, collections] = await Promise.all([
		meGetCached().catch(() => null),
		commerce.legalPageBrowse().catch(() => ({ data: [] })),
		commerce.socialsGet().catch(() => null),
		commerce.categoriesBrowse({ active: true, limit: 50 }).catch(() => ({ data: [] })),
		commerce.collectionBrowse({ limit: 5 }).catch(() => ({ data: [] })),
	]);
	const tools = me?.store.settings?.enabledTools;

	const shop: FooterLink[] = [
		{ href: "/products", label: "All products" },
		...categories.data
			.filter((category) => !category.parentId)
			.slice(0, 4)
			.map((category) => ({ href: `/category/${category.slug}`, label: category.name })),
	];
	const collectionLinks: FooterLink[] = collections.data
		.filter((collection) => collection.active)
		.map((collection) => ({ href: `/collection/${collection.slug}`, label: collection.name }));
	const help: FooterLink[] = [
		{ href: "/about", label: "About us" },
		{ href: "/faq", label: "FAQ" },
		...(tools?.contactForm ? [{ href: "/contact", label: "Contact" }] : []),
		...(tools?.blog ? [{ href: "/blog", label: "Journal" }] : []),
	];
	const policies: FooterLink[] = legal.data.map((page) => ({
		href: `/legal${page.href}`,
		label: page.label,
	}));
	const socialLinks = socials
		? Object.keys(SOCIALS).flatMap((key) => {
				const value = socials.socials[key as keyof typeof socials.socials];
				if (!value) return [];
				return [{ key, href: key === "email" && !value.startsWith("mailto:") ? `mailto:${value}` : value }];
			})
		: [];

	return {
		storeName: me?.store.settings?.storeName || me?.store.name || "Your Next Store",
		description:
			me?.store.settings?.storeDescription ||
			"Considered pieces made to be worn, kept and loved, season after season.",
		year: new Date().getFullYear(),
		columns: [
			{ title: "Shop everything", links: shop },
			...(collectionLinks.length > 0 ? [{ title: "Collections", links: collectionLinks }] : []),
			{ title: "Customer care", links: help },
			...(policies.length > 0 ? [{ title: "Policies", links: policies }] : []),
		],
		socialLinks,
	};
}

export async function Footer() {
	const { storeName, description, year, columns, socialLinks } = await getFooterData();

	return (
		<footer className="bg-ink text-ink-foreground">
			<div className="page-x pt-14 pb-8 lg:pt-16">
				<div className="grid gap-10 border-b border-white/15 pb-10 lg:grid-cols-3 lg:gap-12">
					<div className="lg:col-span-1">
						<Link href="/" className="text-[1.375rem] uppercase tracking-[0.12em]">
							{storeName}
						</Link>
						<p className="mt-4 max-w-sm text-body-sm text-ink-muted line-clamp-4">{description}</p>
						{socialLinks.length > 0 && (
							<ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
								{socialLinks.map((social) => (
									<li key={social.key}>
										<a
											href={social.href}
											target="_blank"
											rel="noreferrer"
											className="text-body-sm underline-offset-4 hover:underline"
										>
											{SOCIALS[social.key]?.label}
										</a>
									</li>
								))}
							</ul>
						)}
					</div>
					<div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4 lg:col-span-2">
						{columns.map((column) => (
							<div key={column.title}>
								<h2 className="text-body uppercase tracking-wide">{column.title}</h2>
								<ul className="mt-5 space-y-3">
									{column.links.map((link) => (
										<li key={link.href}>
											<Link
												href={link.href}
												className="text-body-sm text-ink-muted transition-colors hover:text-ink-foreground hover:underline"
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
				<div className="flex flex-col items-center gap-5 pt-8 md:flex-row md:justify-between">
					<p className="text-body-sm text-ink-muted">
						&copy; {year} {storeName}. All rights reserved.
					</p>
					<PaymentMethods />
				</div>
			</div>
		</footer>
	);
}
