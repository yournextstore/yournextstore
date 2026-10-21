import { cacheLife } from "next/cache";
import Link from "next/link";
import { FooterNewsletter } from "@/components/footer-newsletter";
import { PaymentMethods } from "@/components/payment-methods";
import { commerce, meGetCached } from "@/lib/commerce";

type FooterLink = { href: string; label: string; external?: boolean };

const SOCIAL_LABELS = {
	instagram: "Instagram",
	facebook: "Facebook",
	tiktok: "TikTok",
	x: "X",
	youtube: "YouTube",
	linkedin: "LinkedIn",
} as const;

// One cached read keeps the whole footer in the prerendered shell; caching also pins the year.
async function getFooterData() {
	"use cache";
	cacheLife("hours");

	const [me, legal, socials, categories] = await Promise.all([
		meGetCached().catch(() => null),
		commerce.legalPageBrowse().catch(() => ({ data: [] })),
		commerce.socialsGet().catch(() => null),
		commerce.categoriesBrowse({ active: true, limit: 20 }).catch(() => ({ data: [] })),
	]);
	const settings = me?.store.settings;
	const tools = settings?.enabledTools;
	const offer = settings?.welcomeOffer;

	const shop: FooterLink[] = [
		...categories.data
			.filter((category) => !category.parentId)
			.slice(0, 4)
			.map((category) => ({ href: `/category/${category.slug}`, label: category.name })),
		{ href: "/products", label: "Shop all" },
		{ href: "/about", label: "About" },
		...(tools?.blog ? [{ href: "/blog", label: "Journal" }] : []),
		{ href: "/account", label: "Login", external: true },
	];

	const help: FooterLink[] = [
		{ href: "#newsletter", label: "Subscribe", external: true },
		{ href: "/faq", label: "FAQ" },
		...(tools?.contactForm ? [{ href: "/contact", label: "Contact" }] : []),
		...legal.data.map((page) => ({ href: `/legal${page.href}`, label: page.label })),
	];

	const socialLinks: FooterLink[] = socials
		? Object.entries(SOCIAL_LABELS).flatMap(([key, label]) => {
				const href = socials.socials[key as keyof typeof SOCIAL_LABELS];
				return href ? [{ href, label, external: true }] : [];
			})
		: [];

	return {
		storeName: me?.store.name || "Your Next Store",
		year: new Date().getFullYear(),
		shop,
		help,
		socialLinks,
		pitch:
			offer?.enabled && offer.discountType === "percentage" && offer.discountValue
				? `Subscribe and enjoy ${offer.discountValue}% off your first order`
				: "Subscribe for new releases and notes from the studio",
	};
}

function FooterLinks({ links, label }: { links: FooterLink[]; label: string }) {
	return (
		<ul aria-label={label}>
			{links.map((link) => (
				<li key={link.href}>
					{link.external ? (
						<a
							href={link.href}
							{...(link.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
							className="inline-block py-1 underline-offset-[0.3em] hover:underline md:py-0"
						>
							{link.label}
						</a>
					) : (
						<Link
							href={link.href}
							className="inline-block py-1 underline-offset-[0.3em] hover:underline md:py-0"
						>
							{link.label}
						</Link>
					)}
				</li>
			))}
		</ul>
	);
}

export async function Footer() {
	const { storeName, year, shop, help, socialLinks, pitch } = await getFooterData();

	return (
		<footer className="bg-background text-snow">
			<div className="flex flex-col gap-10 px-4 py-10 text-foot md:min-h-[60vh] md:flex-row md:gap-0 md:p-[2vw]">
				<div className="flex gap-10 md:contents">
					<div className="md:w-1/3 md:pr-[2vw]">
						<FooterLinks links={shop} label="Shop" />
						{socialLinks.length > 0 && (
							<ul aria-label="Social" className="mt-6 flex flex-wrap gap-x-4 md:mt-[2vw]">
								{socialLinks.map((link) => (
									<li key={link.href}>
										<a
											href={link.href}
											target="_blank"
											rel="noopener noreferrer"
											className="underline underline-offset-[0.3em] hover:no-underline"
										>
											{link.label}
										</a>
									</li>
								))}
							</ul>
						)}
					</div>
					<div className="md:w-1/3 md:pr-[2vw]">
						<FooterLinks links={help} label="Help" />
					</div>
				</div>
				<div className="md:w-full md:pl-[8vw] lg:pl-[12vw]">
					<FooterNewsletter pitch={pitch} />
				</div>
			</div>
			<div className="flex flex-col gap-4 px-4 pb-8 text-foot text-muted-foreground sm:flex-row sm:items-center sm:justify-between md:px-[2vw]">
				<p>
					&copy; {year} {storeName}
				</p>
				<PaymentMethods />
			</div>
		</footer>
	);
}
