import { cacheLife } from "next/cache";
import Link from "next/link";
import { PaymentMethods } from "@/components/payment-methods";
import { getCategoryCards, getStoreName } from "@/lib/catalog";
import { commerce, meGetCached } from "@/lib/commerce";
import { SOCIAL_ICONS, type SocialKey } from "@/lib/social-icons";
import { cn } from "@/lib/utils";

const ICON_COLORS = {
	black:
		"border-neutral-300 bg-neutral-50 text-neutral-800 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200",
	blue: "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300",
	rose: "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-300",
} as const;

const linkClass =
	"text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-50";

async function getFooterData() {
	"use cache";
	cacheLife("hours");
	const [me, legal, socials, categories, storeName] = await Promise.all([
		meGetCached().catch(() => null),
		commerce.legalPageBrowse().catch(() => ({ data: [] })),
		commerce.socialsGet().catch(() => null),
		getCategoryCards().catch(() => []),
		getStoreName(),
	]);
	const tools = me?.store.settings?.enabledTools;
	const socialLinks = (Object.keys(SOCIAL_ICONS) as SocialKey[]).flatMap((key) => {
		const value = socials?.socials?.[key];
		if (!value || key === "email") return [];
		return [{ key, href: value, ...SOCIAL_ICONS[key] }];
	});
	const email = socials?.socials?.email ?? null;

	return {
		storeName,
		storeDescription: me?.store.settings?.storeDescription ?? null,
		blogEnabled: tools?.blog ?? false,
		contactEnabled: tools?.contactForm ?? false,
		legal: legal.data,
		categories: categories.slice(0, 6),
		socialLinks,
		email,
		year: new Date().getFullYear(),
	};
}

function FooterNav({ title, links }: { title: string; links: { href: string; label: string }[] }) {
	if (links.length === 0) return null;
	return (
		<nav aria-label={title} className="flex min-w-0 flex-col gap-3">
			<h2 className="text-lg font-medium text-neutral-900 dark:text-neutral-50">{title}</h2>
			<div className="flex flex-col items-start gap-2">
				{links.map((link) => (
					<Link key={link.href} href={link.href} className={linkClass}>
						{link.label}
					</Link>
				))}
			</div>
		</nav>
	);
}

function IconLink({
	href,
	label,
	color,
	viewBox,
	path,
}: {
	href: string;
	label: string;
	color: keyof typeof ICON_COLORS;
	viewBox: string;
	path: string;
}) {
	return (
		<a
			href={href}
			target={href.startsWith("mailto:") ? undefined : "_blank"}
			rel="noreferrer"
			className={cn(
				"flex size-10 items-center justify-center rounded-full border transition",
				ICON_COLORS[color],
			)}
		>
			<svg aria-hidden="true" className="size-5 fill-current" viewBox={viewBox}>
				<path d={path} />
			</svg>
			<span className="sr-only">{label}</span>
		</a>
	);
}

export async function Footer() {
	const data = await getFooterData();

	const quickLinks = [
		{ href: "/", label: "Home" },
		{ href: "/products", label: "Shop all" },
		{ href: "/about", label: "About us" },
		{ href: "/faq", label: "FAQ" },
		...(data.contactEnabled ? [{ href: "/contact", label: "Contact us" }] : []),
		...(data.blogEnabled ? [{ href: "/blog", label: "Blog" }] : []),
	];

	const columns = [
		{
			title: data.storeName,
			body:
				data.storeDescription || "A full product catalogue, clear prices and a fast checkout on any device.",
			cta: null,
		},
		{
			title: "Simple, Flexible Shopping",
			body: "Browse by category, pick the options you need and check out in a few steps.",
			cta: { href: "/products", label: "Shop all products" },
		},
		{
			title: "Questions? We Can Help",
			body: "Answers about orders, delivery, payments and returns, all in one place.",
			cta: { href: "/faq", label: "Read the FAQ" },
		},
	];

	return (
		<footer className="mt-auto px-4 py-8">
			<div className="mx-auto grid max-w-[82rem] grid-cols-2 gap-x-6 gap-y-8 border-t border-border pt-8 sm:grid-cols-3 md:grid-cols-4">
				<FooterNav title="Quick Links" links={quickLinks} />
				<FooterNav
					title="Categories"
					links={data.categories.map((category) => ({
						href: `/category/${category.slug}`,
						label: category.name,
					}))}
				/>
				<FooterNav
					title="Policies"
					links={data.legal.map((page) => ({ href: `/legal${page.href}`, label: page.label }))}
				/>

				<div className="col-span-full grid gap-8 md:grid-cols-3 md:gap-10">
					{columns.map((column) => (
						<div key={column.title} className="min-w-0">
							<h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-50">{column.title}</h3>
							<p className="mt-3 text-sm leading-7 text-neutral-600 dark:text-neutral-400">{column.body}</p>
							{column.cta ? (
								<Link href={column.cta.href} className="btn-rose mt-4">
									{column.cta.label}
								</Link>
							) : null}
						</div>
					))}
				</div>

				{data.socialLinks.length > 0 ? (
					<div className="col-span-full flex flex-col gap-3">
						<h3 className="text-sm font-medium text-neutral-900 dark:text-neutral-50">Follow Us</h3>
						<div className="flex flex-wrap items-center gap-2">
							{data.socialLinks.map((social) => (
								<IconLink
									key={social.key}
									href={social.href}
									label={social.label}
									color={social.color}
									viewBox={social.viewBox}
									path={social.path}
								/>
							))}
						</div>
					</div>
				) : null}

				{data.email ? (
					<div className="col-span-full flex flex-col gap-3">
						<h3 className="text-sm font-medium text-neutral-900 dark:text-neutral-50">Contact Us</h3>
						<div className="flex flex-wrap items-center gap-2">
							<IconLink
								href={`mailto:${data.email}`}
								label={`Email ${data.email}`}
								color="rose"
								viewBox={SOCIAL_ICONS.email.viewBox}
								path={SOCIAL_ICONS.email.path}
							/>
						</div>
					</div>
				) : null}

				<div className="col-span-full flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
					<p className="text-sm text-neutral-600 dark:text-neutral-400">
						&copy; {data.year} {data.storeName}. All rights reserved.
					</p>
					<PaymentMethods />
				</div>
			</div>
		</footer>
	);
}
