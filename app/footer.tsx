import { cacheLife } from "next/cache";
import Link from "next/link";
import { Wordmark } from "@/components/bakery/wordmark";
import { PaymentMethods } from "@/components/payment-methods";
import { getMenuCategories, getStoreBrand } from "@/lib/catalog";
import { commerce } from "@/lib/commerce";
import { QUIET_LINK } from "@/lib/ui";

const SOCIAL_LABELS = {
	instagram: "Instagram",
	facebook: "Facebook",
	x: "X",
	youtube: "YouTube",
	tiktok: "TikTok",
	linkedin: "LinkedIn",
} as const;

// Everything the footer reads is cached together: it sits in the prerendered shell.
async function getFooterData() {
	"use cache";
	cacheLife("hours");
	const [brand, categories, socials, legal] = await Promise.all([
		getStoreBrand(),
		getMenuCategories().catch(() => []),
		commerce.socialsGet().catch(() => null),
		commerce.legalPageBrowse().catch(() => ({ data: [] })),
	]);
	const socialLinks = (Object.keys(SOCIAL_LABELS) as (keyof typeof SOCIAL_LABELS)[]).flatMap((key) => {
		const href = socials?.socials[key];
		return href ? [{ href, label: SOCIAL_LABELS[key] }] : [];
	});
	const email = socials?.socials.email ?? null;
	return {
		brand,
		categories,
		socialLinks,
		email,
		legal: legal.data,
		year: new Date().getFullYear(),
	};
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
	return (
		<div className="flex flex-col gap-3 lg:gap-6">
			<h2 className="font-serif text-heading-xl font-bold text-brand">{title}</h2>
			<ul className="flex flex-col gap-1 lg:gap-2">{children}</ul>
		</div>
	);
}

export async function Footer() {
	const { brand, categories, socialLinks, email, legal, year } = await getFooterData();

	return (
		<footer className="divide-y divide-line bg-surface">
			<nav
				aria-label="Footer"
				className="bake-container flex flex-col gap-8 pt-16 pb-8 lg:flex-row lg:justify-between lg:gap-12 lg:pt-24"
			>
				<div className="flex flex-col gap-3 lg:max-w-xs lg:gap-[2.35rem]">
					<Wordmark name={brand.name} className="w-fit max-w-full" />
					<ul className="flex flex-col gap-1 lg:gap-2">
						{brand.description ? (
							<li>
								<p className="font-sans text-body-md text-muted-foreground">{brand.description}</p>
							</li>
						) : null}
						{email ? (
							<li>
								<a href={`mailto:${email}`} className={QUIET_LINK}>
									{email}
								</a>
							</li>
						) : null}
					</ul>
				</div>
				<FooterColumn title="Browse">
					<li>
						<Link href="/products" className={QUIET_LINK}>
							Shop
						</Link>
					</li>
					<li>
						<Link href="/about" className={QUIET_LINK}>
							About
						</Link>
					</li>
					{brand.contact ? (
						<li>
							<Link href="/contact" className={QUIET_LINK}>
								Contact
							</Link>
						</li>
					) : null}
					<li>
						<Link href="/faq" className={QUIET_LINK}>
							FAQ
						</Link>
					</li>
					{brand.blog ? (
						<li>
							<Link href="/blog" className={QUIET_LINK}>
								Blog
							</Link>
						</li>
					) : null}
				</FooterColumn>
				{socialLinks.length > 0 ? (
					<FooterColumn title="Follow">
						{socialLinks.map((social) => (
							<li key={social.label}>
								<a href={social.href} target="_blank" rel="noopener noreferrer" className={QUIET_LINK}>
									{social.label}
								</a>
							</li>
						))}
					</FooterColumn>
				) : null}
				{categories.length > 0 ? (
					<FooterColumn title="In the shop">
						{categories.map((category) => (
							<li key={category.slug}>
								<Link href={`/category/${category.slug}`} className={QUIET_LINK}>
									{category.name}
								</Link>
							</li>
						))}
					</FooterColumn>
				) : null}
			</nav>
			<div className="bake-container flex flex-col gap-4 pt-8 pb-16 lg:flex-row-reverse lg:items-center lg:justify-between lg:pb-24">
				<div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-8">
					{legal.length > 0 ? (
						<ul className="flex flex-wrap gap-x-6 gap-y-1">
							{legal.map((page) => (
								<li key={page.id}>
									<Link href={`/legal${page.href}`} className={QUIET_LINK}>
										{page.label}
									</Link>
								</li>
							))}
						</ul>
					) : null}
					<PaymentMethods />
				</div>
				<p className="font-sans text-body-md text-muted-foreground">
					&copy; {year} {brand.name}. All rights reserved.
				</p>
			</div>
		</footer>
	);
}
