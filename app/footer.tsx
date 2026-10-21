import { cacheLife } from "next/cache";
import Link from "next/link";
import { PaymentMethods } from "@/components/payment-methods";
import { commerce } from "@/lib/commerce";
import { getShopInfo } from "@/lib/shop";

async function getFooterData() {
	"use cache";
	cacheLife("hours");
	const [shop, legal] = await Promise.all([getShopInfo(), commerce.legalPageBrowse().catch(() => null)]);
	// `new Date()` is an unstable value: caching pins it to the entry so the footer stays in the shell.
	return { shop, legal: legal?.data ?? [], year: new Date().getFullYear() };
}

const linkClass = "hover:text-black hover:underline";

export async function Footer() {
	const { shop, legal, year } = await getFooterData();
	const links = [
		{ href: "/products", label: "Shop" },
		{ href: "/about", label: "About" },
		...(shop.contactForm ? [{ href: "/contact", label: "Contact" }] : []),
		...(shop.blog ? [{ href: "/blog", label: "Journal" }] : []),
		...legal.map((page) => ({ href: `/legal${page.href}`, label: page.label })),
	];

	return (
		<footer className="container mx-auto border-t border-rule bg-background py-8">
			<div className="flex flex-wrap px-6 py-8 md:px-3">
				<div className="w-full lg:w-1/2">
					<div className="lg:max-w-xl">
						<h2 className="font-bold text-gray-900">About</h2>
						<p className="py-4">
							{shop.description ??
								`${shop.storeName} gathers quiet, useful things for every day: pieces chosen to sit well together.`}
						</p>
					</div>
				</div>
				{shop.socials.length > 0 && (
					<div className="mt-6 flex w-full lg:mt-0 lg:w-1/2 lg:justify-end">
						<div>
							<h2 className="font-bold text-gray-900">Social</h2>
							<ul className="flex flex-wrap items-center gap-x-4 gap-y-1 py-4">
								{shop.socials.map((social) => (
									<li key={social.href}>
										<a href={social.href} target="_blank" rel="noreferrer" className={linkClass}>
											{social.label}
										</a>
									</li>
								))}
							</ul>
						</div>
					</div>
				)}
				<nav aria-label="Footer" className="mt-6 w-full">
					<ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
						{links.map((link) => (
							<li key={link.href}>
								<Link href={link.href} className={linkClass}>
									{link.label}
								</Link>
							</li>
						))}
					</ul>
				</nav>
				<div className="mt-8 flex w-full flex-col gap-4 text-sm sm:flex-row sm:items-center sm:justify-between">
					<p>
						&copy; {year} {shop.storeName}
					</p>
					<PaymentMethods />
				</div>
			</div>
		</footer>
	);
}
