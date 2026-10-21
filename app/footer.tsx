import { cacheLife } from "next/cache";
import Link from "next/link";
import { NewsletterForm } from "@/components/newsletter-form";
import { PaymentMethods } from "@/components/payment-methods";
import { commerce } from "@/lib/commerce";
import { getStoreIdentity } from "@/lib/theme";

const linkClass = "text-sm/6 uppercase text-muted-foreground transition-colors hover:text-foreground";

async function getFooterData() {
	"use cache";
	cacheLife("hours");

	const [legal, socials] = await Promise.all([
		commerce.legalPageBrowse().catch(() => ({ data: [] })),
		commerce.socialsGet().catch(() => null),
	]);
	const socialLinks = Object.entries(socials?.socials ?? {}).flatMap(([network, url]) =>
		url && network !== "email" ? [{ network, url }] : [],
	);
	return { legal: legal.data, socialLinks };
}

// `new Date()` is an unstable value: now that the footer is part of the prerendered
// shell, reading it during the prerender is an error. Caching pins it to the entry.
async function getCopyrightYear() {
	"use cache";
	cacheLife("days");

	return new Date().getFullYear();
}

const socialLabels: Record<string, string> = {
	instagram: "Instagram",
	facebook: "Facebook",
	x: "X",
	youtube: "YouTube",
	linkedin: "LinkedIn",
	tiktok: "TikTok",
};

export async function Footer() {
	const [year, identity, { legal, socialLinks }] = await Promise.all([
		getCopyrightYear(),
		getStoreIdentity(),
		getFooterData(),
	]);

	const overview = [
		{ href: "/", label: "Home" },
		{ href: "/products", label: "Shop" },
		{ href: "/about", label: "About" },
		{ href: "/faq", label: "FAQ" },
		...(identity.blogEnabled ? [{ href: "/blog", label: "Blog" }] : []),
		...(identity.contactEnabled ? [{ href: "/contact", label: "Contact us" }] : []),
	];

	return (
		<footer className="mt-16 border-t border-border bg-background pt-16 pb-8 sm:pt-28 lg:pt-32">
			<div className="shell">
				<div className="grid gap-12 md:grid-cols-3 md:gap-8">
					<div className="max-w-sm">
						<Link href="/" className="font-serif text-[2.5rem] leading-none font-medium text-orange-ink">
							{identity.name}
						</Link>
						{identity.description && (
							<p className="mt-4 text-sm/6 text-muted-foreground">{identity.description}</p>
						)}
					</div>

					<div>
						<h2 className="text-sm/6 uppercase">Overview</h2>
						<ul className="mt-5 space-y-3">
							{overview.map((item) => (
								<li key={item.href}>
									<Link href={item.href} className={linkClass}>
										{item.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					<div className="max-w-sm">
						<NewsletterForm label="Subscribe to our newsletter" />
					</div>
				</div>

				<div className="mt-16 flex flex-col gap-6 border-t border-border pt-8 md:flex-row md:items-center md:justify-between">
					<p className="order-last text-sm/6 uppercase text-muted-foreground md:order-first">
						&copy; {year} {identity.name}. All rights reserved.
					</p>
					{legal.length > 0 && (
						<ul className="flex flex-wrap gap-x-4 gap-y-1">
							{legal.map((page) => (
								<li key={page.id}>
									<Link href={`/legal${page.href}`} className={linkClass}>
										{page.label}
									</Link>
								</li>
							))}
						</ul>
					)}
					<div className="flex flex-wrap items-center gap-x-5 gap-y-3">
						{socialLinks.map(({ network, url }) => (
							<a key={network} href={url} target="_blank" rel="noreferrer" className={linkClass}>
								{socialLabels[network] ?? network}
							</a>
						))}
						<PaymentMethods />
					</div>
				</div>
			</div>
		</footer>
	);
}
