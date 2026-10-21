import { cacheLife } from "next/cache";
import Link from "next/link";
import { PaymentMethods } from "@/components/payment-methods";
import { Newsletter } from "@/components/sections/newsletter";
import { FooterQuarter, FooterSlab, FooterStar } from "@/components/shapes";
import { commerce, meGetCached } from "@/lib/commerce";

type FooterLink = { href: string; label: string };

// The original's round outlined social buttons, with short text labels in them: lucide no
// longer ships brand marks, and drawing them is off-limits.
const SOCIALS: Record<string, { label: string; short: string }> = {
	instagram: { label: "Instagram", short: "IG" },
	tiktok: { label: "TikTok", short: "TT" },
	facebook: { label: "Facebook", short: "FB" },
	x: { label: "X", short: "X" },
	youtube: { label: "YouTube", short: "YT" },
	linkedin: { label: "LinkedIn", short: "IN" },
};

async function getFooterData() {
	"use cache";
	cacheLife("hours");

	const [me, legal, socials, collections] = await Promise.all([
		meGetCached().catch(() => null),
		commerce.legalPageBrowse().catch(() => ({ data: [] })),
		commerce.socialsGet().catch(() => null),
		commerce.collectionBrowse({ limit: 5 }).catch(() => ({ data: [] })),
	]);
	const tools = me?.store.settings?.enabledTools;

	const primary: FooterLink[] = [
		{ href: "/products", label: "Shop" },
		...collections.data
			.filter((collection) => collection.active)
			.slice(0, 2)
			.map((collection) => ({ href: `/collection/${collection.slug}`, label: collection.name })),
		{ href: "/about", label: "About us" },
		{ href: "/faq", label: "FAQ" },
		...(tools?.blog ? [{ href: "/blog", label: "Blog" }] : []),
		...(tools?.contactForm ? [{ href: "/contact", label: "Contact us" }] : []),
	];
	const policies: FooterLink[] = legal.data.map((page) => ({
		href: `/legal${page.href}`,
		label: page.label,
	}));
	const socialLinks = socials
		? Object.entries(SOCIALS).flatMap(([key, meta]) => {
				const value = socials.socials[key as keyof typeof socials.socials];
				return value ? [{ key, href: value, ...meta }] : [];
			})
		: [];
	const email = socials?.socials.email?.replace(/^mailto:/, "") ?? null;

	return {
		storeName: me?.store.settings?.storeName || me?.store.name || "Your Next Store",
		description:
			me?.store.settings?.storeDescription ||
			"Bold basics and loud statement pieces, picked to be worn hard and loved for years.",
		contactFormEnabled: tools?.contactForm ?? false,
		year: new Date().getFullYear(),
		primary,
		policies,
		socialLinks,
		email,
	};
}

export async function Footer() {
	const { storeName, description, contactFormEnabled, year, primary, policies, socialLinks, email } =
		await getFooterData();

	return (
		<footer className="relative overflow-hidden bg-gainsboro pt-[160px]">
			<FooterStar className="absolute top-0 right-0" />
			<FooterQuarter className="absolute bottom-[100px] left-0 hidden sp-lg:block sp-xl:bottom-[160px]" />
			<FooterSlab className="absolute bottom-0 left-1/2 hidden -translate-x-1/2 sp-xl:block" />

			<div className="sp-container relative">
				<div className="mb-[60px] grid gap-[30px] text-sp-8 leading-[1.7] md:grid-cols-2 sp-xl:mb-[160px] sp-xl:grid-cols-3">
					<div>
						<Link href="/" className="font-title mb-[35px] block text-[1.625rem] leading-none">
							{storeName}
						</Link>
						<p className="line-clamp-4">{description}</p>
						{socialLinks.length > 0 && (
							<ul className="mt-[30px] flex flex-wrap gap-2.5">
								{socialLinks.map((social) => (
									<li key={social.key}>
										<a
											href={social.href}
											target="_blank"
											rel="noopener noreferrer"
											className="grid size-[52px] place-items-center rounded-full border-2 border-ink bg-background text-sm font-semibold shadow-brut-sm transition hover:-translate-y-0.5 hover:text-tangerine-ink hover:shadow-none"
										>
											<span aria-hidden="true">{social.short}</span>
											<span className="sr-only">{social.label}</span>
										</a>
									</li>
								))}
							</ul>
						)}
					</div>

					<div>
						<h2 className="font-title mb-[30px] text-sp-10">Contact info</h2>
						<ul className="space-y-[15px]">
							{email && (
								<li>
									<a href={`mailto:${email}`} className="break-all hover:text-tangerine-ink">
										{email}
									</a>
								</li>
							)}
							{contactFormEnabled && (
								<li>
									<Link href="/contact" className="hover:text-tangerine-ink">
										Send us a message
									</Link>
								</li>
							)}
							<li>
								<Link href="/faq" className="hover:text-tangerine-ink">
									Questions? Read the FAQ
								</Link>
							</li>
							<li>
								<a href="/account" className="hover:text-tangerine-ink">
									Track your order in your account
								</a>
							</li>
						</ul>
					</div>

					<Newsletter />
				</div>

				<div className="border-b-2 border-ink pb-[15px] sp-xl:flex sp-xl:justify-between sp-xl:gap-8">
					<ul className="mb-[15px] flex flex-wrap justify-center gap-x-[30px] gap-y-2.5 sp-xl:justify-start">
						{primary.map((link) => (
							<li key={link.href}>
								<Link
									href={link.href}
									className="text-xs font-semibold uppercase transition-colors hover:text-tangerine-ink sp-2xl:text-base"
								>
									{link.label}
								</Link>
							</li>
						))}
					</ul>
					{policies.length > 0 && (
						<ul className="mb-[15px] flex flex-wrap justify-center gap-x-[30px] gap-y-2.5 sp-xl:justify-end">
							{policies.map((link) => (
								<li key={link.href}>
									<Link
										href={link.href}
										className="text-xs font-semibold uppercase transition-colors hover:text-tangerine-ink sp-2xl:text-base"
									>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					)}
				</div>

				<div className="flex flex-col items-center gap-4 py-[30px] sp-xl:flex-row sp-xl:justify-between sp-xl:pb-[50px]">
					<p className="text-center text-sp-8 sp-xl:text-left">
						&copy; {year} {storeName}, All Rights Reserved
					</p>
					<PaymentMethods className="justify-center" />
				</div>
			</div>
		</footer>
	);
}
