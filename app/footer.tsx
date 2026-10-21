import { cacheLife } from "next/cache";
import Link from "next/link";
import { ChevronDownIcon } from "@/components/icons";
import { PaymentMethods } from "@/components/payment-methods";
import { getStoreName } from "@/lib/catalog";
import { commerce, meGetCached } from "@/lib/commerce";

type FooterLink = { href: string; label: string; external?: boolean; plain?: boolean };
type FooterColumn = { title: string; links: FooterLink[] };

const SOCIAL_LABELS = {
	linkedin: "LinkedIn",
	facebook: "Facebook",
	x: "X",
	instagram: "Instagram",
	youtube: "YouTube",
	tiktok: "TikTok",
} as const;

// `new Date()` is an unstable value inside the prerendered shell; caching pins it.
async function getFooterData() {
	"use cache";
	cacheLife("hours");

	const [me, storeName, categories, collections, legal, socials] = await Promise.all([
		meGetCached().catch(() => null),
		getStoreName(),
		commerce.categoriesBrowse({ active: true, limit: 20 }).catch(() => ({ data: [] })),
		commerce.collectionBrowse({ limit: 20 }).catch(() => ({ data: [] })),
		commerce.legalPageBrowse().catch(() => ({ data: [] })),
		commerce.socialsGet().catch(() => null),
	]);
	const tools = me?.store.settings?.enabledTools;

	const columns: FooterColumn[] = [
		{
			title: "Categories",
			links: categories.data
				.filter((category) => !category.parentId)
				.slice(0, 5)
				.map((category) => ({ href: `/category/${category.slug}`, label: category.name })),
		},
		{
			title: "Collections",
			links: collections.data
				.filter(
					(collection) =>
						collection.active &&
						(collection.productCollections.length > 0 || (collection.metafieldRules?.length ?? 0) > 0),
				)
				.slice(0, 5)
				.map((collection) => ({ href: `/collection/${collection.slug}`, label: collection.name })),
		},
		{
			title: "About",
			links: [
				{ href: "/about", label: "About us" },
				{ href: "/products", label: "All products" },
				...(tools?.blog ? [{ href: "/blog", label: "Blog" }] : []),
			],
		},
		{
			title: "Need help?",
			links: [
				{ href: "/faq", label: "FAQs" },
				{ href: "/account", label: "My account", plain: true },
				...(tools?.contactForm ? [{ href: "/contact", label: "Contact us" }] : []),
			],
		},
	].filter((column) => column.links.length > 0);

	const socialLinks: FooterLink[] = socials
		? Object.entries(SOCIAL_LABELS).flatMap(([key, label]) => {
				const href = socials.socials[key as keyof typeof SOCIAL_LABELS];
				return href ? [{ href, label, external: true }] : [];
			})
		: [];

	return {
		storeName,
		columns,
		socialLinks,
		legal: legal.data.map((page) => ({ href: `/legal${page.href}`, label: page.label })),
		year: new Date().getFullYear(),
	};
}

const linkClass = "w-max text-copy text-ink-muted transition-colors hover:text-ink-foreground";

function FooterAnchor({ link }: { link: FooterLink }) {
	if (link.external) {
		return (
			<a href={link.href} target="_blank" rel="noreferrer" className={linkClass}>
				{link.label}
			</a>
		);
	}
	if (link.plain) {
		// /account is a proxied zone: plain <a>, never <Link> (see AGENTS.md).
		return (
			<a href={link.href} className={linkClass}>
				{link.label}
			</a>
		);
	}
	return (
		<Link href={link.href} className={linkClass}>
			{link.label}
		</Link>
	);
}

export async function Footer() {
	const { storeName, columns, socialLinks, legal, year } = await getFooterData();

	return (
		<footer className="bg-ink text-ink-foreground">
			<div className="shell section-y flex flex-col gap-6 sm:gap-12">
				<div className="flex flex-col gap-8 sm:gap-12 large:flex-row wide:gap-0">
					<div className="flex flex-col justify-between gap-8 wide:min-w-[27.3rem]">
						<Link
							href="/"
							className="w-max max-w-full truncate text-[1.75rem] font-medium uppercase leading-none tracking-[0.06em]"
						>
							{storeName}
						</Link>
						{socialLinks.length > 0 && (
							<ul className="flex flex-wrap gap-x-6 gap-y-2">
								{socialLinks.map((link) => (
									<li key={link.href}>
										<FooterAnchor link={link} />
									</li>
								))}
							</ul>
						)}
					</div>

					{/* 640px and up: four link columns side by side. */}
					<div className="hidden shrink grow gap-5 sm:flex wide:gap-0">
						{columns.map((column) => (
							<div key={column.title} className="flex flex-1 flex-col gap-3">
								<h2 className="mb-2 text-lead">{column.title}</h2>
								{column.links.map((link) => (
									<FooterAnchor key={link.href} link={link} />
								))}
							</div>
						))}
					</div>

					{/* Phones: the original's accordion, as native disclosure widgets. */}
					<div className="flex flex-col gap-6 sm:hidden">
						{columns.map((column) => (
							<details key={column.title} className="group">
								<summary className="flex cursor-pointer list-none items-center justify-between [&::-webkit-details-marker]:hidden">
									<h2 className="text-copy">{column.title}</h2>
									<span className="flex size-12 items-center justify-center transition-transform duration-200 group-open:rotate-180">
										<ChevronDownIcon className="size-5" />
									</span>
								</summary>
								<div className="flex flex-col gap-3 pb-4">
									{column.links.map((link) => (
										<FooterAnchor key={link.href} link={link} />
									))}
								</div>
							</details>
						))}
					</div>
				</div>

				<hr className="border-ink-border" />

				<div className="flex flex-col gap-6 large:flex-row large:items-center large:justify-between">
					<div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6">
						<p className="text-copy text-ink-muted">
							&copy; {year} {storeName}. All rights reserved.
						</p>
						{legal.map((page) => (
							<Link key={page.href} href={page.href} className={linkClass}>
								{page.label}
							</Link>
						))}
					</div>
					<PaymentMethods />
				</div>
			</div>
		</footer>
	);
}
