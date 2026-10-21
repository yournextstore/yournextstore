import { cacheLife } from "next/cache";
import Link from "next/link";
import { PaymentMethods } from "@/components/payment-methods";
import { commerce, meGetCached } from "@/lib/commerce";

type FooterLink = { href: string; label: string; external?: boolean };

const SOCIAL_LABELS = {
	instagram: "Instagram",
	facebook: "Facebook",
	tiktok: "TikTok",
	youtube: "YouTube",
	x: "X",
	linkedin: "LinkedIn",
} as const;

async function getFooterData() {
	"use cache";
	cacheLife("hours");

	const [me, collections, legal, socials] = await Promise.all([
		meGetCached().catch(() => null),
		commerce.collectionBrowse({ limit: 6 }).catch(() => ({ data: [] })),
		commerce.legalPageBrowse().catch(() => ({ data: [] })),
		commerce.socialsGet().catch(() => null),
	]);
	const tools = me?.store.settings?.enabledTools;
	const storeName = me?.store.settings?.storeName || me?.store.name || "Store";

	const shop: FooterLink[] = [
		{ href: "/products", label: "Shop all" },
		...collections.data
			.filter((c) => c.productCollections.length > 0)
			.map((c) => ({ href: `/collection/${c.slug}`, label: c.name })),
	];
	const store: FooterLink[] = [
		{ href: "/about", label: "About" },
		{ href: "/faq", label: "FAQ" },
		...(tools?.contactForm ? [{ href: "/contact", label: "Contact" }] : []),
		...(tools?.blog ? [{ href: "/blog", label: "Journal" }] : []),
	];
	const follow: FooterLink[] = Object.entries(SOCIAL_LABELS).flatMap(([key, label]) => {
		const url = socials?.socials?.[key as keyof typeof SOCIAL_LABELS];
		return url ? [{ href: url, label, external: true }] : [];
	});

	return {
		storeName,
		tagline:
			me?.store.settings?.storeDescription ||
			"Botanical skincare in small batches. Every ingredient listed, plainly described.",
		columns: [
			{ title: "Shop", links: shop },
			{ title: "Atelier", links: store },
			...(follow.length > 0 ? [{ title: "Follow", links: follow }] : []),
		],
		legal: legal.data.map((page) => ({ href: `/legal${page.href}`, label: page.label })),
	};
}

// `new Date()` is an unstable value: now that the footer is part of the prerendered
// shell, reading it during the prerender is an error. Caching pins it to the entry.
export async function getCopyrightYear() {
	"use cache";
	cacheLife("days");

	return new Date().getFullYear();
}

/** Always espresso-dark, whatever the theme (`.site-footer` remaps the tokens locally). */
export async function Footer() {
	const [{ storeName, tagline, columns, legal }, year] = await Promise.all([
		getFooterData(),
		getCopyrightYear(),
	]);

	return (
		<footer className="site-footer w-full border-t border-border">
			<div className="mx-auto max-w-6xl">
				<div className="grid gap-8 px-5 py-8 sm:grid-cols-[1.2fr_1fr] sm:gap-10 sm:px-10 sm:py-12">
					<div>
						<p className="flex items-center gap-2 font-display text-xl font-bold">
							<span
								aria-hidden
								className="flex h-7 w-7 items-center justify-center rounded-md bg-card text-[15px] font-extrabold text-brass"
							>
								{storeName.charAt(0).toUpperCase()}
							</span>
							{storeName}
						</p>
						<p className="mt-3 max-w-[36ch] text-[14px] leading-relaxed text-muted-foreground">{tagline}</p>
					</div>
					<nav
						aria-label="Footer"
						className={
							columns.length > 2
								? "grid grid-cols-2 gap-8 text-[14px] sm:grid-cols-3"
								: "grid grid-cols-2 gap-8 text-[14px]"
						}
					>
						{columns.map((col) => (
							<div key={col.title}>
								<p className="font-semibold">{col.title}</p>
								<ul className="mt-3 space-y-2 text-muted-foreground">
									{col.links.map((link) => (
										<li key={link.href}>
											{link.external ? (
												<a
													href={link.href}
													target="_blank"
													rel="noopener noreferrer"
													className="underline-offset-4 hover:text-foreground hover:underline"
												>
													{link.label}
												</a>
											) : (
												<Link
													href={link.href}
													className="underline-offset-4 hover:text-foreground hover:underline"
												>
													{link.label}
												</Link>
											)}
										</li>
									))}
								</ul>
							</div>
						))}
					</nav>
				</div>
				{/* Mobile: reversed column — payment marks on top, legal links below. */}
				<div className="flex flex-col-reverse items-center gap-y-4 border-t border-border px-5 py-4 sm:flex-row sm:flex-wrap sm:justify-between sm:gap-x-8 sm:px-10 sm:py-5">
					<div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[13px] text-muted-foreground">
						<span>
							&copy; {year} {storeName}
						</span>
						{legal.map((page) => (
							<Link
								key={page.href}
								href={page.href}
								className="underline-offset-4 hover:text-foreground hover:underline"
							>
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
