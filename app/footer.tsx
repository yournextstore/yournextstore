import { Heart } from "lucide-react";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { try_ } from "safe-try";
import { PaymentMethods } from "@/components/payment-methods";
import { commerce } from "@/lib/commerce";
import { getShelves, getShopInfo } from "@/lib/shop";

async function getLegalLinks() {
	"use cache";
	cacheLife("hours");
	const [error, pages] = await try_(commerce.legalPageBrowse());
	return error ? [] : pages.data.map((page) => ({ href: `/legal${page.href}`, label: page.label }));
}

// `new Date()` is an unstable value: now that the footer is part of the prerendered
// shell, reading it during the prerender is an error. Caching pins it to the entry.
async function getCopyrightYear() {
	"use cache";
	cacheLife("days");

	return new Date().getFullYear();
}

const linkClass = "link-dashed text-foreground/90 hover:text-foreground";

export async function Footer() {
	const [year, shop, shelves, legal] = await Promise.all([
		getCopyrightYear(),
		getShopInfo(),
		getShelves(),
		getLegalLinks(),
	]);

	const quickLinks = [
		{ href: "/about", label: "About Us" },
		...(shop.contactForm ? [{ href: "/contact", label: "Contact Us" }] : []),
		{ href: "/faq", label: "FAQ" },
		...(shop.blog ? [{ href: "/blog", label: "Blog" }] : []),
		...legal,
	];

	return (
		<footer className="mt-auto">
			<div className="border-t-2 border-muted bg-card">
				<div className="shelf-container grid gap-y-8 py-10 md:grid-cols-[2fr_1fr_1fr] md:gap-x-10 md:py-12">
					<div className="flex flex-col gap-y-4">
						<h2 className="font-serif text-xl font-semibold">{shop.storeName}</h2>
						<div className="max-w-md space-y-2 text-sm leading-relaxed">
							<p>
								{shop.description ||
									"We are an independent bookshop with a carefully chosen selection of novels, non-fiction and children's books, plus a few good things to read with."}
							</p>
							<p>
								We aim to make browsing feel like an afternoon among well-kept shelves: unhurried, friendly
								and full of surprises.
							</p>
						</div>
						{shop.socials.length > 0 ? (
							<ul className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-sm">
								{shop.socials.map((social) => (
									<li key={social.href}>
										<a href={social.href} target="_blank" rel="noreferrer" className={linkClass}>
											{social.label}
										</a>
									</li>
								))}
							</ul>
						) : null}
					</div>
					<div>
						<h2 className="mb-3 font-serif text-xl font-semibold">Quick Links</h2>
						<ul className="flex flex-col gap-y-2">
							{quickLinks.map((link) => (
								<li key={link.href}>
									<Link href={link.href} className={linkClass}>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>
					<div>
						<h2 className="mb-3 font-serif text-xl font-semibold">Browse</h2>
						<ul className="flex flex-col gap-y-2">
							<li>
								<Link href="/products" className={linkClass}>
									All Products
								</Link>
							</li>
							{shelves.categories.slice(0, 5).map((link) => (
								<li key={link.href}>
									<Link href={link.href} className={linkClass}>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
						{shop.email ? (
							<p className="mt-5 text-sm">
								<span className="block">Email:</span>
								<a href={`mailto:${shop.email}`} className={linkClass}>
									{shop.email}
								</a>
							</p>
						) : null}
					</div>
				</div>
				<div className="shelf-container pb-6">
					<PaymentMethods />
				</div>
			</div>
			<div className="bg-primary text-primary-foreground">
				<div className="shelf-container flex flex-col gap-1 py-2 text-sm sm:flex-row sm:items-center sm:justify-between md:text-base">
					<p>
						&copy; Copyright {year} - {shop.storeName}
					</p>
					<p className="flex items-center gap-x-2">
						Crafted with
						<Heart aria-label="love" className="h-4 w-4 fill-current" />
						for curious minds
					</p>
				</div>
			</div>
		</footer>
	);
}
