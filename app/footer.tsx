import { cacheLife } from "next/cache";
import Link from "next/link";
import { PaymentMethods } from "@/components/payment-methods";
import {
	getCategoryTiles,
	getCollectionTiles,
	getCopyrightYear,
	getLegalLinks,
	getSocialLinks,
	getStoreBrand,
} from "@/lib/catalog";

async function getFooterData() {
	"use cache";
	cacheLife("hours");
	const [brand, categories, collections, legal, socials, year] = await Promise.all([
		getStoreBrand(),
		getCategoryTiles(),
		getCollectionTiles(),
		getLegalLinks(),
		getSocialLinks(),
		getCopyrightYear(),
	]);
	return { brand, categories, collections, legal, socials, year };
}

const linkClass = "inline-block transition hover:text-green-600";

function LinkColumn({
	title,
	links,
}: {
	title: string;
	links: { href: string; label: string; plain?: boolean }[];
}) {
	if (links.length === 0) return null;
	return (
		<div className="mb-6 flex w-1/2 flex-col gap-4 md:w-1/4">
			<h2 className="text-fc-base">{title}</h2>
			<ul className="flex flex-col gap-2">
				{links.map((link) => (
					<li key={link.href}>
						{link.plain ? (
							// Plain <a>: /account and /checkout are proxied zones (see AGENTS.md).
							<a href={link.href} className={linkClass}>
								{link.label}
							</a>
						) : (
							<Link href={link.href} className={linkClass}>
								{link.label}
							</Link>
						)}
					</li>
				))}
			</ul>
		</div>
	);
}

/** FreshCart's grey footer: two-column category list, four link columns, payment row, copyright row. */
export async function Footer() {
	const { brand, categories, collections, legal, socials, year } = await getFooterData();
	const half = Math.ceil(categories.length / 2);
	const categoryColumns = [categories.slice(0, half), categories.slice(half)].filter((c) => c.length > 0);

	return (
		<footer className="bg-gray-200 py-8">
			<div className="fc-container">
				<div className="mb-6 flex flex-wrap py-4 md:gap-4 lg:flex-nowrap lg:gap-0">
					{categoryColumns.length > 0 ? (
						<div className="mb-6 flex w-full flex-col gap-4 lg:w-1/3">
							<h2 className="text-fc-base">Categories</h2>
							<div className="flex flex-wrap">
								{categoryColumns.map((column) => (
									<ul key={column[0]?.id} className="flex w-1/2 flex-col gap-2 pr-4">
										{column.map((category) => (
											<li key={category.id}>
												<Link href={category.href} className={linkClass}>
													{category.name}
												</Link>
											</li>
										))}
									</ul>
								))}
							</div>
						</div>
					) : null}
					<div className="w-full lg:w-2/3">
						<div className="flex flex-wrap">
							<LinkColumn
								title="Get to know us"
								links={[
									{ href: "/about", label: "About" },
									...(brand.blog ? [{ href: "/blog", label: "Blog" }] : []),
									{ href: "/faq", label: "Help Center" },
									...(brand.contact ? [{ href: "/contact", label: "Contact" }] : []),
								]}
							/>
							<LinkColumn
								title="For consumers"
								links={[
									{ href: "/products", label: "All products" },
									{ href: "/search", label: "Search" },
									{ href: "/account", label: "My account", plain: true },
									{ href: "/faq", label: "FAQ" },
								]}
							/>
							<LinkColumn
								title="Collections"
								links={collections.slice(0, 5).map((c) => ({ href: c.href, label: c.name }))}
							/>
							<LinkColumn title="Policies" links={legal} />
						</div>
					</div>
				</div>
				<div className="border-t border-gray-300 py-4">
					<div className="flex flex-wrap items-center justify-center gap-y-4 lg:justify-between">
						<div className="flex flex-col items-center gap-3 md:flex-row md:gap-6">
							<span className="text-gray-900">Payment Partners</span>
							<PaymentMethods />
						</div>
						<div className="flex flex-col items-center gap-3 md:flex-row md:gap-6">
							<span className="text-gray-900">Get deliveries with {brand.name}</span>
							<Link href="/products" className="fc-btn fc-btn-dark">
								Start shopping
							</Link>
						</div>
					</div>
				</div>
				<div className="border-t border-gray-300 py-4">
					<div className="flex flex-col items-center gap-3 md:flex-row">
						<p className="text-fc-sm md:w-1/2">
							© {year} {brand.name}. All rights reserved.
						</p>
						{socials.length > 0 ? (
							<div className="flex items-center gap-5 md:w-1/2 md:justify-end">
								<span>Follow us on</span>
								<ul className="flex items-center gap-1 text-fc-sm">
									{socials.map((social) => (
										<li key={social.key}>
											<a
												href={social.href}
												target="_blank"
												rel="noreferrer"
												className="inline-flex h-8 items-center rounded border border-gray-300 px-2 transition hover:border-green-500 hover:text-green-600"
											>
												{social.label}
											</a>
										</li>
									))}
								</ul>
							</div>
						) : null}
					</div>
				</div>
			</div>
		</footer>
	);
}
