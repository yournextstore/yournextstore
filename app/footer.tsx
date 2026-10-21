import { cacheLife } from "next/cache";
import Link from "next/link";
import { PaymentMethods } from "@/components/payment-methods";
import { commerce, meGetCached } from "@/lib/commerce";

type FooterLink = { href: string; label: string; external?: boolean };

// Text labels rather than brand marks: lucide no longer ships logos, and drawing them is off-limits.
const SOCIALS: Record<string, string> = {
	instagram: "Instagram",
	tiktok: "TikTok",
	facebook: "Facebook",
	x: "X",
	youtube: "YouTube",
	linkedin: "LinkedIn",
	email: "Email",
};

async function getFooterData() {
	"use cache";
	cacheLife("hours");

	const [me, legal, socials] = await Promise.all([
		meGetCached().catch(() => null),
		commerce.legalPageBrowse().catch(() => ({ data: [] })),
		commerce.socialsGet().catch(() => null),
	]);
	const tools = me?.store.settings?.enabledTools;

	const customerServices: FooterLink[] = [
		{ href: "/faq", label: "FAQs" },
		...(tools?.contactForm ? [{ href: "/contact", label: "Contact" }] : []),
		...legal.data.map((page) => ({ href: `/legal${page.href}`, label: page.label })),
	];
	const about: FooterLink[] = [
		{ href: "/about", label: "About us" },
		{ href: "/products", label: "All products" },
		...(tools?.blog ? [{ href: "/blog", label: "Blog" }] : []),
	];
	const connect: FooterLink[] = socials
		? Object.keys(SOCIALS).flatMap((key) => {
				const value = socials.socials[key as keyof typeof socials.socials];
				if (!value) return [];
				return [
					{
						href: key === "email" && !value.startsWith("mailto:") ? `mailto:${value}` : value,
						label: SOCIALS[key] ?? key,
						external: true,
					},
				];
			})
		: [];

	return {
		storeName: me?.store.settings?.storeName || me?.store.name || "Your Next Store",
		year: new Date().getFullYear(),
		columns: [
			{ title: "Customer services", links: customerServices },
			{ title: "About", links: about },
			...(connect.length > 0 ? [{ title: "Connect", links: connect }] : []),
		],
	};
}

/** The original's footer: bordered link columns side by side, then a bordered copyright row. */
export async function Footer() {
	const { storeName, year, columns } = await getFooterData();

	return (
		<footer className="page-x bg-background py-4 lg:py-8">
			<div
				className={
					columns.length === 3 ? "grid grid-cols-1 lg:grid-cols-3" : "grid grid-cols-1 lg:grid-cols-2"
				}
			>
				{columns.map((column) => (
					<div key={column.title} className="rounded-sm border border-border p-6">
						<h2 className="mb-3 text-label-lg font-medium uppercase">{column.title}</h2>
						<nav aria-label={column.title} className="space-y-3">
							{column.links.map((link) =>
								link.external ? (
									<a
										key={link.href}
										href={link.href}
										target="_blank"
										rel="noopener noreferrer"
										className="block text-label hover:underline"
									>
										{link.label}
									</a>
								) : (
									<Link key={link.href} href={link.href} className="block text-label hover:underline">
										{link.label}
									</Link>
								),
							)}
						</nav>
					</div>
				))}
			</div>
			<div className="flex flex-col items-center justify-center gap-4 rounded-sm border border-border px-6 py-6 sm:flex-row sm:gap-8">
				<p className="text-label font-light text-muted-foreground">
					&copy; {year} {storeName}
				</p>
				<PaymentMethods />
			</div>
		</footer>
	);
}
