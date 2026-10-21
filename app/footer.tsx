import { cacheLife } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { Logo } from "@/components/grilli/logo";
import { NewsletterForm } from "@/components/grilli/newsletter-form";
import { PaymentMethods } from "@/components/payment-methods";
import { getCategoryTiles, getStoreBasics } from "@/lib/catalog";
import { commerce } from "@/lib/commerce";
import { FOOTER_IMAGE } from "@/lib/editorial";

type FooterLink = { href: string; label: string; external?: boolean };

const SOCIAL_LABELS = {
	facebook: "Facebook",
	instagram: "Instagram",
	tiktok: "TikTok",
	x: "X",
	youtube: "YouTube",
	linkedin: "LinkedIn",
} as const;

// Everything the footer shows comes from cached reads, so it stays in the prerendered shell.
// `new Date()` included: caching pins the year to the entry.
async function getFooterData() {
	"use cache";
	cacheLife("hours");

	const [basics, legal, socials, categories] = await Promise.all([
		getStoreBasics(),
		commerce.legalPageBrowse().catch(() => ({ data: [] })),
		commerce.socialsGet().catch(() => null),
		getCategoryTiles(5),
	]);

	const pages: FooterLink[] = [
		{ href: "/", label: "Home" },
		{ href: "/products", label: "Shop" },
		{ href: "/about", label: "About Us" },
		{ href: "/faq", label: "FAQ" },
		...(basics.blog ? [{ href: "/blog", label: "Journal" }] : []),
		...(basics.contactForm ? [{ href: "/contact", label: "Contact" }] : []),
	];

	const socialLinks: FooterLink[] = socials
		? Object.entries(SOCIAL_LABELS).flatMap(([key, label]) => {
				const href = socials.socials[key as keyof typeof SOCIAL_LABELS];
				return href ? [{ href, label, external: true }] : [];
			})
		: [];
	// No social profiles configured: the second column points into the categories instead.
	const second: FooterLink[] =
		socialLinks.length > 0
			? socialLinks
			: categories.map((category) => ({ href: category.href, label: category.name }));

	return {
		...basics,
		pages,
		second,
		legal: legal.data.map((page) => ({ href: `/legal${page.href}`, label: page.label })),
		year: new Date().getFullYear(),
	};
}

function FooterList({ links }: { links: FooterLink[] }) {
	return (
		<ul className="grid gap-5">
			{links.map((link) => (
				<li key={link.href}>
					{link.external ? (
						<a
							href={link.href}
							target="_blank"
							rel="noopener noreferrer"
							className="hover-underline mx-auto block text-label-2 font-bold uppercase tracking-4 text-silver transition-colors hover:text-gold"
						>
							{link.label}
						</a>
					) : (
						<Link
							href={link.href}
							className="hover-underline mx-auto block text-label-2 font-bold uppercase tracking-4 text-silver transition-colors hover:text-gold"
						>
							{link.label}
						</Link>
					)}
				</li>
			))}
		</ul>
	);
}

function DiamondTrio() {
	return (
		<div className="flex justify-center gap-0.5" aria-hidden="true">
			<span className="diamond diamond-spin" />
			<span className="diamond diamond-spin" />
			<span className="diamond diamond-spin" />
		</div>
	);
}

export async function Footer() {
	const data = await getFooterData();

	return (
		<footer className="relative isolate overflow-hidden bg-smoky py-[70px] text-center lg:py-[100px]">
			<div aria-hidden="true" className="absolute inset-0 -z-10">
				<Image src={FOOTER_IMAGE} alt="" fill sizes="100vw" className="object-cover opacity-25" />
				<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgb(14_13_11/0.55),rgb(14_13_11/0.95))]" />
			</div>
			<div className="container-g">
				<div className="mb-[70px] grid items-center gap-10 md:grid-cols-2 lg:grid-cols-[0.45fr_1fr_0.45fr]">
					<div className="relative bg-smoky bg-[url('/images/footer-form-bg.png')] bg-top px-10 py-[50px] before:absolute before:inset-y-0 before:left-0 before:w-[15px] before:bg-[url('/images/footer-form-pattern.svg')] before:content-[''] after:absolute after:inset-y-0 after:right-0 after:w-[15px] after:bg-[url('/images/footer-form-pattern.svg')] after:content-[''] md:col-span-2 lg:order-1 lg:col-span-1 lg:py-[100px]">
						<div className="mx-auto max-w-[460px]">
							<Link href="/" className="mx-auto mb-10 block w-max">
								<Logo name={data.storeName} />
							</Link>
							{data.description && (
								<p className="text-body-4 leading-normal text-silver">{data.description}</p>
							)}
							{data.freeShipping && (
								<p className="mt-1.5 text-body-4 leading-normal text-silver">
									Free delivery on orders over {data.freeShipping}
								</p>
							)}
							<div className="mt-10 mb-6">
								<DiamondTrio />
							</div>
							<p className="font-display text-title-1 text-white">Get News &amp; Offers</p>
							<p className="mb-[30px] text-label-1 leading-normal text-silver">
								Subscribe for new arrivals &amp; <span className="text-white">seasonal offers.</span>
							</p>
							<NewsletterForm />
						</div>
					</div>
					<FooterList links={data.pages} />
					{data.second.length > 0 && (
						<div className="lg:order-2">
							<FooterList links={data.second} />
						</div>
					)}
				</div>
				<div className="flex flex-col items-center gap-5">
					{data.legal.length > 0 && (
						<ul className="flex flex-wrap justify-center gap-x-6 gap-y-2">
							{data.legal.map((link) => (
								<li key={link.href}>
									<Link
										href={link.href}
										className="text-label-1 text-silver transition-colors hover:text-gold"
									>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					)}
					<p className="text-body-4 leading-normal text-silver">
						&copy; {data.year} {data.storeName}. All Rights Reserved.
					</p>
					<PaymentMethods />
				</div>
			</div>
		</footer>
	);
}
