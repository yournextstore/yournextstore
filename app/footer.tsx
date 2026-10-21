import { cacheLife } from "next/cache";
import Link from "next/link";
import { FooterNewsletter } from "@/components/footer-newsletter";
import { PaymentMethods } from "@/components/payment-methods";
import { ThemeToggle } from "@/components/theme-toggle";
import { commerce, meGetCached } from "@/lib/commerce";

const SOCIAL_LABELS = {
	instagram: "Instagram",
	facebook: "Facebook",
	x: "X",
	youtube: "YouTube",
	tiktok: "TikTok",
	linkedin: "LinkedIn",
	email: "Email",
} as const;

// `new Date()` is an unstable value; caching pins it to the entry so the footer stays in the shell.
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
	const socialLinks = Object.entries(socials?.socials ?? {})
		.filter((entry): entry is [keyof typeof SOCIAL_LABELS, string] => Boolean(entry[1]))
		.map(([key, value]) => ({
			label: SOCIAL_LABELS[key],
			href: key === "email" ? `mailto:${value}` : value,
		}));

	return {
		year: new Date().getFullYear(),
		storeName: me?.store.name || "Your Next Store",
		shop: [
			{ href: "/products", label: "Everything" },
			...collections.data
				.filter((c) => c.productCollections.length > 0)
				.map((c) => ({ href: `/collection/${c.slug}`, label: c.name })),
		],
		info: [
			{ href: "/about", label: "Our Story" },
			{ href: "/faq", label: "FAQ" },
			...(tools?.contactForm ? [{ href: "/contact", label: "Contact" }] : []),
			...(tools?.blog ? [{ href: "/blog", label: "Journal" }] : []),
			...legal.data.map((page) => ({ href: `/legal${page.href}`, label: page.label })),
		],
		socialLinks,
	};
}

function FooterMenu({ links }: { links: { href: string; label: string }[] }) {
	return (
		<ul className="flex flex-col xl:mb-8">
			{links.map((link) => (
				<li key={link.href}>
					<Link href={link.href} className="inline-block py-2 text-body transition-opacity hover:opacity-40">
						{link.label}
					</Link>
				</li>
			))}
		</ul>
	);
}

/** Four ruled blocks: newsletter, shop, info, social + theme switch. */
export async function Footer() {
	const { year, storeName, shop, info, socialLinks } = await getFooterData();

	return (
		<footer className="relative overflow-hidden border-t border-border">
			<div className="grid gap-px bg-foreground md:grid-cols-2 xl:grid-cols-4">
				<div className="flex flex-col bg-background p-8 text-center xl:text-left">
					<h2 className="mb-4 text-h3">Newsletter</h2>
					<FooterNewsletter />
				</div>
				<div className="flex flex-col bg-background p-8 text-center xl:text-left">
					<h2 className="mb-4 text-h3">Shop</h2>
					<FooterMenu links={shop} />
				</div>
				<div className="flex flex-col bg-background p-8 text-center xl:text-left">
					<h2 className="mb-4 text-h3">Info</h2>
					<FooterMenu links={info} />
				</div>
				<div className="flex flex-col bg-background p-8 text-center xl:text-left">
					<h2 className="mb-4 text-h3">{socialLinks.length > 0 ? "Get Social" : "Account"}</h2>
					{socialLinks.length > 0 ? (
						<ul className="mx-auto mb-6 flex flex-wrap justify-center gap-x-4 xl:mx-0 xl:justify-start">
							{socialLinks.map((link) => (
								<li key={link.label}>
									<a
										href={link.href}
										target="_blank"
										rel="noopener noreferrer"
										className="inline-block py-2 text-body transition-opacity hover:opacity-40"
									>
										{link.label}
									</a>
								</li>
							))}
						</ul>
					) : (
						// Plain <a>: /account is a proxied zone (see AGENTS.md).
						<a
							href="/account"
							className="mb-6 inline-block py-2 text-body transition-opacity hover:opacity-40"
						>
							Orders &amp; sign in
						</a>
					)}
					<div className="mt-auto flex flex-col items-center gap-4 xl:items-start">
						<ThemeToggle />
						<PaymentMethods />
						<p className="text-nav">
							&copy; {year} {storeName}. All Rights Reserved.
						</p>
					</div>
				</div>
			</div>
		</footer>
	);
}
