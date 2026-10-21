import { cacheLife } from "next/cache";
import Link from "next/link";
import { PaymentMethods } from "@/components/payment-methods";
import { getStoreIdentity } from "@/lib/catalog";
import { commerce } from "@/lib/commerce";

const SOCIAL_LABELS = {
	instagram: "Instagram",
	facebook: "Facebook",
	tiktok: "TikTok",
	youtube: "YouTube",
	x: "X",
	linkedin: "LinkedIn",
	email: "Email",
} as const;

async function getFooterData() {
	"use cache";
	cacheLife("hours");
	const [legal, socials] = await Promise.all([
		commerce.legalPageBrowse().catch(() => ({ data: [] })),
		commerce.socialsGet().catch(() => null),
	]);
	const links = Object.entries(SOCIAL_LABELS).flatMap(([key, label]) => {
		const value = socials?.socials?.[key as keyof typeof SOCIAL_LABELS];
		if (!value) return [];
		return [{ label, href: key === "email" && !value.startsWith("mailto:") ? `mailto:${value}` : value }];
	});
	return { legal: legal.data, socials: links };
}

// `new Date()` is an unstable value: now that the footer is part of the prerendered
// shell, reading it during the prerender is an error. Caching pins it to the entry.
async function getCopyrightYear() {
	"use cache";
	cacheLife("days");
	return new Date().getFullYear();
}

/** The original's tinted colophon band: mono small caps, house links on one side, socials on the other. */
export async function Footer() {
	const [year, identity, { legal, socials }] = await Promise.all([
		getCopyrightYear(),
		getStoreIdentity(),
		getFooterData(),
	]);
	const house = [
		{ label: "All pieces", href: "/products" },
		{ label: "About", href: "/about" },
		{ label: "Questions", href: "/faq" },
		...(identity.contactFormEnabled ? [{ label: "Contact", href: "/contact" }] : []),
		...(identity.blogEnabled ? [{ label: "Journal", href: "/blog" }] : []),
	];

	return (
		<footer className="mt-20 border-t border-line bg-tint">
			<div className="eti mx-auto flex max-w-[1240px] flex-col gap-5 px-4 py-6 text-faint sm:px-6">
				<div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
					<nav aria-label="The house">
						<ul className="flex flex-wrap gap-x-5 gap-y-1.5">
							{house.map((link) => (
								<li key={link.href}>
									<Link href={link.href} className="inline-block py-1 text-soft transition hover:text-acc">
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</nav>
					{socials.length > 0 ? (
						<ul className="flex flex-wrap gap-x-5 gap-y-1.5">
							{socials.map((social, index) => (
								<li key={social.href}>
									<a
										href={social.href}
										target="_blank"
										rel="noopener noreferrer"
										className={
											index === socials.length - 1
												? "inline-block py-1 text-acc hover:text-acc-deep"
												: "inline-block py-1 text-soft transition hover:text-acc"
										}
									>
										{social.label}
									</a>
								</li>
							))}
						</ul>
					) : null}
				</div>
				<div className="flex flex-col gap-3 border-t border-line pt-5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
					<span>
						© {year} {identity.storeName} · The register
					</span>
					{legal.length > 0 ? (
						<ul className="flex flex-wrap gap-x-5 gap-y-1.5">
							{legal.map((page) => (
								<li key={page.id}>
									<Link href={`/legal${page.href}`} className="inline-block py-1 transition hover:text-acc">
										{page.label}
									</Link>
								</li>
							))}
						</ul>
					) : null}
					<PaymentMethods className="gap-1.5" />
				</div>
			</div>
		</footer>
	);
}
