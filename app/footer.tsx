import { cacheLife } from "next/cache";
import Link from "next/link";
import { FooterNewsletter } from "@/components/footer-newsletter";
import { PaymentMethods } from "@/components/payment-methods";
import { getCatalogCategories, getStoreIdentity } from "@/lib/catalog";
import { commerce } from "@/lib/commerce";

const SOCIAL_LABELS = {
	instagram: "Instagram",
	facebook: "Facebook",
	x: "X",
	tiktok: "TikTok",
	youtube: "YouTube",
	linkedin: "LinkedIn",
} as const;

async function getFooterData() {
	"use cache";
	cacheLife("hours");
	const [identity, categories, socials, legal] = await Promise.all([
		getStoreIdentity(),
		getCatalogCategories(),
		commerce.socialsGet().catch(() => null),
		commerce.legalPageBrowse().catch(() => ({ data: [] })),
	]);
	const socialLinks = Object.entries(SOCIAL_LABELS).flatMap(([key, label]) => {
		const href = socials?.socials[key as keyof typeof SOCIAL_LABELS];
		return href ? [{ href, label }] : [];
	});
	const brandLinks = [
		{ href: "/about", label: "About Us" },
		{ href: "/faq", label: "FAQ" },
		...(identity.contactFormEnabled ? [{ href: "/contact", label: "Contact" }] : []),
		...(identity.blogEnabled ? [{ href: "/blog", label: "Blog" }] : []),
	];
	const shopLinks = [
		{ href: "/products", label: "Shop All" },
		...categories
			.slice(0, 6)
			.map((category) => ({ href: `/category/${category.slug}`, label: category.name })),
	];
	return {
		storeName: identity.storeName,
		socialLinks,
		brandLinks,
		shopLinks,
		legal: legal.data.map((page) => ({ href: `/legal${page.href}`, label: page.label })),
		// `new Date()` is an unstable value in the prerendered shell; caching pins it to the entry.
		year: new Date().getFullYear(),
	};
}

function LinkColumn({ title, links }: { title: string; links: { href: string; label: string }[] }) {
	return (
		<>
			{/* Mobile: a disclosure row like the original's accordion menus. */}
			<details className="group border-b border-white/20 lg:hidden">
				<summary className="flex h-14 cursor-pointer list-none items-center justify-between px-4 text-sm font-bold uppercase [&::-webkit-details-marker]:hidden">
					{title}
					<svg
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth={1.5}
						className="size-5 transition-transform group-open:rotate-180"
						aria-hidden
					>
						<path d="m6 9 6 6 6-6" />
					</svg>
				</summary>
				<ul className="flex flex-col gap-3 px-4 pb-5">
					{links.map((link) => (
						<li key={link.href}>
							<Link href={link.href} className="hover-underline text-sm capitalize">
								{link.label}
							</Link>
						</li>
					))}
				</ul>
			</details>
			<div className="hidden lg:block">
				<h2 className="text-sm font-bold uppercase">{title}</h2>
				<ul className="mt-3 flex flex-col gap-2">
					{links.map((link) => (
						<li key={link.href}>
							<Link href={link.href} className="hover-underline text-sm capitalize">
								{link.label}
							</Link>
						</li>
					))}
				</ul>
			</div>
		</>
	);
}

export async function Footer() {
	const { storeName, socialLinks, brandLinks, shopLinks, legal, year } = await getFooterData();

	return (
		<footer className="bg-ink text-white">
			<div className="mx-auto max-w-[96rem] lg:px-12 lg:pt-16">
				<div className="flex flex-col lg:grid lg:grid-cols-[auto_1fr_minmax(0,22rem)] lg:gap-14">
					<div className="flex items-center gap-8 border-b border-white/20 p-4 py-8 lg:block lg:border-0 lg:p-0">
						<Link href="/" className="text-2xl font-bold lowercase tracking-tight">
							{storeName}
						</Link>
						{socialLinks.length > 0 && (
							<div className="lg:mt-8">
								<p className="text-sm font-bold uppercase">Stay connected</p>
								<ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
									{socialLinks.map((social) => (
										<li key={social.href}>
											<a
												href={social.href}
												className="hover-underline text-sm"
												rel="noreferrer"
												target="_blank"
											>
												{social.label}
											</a>
										</li>
									))}
								</ul>
							</div>
						)}
					</div>
					<div className="order-last flex flex-col lg:order-none lg:flex-row lg:gap-20">
						<LinkColumn title="Shop" links={shopLinks} />
						<LinkColumn title="Brand" links={brandLinks} />
					</div>
					<div className="border-b border-white/20 px-4 py-8 lg:border-0 lg:p-0">
						<h2 className="text-sm font-bold uppercase">Stay in touch</h2>
						<p className="mt-2 text-sm">Get the latest news and updates sent straight to your inbox.</p>
						<FooterNewsletter />
					</div>
				</div>
				<div className="flex flex-col gap-5 px-4 py-8 lg:mt-16 lg:flex-row lg:items-end lg:justify-between lg:px-0 lg:pb-10">
					<div className="flex flex-col gap-1 text-sm lg:flex-row lg:items-center lg:gap-0">
						<p>
							Copyright &copy; {year} {storeName}. All Rights Reserved
						</p>
						{legal.length > 0 && (
							<ul className="flex flex-wrap items-center">
								{legal.map((page, index) => (
									<li key={page.href} className="flex items-center">
										<span aria-hidden className={index === 0 ? "mx-3 hidden lg:inline" : "mx-3"}>
											|
										</span>
										<Link href={page.href} className="hover-underline">
											{page.label}
										</Link>
									</li>
								))}
							</ul>
						)}
					</div>
					<PaymentMethods />
				</div>
			</div>
		</footer>
	);
}
