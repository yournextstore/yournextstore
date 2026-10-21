import { cacheLife } from "next/cache";
import Link from "next/link";
import { NewsletterForm } from "@/components/newsletter-form";
import { PaymentMethods } from "@/components/payment-methods";
import { commerce } from "@/lib/commerce";
import { getCatalogueTiles, getSocialLinks, getStoreIdentity } from "@/lib/theme";

async function getFooterData() {
	"use cache";
	cacheLife("hours");

	const [identity, tiles, legal, socialLinks] = await Promise.all([
		getStoreIdentity(),
		getCatalogueTiles(),
		commerce.legalPageBrowse().catch(() => ({ data: [] })),
		getSocialLinks(),
	]);
	// `new Date()` is unstable during the prerender; caching pins it to the entry.
	const year = new Date().getFullYear();
	return { identity, tiles, legal: legal.data, socialLinks, year };
}

function Column({ title, children }: { title: string; children: React.ReactNode }) {
	return (
		<div>
			<h2 className="font-sans text-sm font-semibold tracking-[0.01em] text-on-ink uppercase">{title}</h2>
			<ul className="mt-4 space-y-2.5 text-[15px]">{children}</ul>
		</div>
	);
}

const linkClass = "text-on-ink/90 transition-colors hover:text-white hover:underline underline-offset-4";

/**
 * The original's near-black footer: a giant wordmark beside four link columns, a ruled middle
 * row (contact + newsletter), and a bottom bar with copyright, socials and payment marks.
 */
export async function Footer() {
	const { identity, tiles, legal, socialLinks, year } = await getFooterData();

	return (
		<footer className="bg-ink text-on-ink">
			<div className="shell">
				<div className="grid grid-cols-1 gap-12 pt-14 pb-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16 lg:pt-16">
					<div className="min-w-0">
						<Link
							href="/"
							className="block font-serif text-[clamp(2.75rem,7vw,6.5rem)] leading-[0.95] tracking-[-0.02em] wrap-break-word text-white uppercase"
						>
							{identity.name}
						</Link>
						{identity.description && (
							<p className="mt-6 max-w-sm text-[15px] leading-relaxed text-on-ink/90">
								{identity.description}
							</p>
						)}
					</div>
					<div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4">
						<Column title="Shop">
							{tiles.categories.slice(0, 5).map((c) => (
								<li key={c.href}>
									<Link href={c.href} className={linkClass}>
										{c.title}
									</Link>
								</li>
							))}
							<li>
								<Link href="/products" className={linkClass}>
									All products
								</Link>
							</li>
						</Column>
						<Column title="Collections">
							{tiles.collections.slice(0, 5).map((c) => (
								<li key={c.href}>
									<Link href={c.href} className={linkClass}>
										{c.title}
									</Link>
								</li>
							))}
							<li>
								<Link href="/search" className={linkClass}>
									Search
								</Link>
							</li>
						</Column>
						<Column title="Support">
							{identity.contactEnabled && (
								<li>
									<Link href="/contact" className={linkClass}>
										Contact
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
									Orders &amp; account
								</a>
							</li>
						</Column>
						<Column title="About">
							<li>
								<Link href="/about" className={linkClass}>
									Our story
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
				</div>
				{identity.newsletterEnabled && (
					<div className="flex flex-col gap-6 border-t border-ink-line py-10 lg:flex-row lg:items-start lg:justify-between">
						<div>
							<h2 className="font-sans text-sm font-semibold tracking-[0.01em] uppercase">Stay in touch</h2>
							<p className="mt-3 text-[15px] text-on-ink/90">News and inspiration in your inbox.</p>
						</div>
						<div className="w-full lg:max-w-md">
							<NewsletterForm tone="dark" />
						</div>
					</div>
				)}
				<div className="flex flex-col gap-5 border-t border-ink-line py-8 text-[15px] md:flex-row md:items-center md:justify-between">
					<div className="flex flex-wrap items-center gap-x-6 gap-y-3">
						<p>
							&copy; {year} {identity.name}.
						</p>
						{socialLinks.length > 0 && (
							<ul className="flex flex-wrap gap-x-4 gap-y-2">
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
					<PaymentMethods />
				</div>
			</div>
		</footer>
	);
}
