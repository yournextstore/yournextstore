import { CreditCardIcon, HelpCircleIcon, PackageIcon, TruckIcon } from "lucide-react";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { PaymentMethods } from "@/components/payment-methods";
import { getCatalogEntries, getStoreInfo } from "@/lib/catalog";
import { commerce } from "@/lib/commerce";

// `new Date()` is an unstable value: now that the footer is part of the prerendered
// shell, reading it during the prerender is an error. Caching pins it to the entry.
async function getCopyrightYear() {
	"use cache";
	cacheLife("days");
	return new Date().getFullYear();
}

async function getLegalPages() {
	"use cache";
	cacheLife("hours");
	const pages = await commerce.legalPageBrowse().catch(() => ({ data: [] }));
	return pages.data;
}

const footerLink = "text-uk-sm text-ink-muted transition-colors hover:text-white";

/** UIkit's five-up "advantages" row above the footer, written from what the platform really does. */
async function Advantages() {
	const info = await getStoreInfo();
	const items = [
		info.freeShipping
			? { icon: TruckIcon, title: "Free shipping", text: `On every order over ${info.freeShipping}` }
			: { icon: TruckIcon, title: "Tracked delivery", text: "Shipping options at checkout" },
		{ icon: CreditCardIcon, title: "Secure payment", text: "Cards and local methods, encrypted" },
		{ icon: PackageIcon, title: "Order status", text: "Follow every order from your account" },
		{ icon: HelpCircleIcon, title: "Questions?", text: "Answers in our FAQ" },
	];
	return (
		<section aria-label="Why shop with us" className="bg-card py-10">
			<div className="uk-container">
				<ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
					{items.map(({ icon: Icon, title, text }) => (
						<li key={title} className="flex items-start gap-[15px]">
							<Icon aria-hidden className="size-10 shrink-0 text-foreground" strokeWidth={0.9} />
							<div>
								<p className="text-uk-md text-foreground">{title}</p>
								<p className="text-uk-sm text-muted-foreground">{text}</p>
							</div>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}

export async function Footer() {
	const [year, info, entries, legal] = await Promise.all([
		getCopyrightYear(),
		getStoreInfo(),
		getCatalogEntries(),
		getLegalPages(),
	]);

	const shopLinks = [
		{ href: "/products", label: "All products" },
		...entries.slice(0, 4).map((entry) => ({ href: entry.href, label: entry.name })),
	];
	const infoLinks = [
		{ href: "/about", label: "About" },
		{ href: "/faq", label: "FAQ" },
		...(info.contact ? [{ href: "/contact", label: "Contacts" }] : []),
		...(info.blog ? [{ href: "/blog", label: "Blog" }] : []),
	];

	return (
		<>
			<Advantages />
			<footer className="bg-ink py-10 text-ink-muted lg:py-[70px]">
				<div className="uk-container">
					<div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
						<div>
							<Link href="/" className="inline-flex" aria-label={`${info.storeName} home`}>
								<Logo name={info.storeName} inverse />
							</Link>
							<p className="mt-5 text-uk-sm leading-relaxed">
								{info.storeDescription ??
									"Everything in one catalog, shipped to your door. Browse, compare and order in a few clicks."}
							</p>
							{info.socialLinks.length > 0 && (
								<ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
									{info.socialLinks.map((social) => (
										<li key={social.href}>
											<a href={social.href} target="_blank" rel="noreferrer" className={footerLink}>
												{social.label}
											</a>
										</li>
									))}
								</ul>
							)}
						</div>

						<nav aria-label="Footer" className="grid grid-cols-2 gap-5">
							<ul className="space-y-[10px]">
								{shopLinks.map((link) => (
									<li key={link.href}>
										<Link href={link.href} className={footerLink}>
											{link.label}
										</Link>
									</li>
								))}
							</ul>
							<ul className="space-y-[10px]">
								{infoLinks.map((link) => (
									<li key={link.href}>
										<Link href={link.href} className={footerLink}>
											{link.label}
										</Link>
									</li>
								))}
							</ul>
						</nav>

						<div>
							{legal.length > 0 ? (
								<ul className="space-y-[10px]">
									{legal.map((page) => (
										<li key={page.id}>
											<Link href={`/legal${page.href}`} className={footerLink}>
												{page.label}
											</Link>
										</li>
									))}
								</ul>
							) : (
								<ul className="space-y-[10px]">
									<li>
										<a href="/account" className={footerLink}>
											Your account
										</a>
									</li>
									<li>
										<Link href="/search" className={footerLink}>
											Search
										</Link>
									</li>
								</ul>
							)}
						</div>

						<div>
							<p className="text-uk-sm text-white">We accept</p>
							<PaymentMethods className="mt-[10px]" />
							<p className="mt-5 text-uk-xs">
								&copy; {year} {info.storeName}. All rights reserved.
							</p>
						</div>
					</div>
				</div>
			</footer>
		</>
	);
}
