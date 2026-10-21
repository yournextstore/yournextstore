import { Mail, MessageCircle, UserRound } from "lucide-react";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { PaymentMethods } from "@/components/payment-methods";
import { Newsletter } from "@/components/sections/newsletter";
import { getCategoryTiles } from "@/lib/catalog";
import { commerce, getStoreSeo, meGetCached } from "@/lib/commerce";

async function getFooterData() {
	"use cache";
	cacheLife("hours");
	const [me, legal, categories, socials] = await Promise.all([
		meGetCached().catch(() => null),
		commerce.legalPageBrowse().catch(() => ({ data: [] })),
		getCategoryTiles(),
		commerce.socialsGet().catch(() => null),
	]);
	const tools = me?.store.settings?.enabledTools;
	const help = [
		{ href: "/about", label: "About us" },
		{ href: "/faq", label: "FAQ" },
		...(tools?.contactForm ? [{ href: "/contact", label: "Contact" }] : []),
		...(tools?.blog ? [{ href: "/blog", label: "Journal" }] : []),
		...legal.data.map((page) => ({ href: `/legal${page.href}`, label: page.label })),
	];
	const socialLinks = Object.entries(socials?.socials ?? {}).flatMap(([name, url]) =>
		typeof url === "string" && url && name !== "email" ? [{ name, url }] : [],
	);
	const email = socials?.socials?.email ?? null;
	// `new Date()` is unstable during prerender; caching pins it to the entry.
	return { help, categories, socialLinks, email, year: new Date().getFullYear() };
}

export async function Footer() {
	const [{ help, categories, socialLinks, email, year }, { storeName, storeDescription }] = await Promise.all(
		[getFooterData(), getStoreSeo()],
	);

	return (
		<footer className="store-footer">
			<div className="store-width">
				<div className="footer-card">
					<div className="footer-brand">
						<Link href="/" className="store-logo footer-logo">
							{storeName}
						</Link>
						{storeDescription && <p>{storeDescription}</p>}
						<ul className="footer-contact">
							<li>
								<UserRound size={15} aria-hidden />
								{/* Plain <a>: /account is a proxied zone. */}
								<a href="/account">Your account and orders</a>
							</li>
							{email && (
								<li>
									<Mail size={15} aria-hidden />
									<a href={`mailto:${email}`}>{email}</a>
								</li>
							)}
							<li>
								<MessageCircle size={15} aria-hidden />
								<Link href="/faq">Questions? Read the FAQ</Link>
							</li>
						</ul>
						{socialLinks.length > 0 && (
							<ul className="social-links">
								{socialLinks.map((social) => (
									<li key={social.name}>
										<a href={social.url} className="chip" target="_blank" rel="noopener noreferrer">
											{social.name}
										</a>
									</li>
								))}
							</ul>
						)}
					</div>
					<nav aria-label="Shop" className="footer-links">
						<p>Shop</p>
						<Link href="/products">All products</Link>
						{categories.map((category) => (
							<Link key={category.id} href={category.href}>
								{category.name}
							</Link>
						))}
					</nav>
					<nav aria-label="Help and information" className="footer-links">
						<p>Help</p>
						{help.map((link) => (
							<Link key={link.href} href={link.href}>
								{link.label}
							</Link>
						))}
					</nav>
					<div className="footer-newsletter">
						<Newsletter />
					</div>
				</div>
				<div className="footer-bottom">
					<p>
						© {year} {storeName}
					</p>
					<PaymentMethods />
				</div>
			</div>
		</footer>
	);
}
