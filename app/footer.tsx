import { cacheLife } from "next/cache";
import Link from "next/link";
import { BrandMark } from "@/components/njx/brand-mark";
import { PaymentMethods } from "@/components/payment-methods";
import { getCollections, getStoreInfo, monogram } from "@/lib/catalog";
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

	const [store, collections, legal, me] = await Promise.all([
		getStoreInfo(),
		getCollections(),
		commerce.legalPageBrowse().catch(() => ({ data: [] })),
		meGetCached().catch(() => null),
	]);
	const socials = me?.store.settings?.socials ?? {};
	const socialLinks: FooterLink[] = Object.entries(SOCIAL_LABELS).flatMap(([key, label]) => {
		const url = socials[key as keyof typeof SOCIAL_LABELS];
		return url ? [{ href: url, label, external: true }] : [];
	});
	const columns = [
		{
			title: "Shop",
			links: [
				{ href: "/products", label: "All products" },
				...collections.slice(0, 4).map((c) => ({ href: `/collection/${c.slug}`, label: c.name })),
			],
		},
		{
			title: "Pages",
			links: [
				{ href: "/about", label: "About" },
				{ href: "/faq", label: "FAQ" },
				...(store.contactForm ? [{ href: "/contact", label: "Contact" }] : []),
				...(store.blog ? [{ href: "/blog", label: "Journal" }] : []),
			],
		},
		...(socialLinks.length > 0 ? [{ title: "More", links: socialLinks }] : []),
	];

	return {
		store,
		columns,
		legalLinks: legal.data.map((page) => ({ href: `/legal${page.href}`, label: page.label })),
		// `new Date()` must be pinned to the cache entry: the footer is part of the prerendered shell.
		year: new Date().getFullYear(),
	};
}

export async function Footer() {
	const { store, columns, legalLinks, year } = await getFooterData();

	return (
		<footer className="mx-auto mt-4 w-full max-w-6xl px-3 pb-8 sm:mt-8 sm:px-5">
			<div className="rounded-2xl border border-line bg-tile/60">
				<div className="grid gap-8 px-5 py-8 sm:grid-cols-[1.2fr_1fr] sm:gap-10 sm:px-10 sm:py-12">
					<div>
						<p className="flex items-center gap-2 font-display text-xl font-bold">
							<BrandMark letter={monogram(store.name)} className="h-7 w-7 rounded-md text-[16px]" />
							{store.name}
						</p>
						<p className="mt-3 max-w-[36ch] text-[14px] leading-relaxed text-muted-foreground">
							{store.description ?? "Good things for every day, in one short list."}
						</p>
					</div>
					<nav className="flex flex-wrap gap-x-14 gap-y-8 text-[14px] sm:justify-end" aria-label="Footer">
						{columns.map((column) => (
							<div key={column.title} className="min-w-28">
								<h2 className="font-semibold">{column.title}</h2>
								<ul className="mt-3 space-y-2 text-muted-foreground">
									{column.links.map((link: FooterLink) => (
										<li key={link.href}>
											{link.external ? (
												<a
													href={link.href}
													target="_blank"
													rel="noopener"
													className="underline-offset-4 hover:text-ink hover:underline"
												>
													{link.label}
												</a>
											) : (
												<Link
													href={link.href}
													data-nav-link
													className="underline-offset-4 hover:text-ink hover:underline aria-[current=page]:font-semibold aria-[current=page]:text-ink aria-[current=page]:underline"
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
				<div className="flex flex-col-reverse items-center gap-y-4 border-t border-line px-5 py-4 sm:flex-row sm:flex-wrap sm:justify-between sm:gap-x-8 sm:px-10 sm:py-5">
					<div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[13px] text-muted-foreground">
						<span>
							© {year} {store.name}
						</span>
						{legalLinks.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								data-nav-link
								className="underline-offset-4 hover:text-ink hover:underline aria-[current=page]:font-semibold aria-[current=page]:text-ink aria-[current=page]:underline"
							>
								{link.label}
							</Link>
						))}
					</div>
					<PaymentMethods className="justify-center" />
				</div>
			</div>
		</footer>
	);
}
