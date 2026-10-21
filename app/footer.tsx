import { cacheLife } from "next/cache";
import Link from "next/link";
import { Fragment } from "react";
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

	const [me, legal, socials, collections] = await Promise.all([
		meGetCached().catch(() => null),
		commerce.legalPageBrowse().catch(() => ({ data: [] })),
		commerce.socialsGet().catch(() => null),
		commerce.collectionBrowse({ limit: 10 }).catch(() => ({ data: [] })),
	]);
	const tools = me?.store.settings?.enabledTools;

	const shop: FooterLink[] = [
		{ href: "/products", label: "Shop" },
		{ href: "/about", label: "About" },
		{ href: "/faq", label: "FAQ" },
		...(tools?.contactForm ? [{ href: "/contact", label: "Contact" }] : []),
		...(tools?.blog ? [{ href: "/blog", label: "Journal" }] : []),
	];

	const socialLinks: FooterLink[] = socials
		? Object.entries(SOCIAL_LABELS).flatMap(([key, label]) => {
				const href = socials.socials[key as keyof typeof SOCIAL_LABELS];
				return href ? [{ href, label, external: true }] : [];
			})
		: [];
	const collectionLinks: FooterLink[] = collections.data
		.filter(
			(collection) =>
				collection.active &&
				(collection.productCollections.length > 0 || (collection.metafieldRules?.length ?? 0) > 0),
		)
		.slice(0, 4)
		.map((collection) => ({ href: `/collection/${collection.slug}`, label: collection.name }));

	return {
		storeName: me?.store.name || "Your Next Store",
		year: new Date().getFullYear(),
		shop,
		// No social profiles configured: the middle column points into the catalog instead.
		second:
			socialLinks.length > 0
				? { title: "Follow us", links: socialLinks }
				: { title: "Collections", links: collectionLinks },
		legal: legal.data.map((page) => ({ href: `/legal${page.href}`, label: page.label })),
	};
}

// The original sets each column's links in two short stacks side by side.
function LinkColumns({ links }: { links: FooterLink[] }) {
	const half = Math.ceil(links.length / 2);
	const stacks = [links.slice(0, half), links.slice(half)].filter((stack) => stack.length > 0);
	return (
		<div className="flex gap-x-12 text-ink-soft">
			{stacks.map((stack) => (
				<ul key={stack[0]?.href} className="flex flex-col gap-3">
					{stack.map((link) => (
						<li key={link.href}>
							{link.external ? (
								<a
									href={link.href}
									target="_blank"
									rel="noopener noreferrer"
									className="transition-colors hover:text-foreground"
								>
									{link.label}
								</a>
							) : (
								<Link href={link.href} className="transition-colors hover:text-foreground">
									{link.label}
								</Link>
							)}
						</li>
					))}
				</ul>
			))}
		</div>
	);
}

export async function Footer() {
	const { storeName, year, shop, second, legal } = await getFooterData();

	return (
		<footer className="pt-12">
			<div className="container-wide mb-12 py-12">
				<div className="grid gap-y-12 sm:grid-cols-2 md:grid-cols-3 md:gap-x-4">
					<div>
						<p className="mb-6 font-serif text-display-1">{storeName}</p>
						<LinkColumns links={shop} />
					</div>
					{second.links.length > 0 && (
						<div>
							<p className="mb-6 font-serif text-display-1">{second.title}</p>
							<LinkColumns links={second.links} />
						</div>
					)}
					<div className="sm:col-span-2 md:col-span-1">
						<p className="mb-4 font-serif text-display-1">Newsletter</p>
						<NewsletterForm />
					</div>
				</div>
			</div>
			<div className="md:pt-12">
				<div className="bg-tint">
					<div className="container-wide flex flex-col items-center justify-between gap-4 py-6 md:flex-row md:py-4">
						<ul className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-caption text-brand uppercase">
							{legal.map((link, index) => (
								<Fragment key={link.href}>
									{index > 0 && (
										<li aria-hidden="true" className="px-0.5">
											-
										</li>
									)}
									<li>
										<Link href={link.href} className="hover:underline">
											{link.label}
										</Link>
									</li>
								</Fragment>
							))}
						</ul>
						<div className="flex flex-col items-center gap-4 md:flex-row md:gap-6">
							<PaymentMethods />
							<p className="text-caption text-brand uppercase">
								&copy; {year} {storeName}.
							</p>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}
