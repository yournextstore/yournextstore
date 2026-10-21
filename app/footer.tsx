import { cacheLife } from "next/cache";
import Link from "next/link";
import { CircleText } from "@/components/circle-text";
import { PaymentMethods } from "@/components/payment-methods";
import { getCategoryTiles, getSocialLinks, getStoreBrand } from "@/lib/catalog";
import { commerce } from "@/lib/commerce";

type FooterLink = { href: string; label: string; external?: boolean };

// Everything the footer shows comes from cached reads, so it stays in the prerendered shell.
// `new Date()` included: caching pins the year to the entry.
async function getFooterData() {
	"use cache";
	cacheLife("hours");

	const [brand, categories, socials, legal] = await Promise.all([
		getStoreBrand(),
		getCategoryTiles(5),
		getSocialLinks(),
		commerce.legalPageBrowse().catch(() => ({ data: [] })),
	]);

	const shop: FooterLink[] = [
		{ href: "/products", label: "Shop all" },
		...categories.map((category) => ({ href: category.href, label: category.name })),
	];
	const hello: FooterLink[] = [
		{ href: "/about", label: "About" },
		...(brand.contact ? [{ href: "/contact", label: "Contact" }] : []),
		{ href: "/faq", label: "FAQ" },
		...(brand.blog ? [{ href: "/blog", label: "Blog" }] : []),
		...socials.map((social) => ({ href: social.href, label: `${social.label} ↗`, external: true })),
	];
	const legalLinks: FooterLink[] = legal.data.map((page) => ({
		href: `/legal${page.href}`,
		label: page.label,
	}));

	return { brand, shop, hello, legalLinks, year: new Date().getFullYear() };
}

function FooterLink({ link }: { link: FooterLink }) {
	const className = "underline-offset-4 transition-colors hover:text-orange hover:underline";
	return link.external ? (
		<a href={link.href} target="_blank" rel="noopener noreferrer" className={className}>
			{link.label}
		</a>
	) : (
		<Link href={link.href} className={className}>
			{link.label}
		</Link>
	);
}

/** The original's lemon footer: the wordmark centred in orange, the spinning roundel hanging over its top edge. */
export async function Footer() {
	const { brand, shop, hello, legalLinks, year } = await getFooterData();

	return (
		<footer className="relative z-[1] bg-lemon text-ink">
			<div className="shell relative pb-8 pt-20 md:pt-16">
				<div className="absolute right-4 top-0 w-28 -translate-y-14 md:right-24 md:w-48 md:-translate-y-28">
					<CircleText text="Pop a can · Love the fizz ·" className="w-full" />
				</div>
				<Link
					href="/"
					className="mx-auto block w-fit max-w-full truncate text-[clamp(2.4rem,9vw,5.5rem)] font-black lowercase leading-none tracking-[-0.05em] text-orange"
				>
					{brand.name}
				</Link>
				<div className="mt-10 grid gap-8 text-[1.05rem] font-semibold sm:grid-cols-2 md:grid-cols-[1.4fr_1fr_1fr]">
					<p className="max-w-sm text-ink-soft">{brand.tagline}</p>
					<nav aria-label="Shop">
						<p className="mb-3 text-sm font-bold uppercase tracking-[0.16em]">Shop</p>
						<ul className="space-y-1.5">
							{shop.map((link) => (
								<li key={link.href}>
									<FooterLink link={link} />
								</li>
							))}
						</ul>
					</nav>
					<nav aria-label="Say hello">
						<p className="mb-3 text-sm font-bold uppercase tracking-[0.16em]">Say hello</p>
						<ul className="space-y-1.5">
							{hello.map((link) => (
								<li key={link.href}>
									<FooterLink link={link} />
								</li>
							))}
						</ul>
					</nav>
				</div>
				<div className="mt-10 flex flex-wrap items-center justify-between gap-x-6 gap-y-4 border-t-2 border-ink/15 pt-6 text-sm">
					<div className="flex flex-col gap-1">
						<p>
							&copy; {year} {brand.name}
						</p>
						{legalLinks.length > 0 && (
							<ul className="flex flex-wrap gap-x-4">
								{legalLinks.map((link) => (
									<li key={link.href}>
										<Link href={link.href} className="underline underline-offset-3 hover:text-orange">
											{link.label}
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
