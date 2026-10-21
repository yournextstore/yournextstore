import { cacheLife } from "next/cache";
import Link from "next/link";
import { FooterNewsletter } from "@/components/footer-newsletter";
import { PaymentMethods } from "@/components/payment-methods";
import { commerce, meGetCached } from "@/lib/commerce";

const SOCIAL_LABELS = {
	instagram: "Instagram",
	tiktok: "TikTok",
	facebook: "Facebook",
	x: "X",
	youtube: "YouTube",
	linkedin: "LinkedIn",
} as const;

type FooterLink = { href: string; label: string };

// One cached read keeps the whole footer in the prerendered shell; it also pins the year.
async function getFooterData() {
	"use cache";
	cacheLife("hours");
	const [me, legal, socials, categories, collections] = await Promise.all([
		meGetCached().catch(() => null),
		commerce.legalPageBrowse().catch(() => ({ data: [] })),
		commerce.socialsGet().catch(() => null),
		commerce.categoriesBrowse({ active: true, limit: 1 }).catch(() => null),
		commerce.collectionBrowse({ limit: 1 }).catch(() => null),
	]);
	const tools = me?.store.settings?.enabledTools;
	const socialLinks: FooterLink[] = socials
		? Object.entries(SOCIAL_LABELS).flatMap(([key, label]) => {
				const href = socials.socials[key as keyof typeof SOCIAL_LABELS];
				return href ? [{ href, label }] : [];
			})
		: [];
	return {
		description: me?.store.settings?.storeDescription || null,
		year: new Date().getFullYear(),
		socialLinks,
		legal: legal.data.map((page) => ({ href: `/legal${page.href}`, label: page.label })),
		shop: [
			{ href: "/products", label: "All Products" },
			...(categories?.data.length ? [{ href: "/categories", label: "Categories" }] : []),
			...(collections?.data.length ? [{ href: "/collections", label: "Collections" }] : []),
			{ href: "/products?sort=newest", label: "New Arrivals" },
		],
		support: [
			{ href: "/about", label: "About Us" },
			...(tools?.contactForm ? [{ href: "/contact", label: "Contact Us" }] : []),
			{ href: "/faq", label: "FAQ" },
			...(tools?.blog ? [{ href: "/blog", label: "Blog" }] : []),
		],
	};
}

function FooterColumn({ title, links }: { title: string; links: FooterLink[] }) {
	return (
		<div className="flex flex-col gap-4">
			<h2 className="text-base font-semibold text-ink-foreground">{title}</h2>
			<ul className="flex flex-col gap-2">
				{links.map((link) => (
					<li key={link.label}>
						<Link
							href={link.href}
							className="text-sm text-ink-muted transition-colors hover:text-ink-foreground"
						>
							{link.label}
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}

export async function Footer({ storeName }: { storeName: string }) {
	const data = await getFooterData();

	return (
		<footer className="mt-auto bg-ink text-ink-foreground">
			<div className="mx-auto w-full max-w-7xl px-4 md:px-6 lg:px-8">
				<div className="grid grid-cols-1 gap-8 py-12 md:grid-cols-2 lg:grid-cols-4">
					<div className="flex flex-col gap-4">
						<Link href="/" className="text-lg font-semibold text-ink-foreground">
							{storeName}
						</Link>
						<p className="text-sm text-ink-muted">
							{data.description ?? "Colourful furniture and decor for children's rooms."}
						</p>
						{data.socialLinks.length > 0 && (
							<ul className="flex flex-wrap gap-x-4 gap-y-1">
								{data.socialLinks.map((link) => (
									<li key={link.label}>
										<a
											href={link.href}
											target="_blank"
											rel="noopener noreferrer"
											className="text-sm text-ink-foreground transition-colors hover:text-brand-display"
										>
											{link.label}
										</a>
									</li>
								))}
							</ul>
						)}
					</div>
					<FooterColumn title="Shop" links={data.shop} />
					<FooterColumn title="Support" links={data.support} />
					<div className="flex flex-col gap-4">
						<h2 className="text-base font-semibold text-ink-foreground">Newsletter</h2>
						<p className="text-sm text-ink-muted">Subscribe to get new arrivals and updates.</p>
						<FooterNewsletter />
					</div>
				</div>

				<div className="flex flex-col items-center justify-between gap-4 border-t border-ink-line py-6 md:flex-row">
					<p className="text-sm text-ink-muted">
						&copy; {data.year} {storeName}. All rights reserved.
					</p>
					<div className="flex flex-col items-center gap-4 md:flex-row md:gap-6">
						{data.legal.length > 0 && (
							<ul className="flex flex-wrap justify-center gap-x-6 gap-y-2">
								{data.legal.map((link) => (
									<li key={link.label}>
										<Link
											href={link.href}
											className="text-sm text-ink-muted transition-colors hover:text-ink-foreground"
										>
											{link.label}
										</Link>
									</li>
								))}
							</ul>
						)}
						<PaymentMethods />
					</div>
				</div>
			</div>
		</footer>
	);
}
