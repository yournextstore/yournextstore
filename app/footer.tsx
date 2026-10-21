import { cacheLife } from "next/cache";
import Link from "next/link";
import { LogoMark } from "@/components/bento/logo-mark";
import { NewsletterForm } from "@/components/bento/newsletter-form";
import { PaymentMethods } from "@/components/payment-methods";
import { getCategoryTiles, getStoreBasics } from "@/lib/aqua";
import { commerce } from "@/lib/commerce";

type FooterLink = { href: string; label: string };

async function getLegalLinks(): Promise<FooterLink[]> {
	"use cache";
	cacheLife("hours");
	const legal = await commerce.legalPageBrowse().catch(() => ({ data: [] }));
	return legal.data.map((page) => ({ href: `/legal${page.href}`, label: page.label }));
}

// `new Date()` is an unstable value: reading it during the prerender is an error.
// Caching pins it to the entry.
async function getCopyrightYear() {
	"use cache";
	cacheLife("days");
	return new Date().getFullYear();
}

function Column({ title, links }: { title: string; links: FooterLink[] }) {
	return (
		<div>
			<h2 className="text-xs font-semibold tracking-[0.18em] text-[#8a9a9c] uppercase">{title}</h2>
			<ul className="mt-4 space-y-2.5">
				{links.map((link) => (
					<li key={link.href}>
						<Link href={link.href} className="text-sm text-[#a3a3a3] transition-colors hover:text-amber">
							{link.label}
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}

export async function Footer() {
	const [year, basics, categories, legal] = await Promise.all([
		getCopyrightYear(),
		getStoreBasics(),
		getCategoryTiles(),
		getLegalLinks(),
	]);

	const shop: FooterLink[] = [
		{ href: "/products", label: "All products" },
		...categories.map((category) => ({ href: category.href, label: category.name })),
	];
	const support: FooterLink[] = [
		{ href: "/faq", label: "FAQ" },
		...(basics.contactForm ? [{ href: "/contact", label: "Contact" }] : []),
		{ href: "/about", label: "About" },
		...(basics.blog ? [{ href: "/blog", label: "Journal" }] : []),
	];

	return (
		<footer className="border-t border-white/10 bg-deep text-sm text-[#a3a3a3]">
			<div className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-10 px-6 py-16 md:grid-cols-5 md:px-12">
				<div className="col-span-2">
					<Link href="/" aria-label={`${basics.storeName} home`} className="inline-flex max-w-full">
						<LogoMark name={basics.storeName} />
					</Link>
					<p className="mt-4 max-w-xs text-sm leading-relaxed text-[#8a9a9c]">
						{basics.description ??
							"A planted-aquarium shop: plants, light, stone and substrate, chosen on specs instead of marketing and described plainly."}
					</p>
					{basics.socials.length > 0 ? (
						<ul className="mt-5 flex flex-wrap gap-3">
							{basics.socials.map((social) => (
								<li key={social.label}>
									<a
										href={social.href}
										target="_blank"
										rel="noopener noreferrer"
										className="inline-block rounded-full border border-white/10 px-3 py-1.5 text-xs text-[#a3a3a3] transition hover:border-amber/50 hover:text-amber"
									>
										{social.label}
									</a>
								</li>
							))}
						</ul>
					) : null}
				</div>

				<Column title="Shop" links={shop} />
				<Column title="Support" links={support} />

				<div className="col-span-2 md:col-span-1">
					<h2 className="text-xs font-semibold tracking-[0.18em] text-[#8a9a9c] uppercase">The drop list</h2>
					<p className="mt-4 text-sm text-[#8a9a9c]">New arrivals, restocks and notes from the shop.</p>
					<div className="mt-3">
						<NewsletterForm />
					</div>
				</div>
			</div>

			<div className="border-t border-white/10">
				<div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-4 px-6 py-6 text-xs text-[#8a9a9c] md:flex-row md:px-12">
					<p>
						&copy; {year} {basics.storeName}. All rights reserved.
					</p>
					<div className="flex items-center gap-3 md:ml-6">
						<span>Secure checkout</span>
						<PaymentMethods />
					</div>
					<ul className="flex flex-wrap justify-center gap-x-4 gap-y-2 md:ml-auto">
						{legal.map((link) => (
							<li key={link.href}>
								<Link href={link.href} className="hover:text-[#d4d4d4]">
									{link.label}
								</Link>
							</li>
						))}
						<li>
							{/* Plain <a>: /account is a proxied zone. */}
							<a href="/account" className="hover:text-[#d4d4d4]">
								My account
							</a>
						</li>
					</ul>
				</div>
			</div>
		</footer>
	);
}
