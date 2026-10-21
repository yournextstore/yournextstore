import { cacheLife } from "next/cache";
import Link from "next/link";
import { PaymentMethods } from "@/components/payment-methods";
import { commerce } from "@/lib/commerce";
import { getStoreConfig } from "@/lib/store-config";
import { getFeaturedCategories, getStoreIdentity } from "@/lib/theme";

const SOCIAL_LABELS: Record<string, string> = {
	instagram: "Instagram",
	facebook: "Facebook",
	x: "X",
	youtube: "YouTube",
	linkedin: "LinkedIn",
	tiktok: "TikTok",
};

async function getFooterData() {
	"use cache";
	cacheLife("hours");

	const [identity, categories, legal, socials, config] = await Promise.all([
		getStoreIdentity(),
		getFeaturedCategories(),
		commerce.legalPageBrowse().catch(() => ({ data: [] })),
		commerce.socialsGet().catch(() => null),
		getStoreConfig(),
	]);
	const socialLinks = Object.entries(socials?.socials ?? {}).flatMap(([network, url]) =>
		typeof url === "string" && url && SOCIAL_LABELS[network] ? [{ label: SOCIAL_LABELS[network], url }] : [],
	);
	// `new Date()` is unstable during the prerender; caching pins it to the entry.
	const year = new Date().getFullYear();
	return { identity, categories: categories.slice(0, 5), legal: legal.data, socialLinks, config, year };
}

function Column({ title, children }: { title: string; children: React.ReactNode }) {
	return (
		<div>
			<h2 className="font-serif text-xs font-medium tracking-[0.18em] uppercase text-on-ink">{title}</h2>
			<ul className="mt-5 space-y-3 text-sm">{children}</ul>
		</div>
	);
}

const linkClass = "text-ink-muted transition-colors hover:text-on-ink";

/** The original's near-black footer: wordmark + tagline, three link columns, a ruled bottom bar. */
export async function Footer() {
	const { identity, categories, legal, socialLinks, config, year } = await getFooterData();

	return (
		<footer className="bg-ink text-on-ink">
			<div className="shell">
				<div className="grid grid-cols-1 gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8 lg:py-16">
					<div className="lg:pr-10">
						<Link href="/" className="font-serif text-2xl font-medium tracking-wide">
							{identity.name}
						</Link>
						<p className="mt-4 max-w-xs text-sm/6 text-ink-muted">
							{identity.description ??
								"Curated pieces for the modern wardrobe. Made to be worn, and kept, for years."}
						</p>
						{socialLinks.length > 0 && (
							<ul className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-sm">
								{socialLinks.map((s) => (
									<li key={s.label}>
										<a href={s.url} target="_blank" rel="noopener noreferrer" className={linkClass}>
											{s.label}
										</a>
									</li>
								))}
							</ul>
						)}
					</div>
					<Column title="Shop">
						<li>
							<Link href="/products" className={linkClass}>
								New Arrivals
							</Link>
						</li>
						{categories.map((c) => (
							<li key={c.slug}>
								<Link href={`/category/${c.slug}`} className={linkClass}>
									{c.name}
								</Link>
							</li>
						))}
						<li>
							<Link href="/products" className={linkClass}>
								All Products
							</Link>
						</li>
					</Column>
					<Column title="Help">
						{identity.contactEnabled && (
							<li>
								<Link href="/contact" className={linkClass}>
									Contact Us
								</Link>
							</li>
						)}
						<li>
							<Link href="/faq" className={linkClass}>
								FAQ
							</Link>
						</li>
						<li>
							<a href="/account" className={linkClass}>
								Orders &amp; Account
							</a>
						</li>
						<li>
							<Link href="/search" className={linkClass}>
								Search
							</Link>
						</li>
					</Column>
					<Column title="About">
						<li>
							<Link href="/about" className={linkClass}>
								Our Story
							</Link>
						</li>
						{identity.blogEnabled && (
							<li>
								<Link href="/blog" className={linkClass}>
									Journal
								</Link>
							</li>
						)}
						{legal.map((page) => (
							<li key={page.id}>
								<Link href={`/legal${page.href}`} className={linkClass}>
									{page.label}
								</Link>
							</li>
						))}
					</Column>
				</div>
				<div className="flex flex-col gap-4 border-t border-ink-line py-6 text-xs text-ink-muted md:flex-row md:items-center md:justify-between">
					<p>
						&copy; {year} {identity.name}. All rights reserved.
					</p>
					<PaymentMethods />
					<p>Prices in {config.currency}</p>
				</div>
			</div>
		</footer>
	);
}
