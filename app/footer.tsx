import { cacheLife } from "next/cache";
import Link from "next/link";
import { PaymentMethods } from "@/components/payment-methods";
import { Newsletter } from "@/components/sections/newsletter";
import { getCatalogCategories, getStoreIdentity } from "@/lib/catalog";
import { commerce } from "@/lib/commerce";

type FooterLink = { href: string; label: string; external?: boolean };

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
	const [identity, categories, collections, legal, socials] = await Promise.all([
		getStoreIdentity(),
		getCatalogCategories(),
		commerce.collectionBrowse({ limit: 4 }).catch(() => ({ data: [] })),
		commerce.legalPageBrowse().catch(() => ({ data: [] })),
		commerce.socialsGet().catch(() => null),
	]);

	const shop: FooterLink[] = [
		{ href: "/products", label: "All products" },
		...categories
			.slice(0, 3)
			.map((category) => ({ href: `/category/${category.slug}`, label: category.name })),
	];
	const help: FooterLink[] = [
		{ href: "/about", label: "About" },
		{ href: "/faq", label: "FAQ" },
		...(identity.contactFormEnabled ? [{ href: "/contact", label: "Contact us" }] : []),
		...(identity.blogEnabled ? [{ href: "/blog", label: "Blog" }] : []),
		{ href: "/account", label: "My account", external: true },
	];
	const columns = [
		{ title: "Shop", links: shop },
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
		{ title: "Help", links: help },
		...(legal.data.length > 0
			? [
					{
						title: "Legal",
						links: legal.data.map((page) => ({ href: `/legal${page.href}`, label: page.label })),
					},
				]
			: []),
	];
	const socialLinks = Object.entries(socials?.socials ?? {})
		.filter(
			(entry): entry is [keyof typeof SOCIAL_LABELS, string] =>
				Boolean(entry[1]) && entry[0] in SOCIAL_LABELS,
		)
		.map(([key, value]) => ({
			label: SOCIAL_LABELS[key],
			href: key === "email" && !value.startsWith("mailto:") ? `mailto:${value}` : value,
		}));

	return { identity, columns, socialLinks, year: new Date().getFullYear() };
}

function FooterColumn({ title, links }: { title: string; links: FooterLink[] }) {
	return (
		<section className="mt-5 flex flex-col">
			<h2 className="mb-6 text-sm font-medium tracking-widest uppercase md:text-base">{title}</h2>
			<ul className="flex flex-col gap-4">
				{links.map((link) => (
					<li key={link.href}>
						{/* /account is a proxied zone: a plain <a>, never a soft navigation. */}
						{link.external ? (
							<a
								href={link.href}
								className="text-sm text-muted-foreground transition-colors hover:text-black md:text-base"
							>
								{link.label}
							</a>
						) : (
							<Link
								href={link.href}
								className="capitalize-first inline-block text-sm text-muted-foreground transition-colors hover:text-black md:text-base"
							>
								{link.label}
							</Link>
						)}
					</li>
				))}
			</ul>
		</section>
	);
}

export async function Footer() {
	const { identity, columns, socialLinks, year } = await getFooterData();

	return (
		<footer className="mt-10">
			<div className="relative">
				<div className="absolute bottom-0 h-1/2 w-full bg-pill" />
				<div className="px-4">
					<Newsletter />
				</div>
			</div>
			<div className="bg-pill px-4 pt-8 pb-4 md:pt-[50px]">
				<div className="mx-auto max-w-[77.5rem]">
					<div className="mb-8 lg:grid lg:grid-cols-12">
						<div className="flex flex-col lg:col-span-3 lg:max-w-[248px]">
							<Link
								href="/"
								className="font-display mb-6 text-[1.75rem] leading-none break-words lg:text-display-sm"
							>
								{identity.storeName}
							</Link>
							<p className="mb-9 text-sm text-muted-foreground">
								{identity.storeDescription ??
									"Pieces that suit your style and that you are proud to wear, chosen with care."}
							</p>
							{socialLinks.length > 0 && (
								<ul className="flex flex-wrap gap-2">
									{socialLinks.map((social) => (
										<li key={social.label}>
											<a
												href={social.href}
												target="_blank"
												rel="noreferrer"
												className="flex h-7 items-center rounded-full border border-black/20 bg-white px-3 text-xs font-medium transition-colors hover:bg-black hover:text-white"
											>
												{social.label}
											</a>
										</li>
									))}
								</ul>
							)}
						</div>
						<nav
							aria-label="Footer"
							className="grid grid-cols-2 gap-x-4 sm:grid-cols-4 lg:col-span-9 lg:pl-10"
						>
							{columns.map((column) => (
								<FooterColumn key={column.title} title={column.title} links={column.links} />
							))}
						</nav>
					</div>
					<hr className="mb-6 border-black/10" />
					<div className="mb-2 flex flex-col items-center justify-center gap-4 sm:flex-row sm:justify-between">
						<p className="text-center text-sm text-muted-foreground sm:text-left">
							{identity.storeName} © {year}. All rights reserved.
						</p>
						<PaymentMethods />
					</div>
				</div>
			</div>
		</footer>
	);
}
