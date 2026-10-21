import { cacheLife } from "next/cache";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { PaymentMethods } from "@/components/payment-methods";
import { getStoreInfo } from "@/lib/catalog";

// `new Date()` is an unstable value: now that the footer is part of the prerendered
// shell, reading it during the prerender is an error. Caching pins it to the entry.
async function getCopyrightYear() {
	"use cache";
	cacheLife("days");

	return new Date().getFullYear();
}

const SOCIAL_SHORT: Record<string, string> = {
	facebook: "Fb",
	x: "X",
	instagram: "Ig",
	linkedin: "In",
	youtube: "Yt",
	tiktok: "Tt",
};

/** The original's light-grey footer: logo · menu · socials, then legal links and the credit line. */
export async function Footer() {
	const [year, info] = await Promise.all([getCopyrightYear(), getStoreInfo()]);
	const menu = [
		{ href: "/about", label: "About" },
		{ href: "/products", label: "Products" },
		{ href: "/faq", label: "FAQ" },
		...(info.contact ? [{ href: "/contact", label: "Contact" }] : []),
		...(info.blog ? [{ href: "/blog", label: "Blog" }] : []),
	];

	return (
		<footer className="bg-light">
			<div className="shell">
				<div className="flex flex-col items-center gap-6 py-10 text-center md:flex-row md:justify-between md:py-14 md:text-left">
					<div className="md:w-1/4">
						<Logo name={info.storeName} />
					</div>
					<ul className="flex flex-wrap justify-center gap-x-5 gap-y-2 md:gap-x-8">
						{menu.map((item) => (
							<li key={item.href}>
								<Link
									href={item.href}
									className="text-sm font-semibold text-soft-text transition-colors hover:text-ink md:text-base"
								>
									{item.label}
								</Link>
							</li>
						))}
					</ul>
					<div className="flex justify-end md:w-1/4">
						{info.socialLinks.length > 0 ? (
							<ul className="flex items-center gap-2">
								{info.socialLinks.map((social) => (
									<li key={social.network}>
										<a
											href={social.href}
											target="_blank"
											rel="noopener noreferrer"
											aria-label={social.label}
											className="flex size-10 items-center justify-center rounded-full border border-border bg-background text-sm font-bold text-ink transition-colors hover:bg-ink hover:text-background"
										>
											{SOCIAL_SHORT[social.network] ?? social.label.slice(0, 2)}
										</a>
									</li>
								))}
							</ul>
						) : (
							<PaymentMethods />
						)}
					</div>
				</div>
				<div className="flex flex-col items-center gap-3 border-t border-border py-6 text-center text-sm md:flex-row md:justify-between md:py-8">
					<ul className="flex flex-wrap justify-center gap-x-4 gap-y-1">
						{info.legalPages.map((page) => (
							<li key={page.href}>
								<Link
									href={page.href}
									className="font-semibold text-soft-text transition-colors hover:text-ink"
								>
									{page.label}
								</Link>
							</li>
						))}
					</ul>
					<p className="text-soft-text">
						&copy; {year} {info.storeName}. All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
}
