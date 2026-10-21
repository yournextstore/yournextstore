import { cacheLife } from "next/cache";
import Link from "next/link";
import { NewsletterForm } from "@/components/newsletter-form";
import { PaymentMethods } from "@/components/payment-methods";
import { commerce } from "@/lib/commerce";
import { getCatalogueTiles, getSocialLinks, getStoreIdentity, resellerHref } from "@/lib/theme";

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
			<h2 className="font-sans text-sm font-medium tracking-normal text-on-ink">{title}</h2>
			<ul className="mt-4 space-y-2 text-sm lg:mt-6">{children}</ul>
		</div>
	);
}

const linkClass = "reveal-underline text-on-ink hover:bg-size-[100%_1px]";

function StarDivider() {
	return (
		<div className="flex w-full items-center gap-4">
			<div className="h-px flex-1 bg-line opacity-35" />
			<svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="h-5 w-5 text-[#8a8884]">
				<path
					d="M9.77 1.73a.83.83 0 0 0-.17.18L7.68 5.81a2.5 2.5 0 0 1-1.33 1l-4.3.6a.42.42 0 0 0-.25.75l3.12 3.03c.2.2.36.45.45.72.09.27.11.56.06.85l-.73 4.28a.42.42 0 0 0 .61.47l3.85-2.02a1.75 1.75 0 0 1 1.64 0l3.85 2.02a.42.42 0 0 0 .61-.47l-.73-4.28a1.75 1.75 0 0 1 .5-1.57l3.12-3.03a.42.42 0 0 0-.24-.75l-4.3-.63a1.75 1.75 0 0 1-1.33-.97L10.4 1.91a.42.42 0 0 0-.63-.18Z"
					stroke="currentColor"
					strokeLinecap="round"
					strokeWidth="1.5"
				/>
			</svg>
			<div className="h-px flex-1 bg-line opacity-35" />
		</div>
	);
}

/**
 * The original's taupe-charcoal footer: brand blurb and socials beside the "Stay in touch" card,
 * four link columns, copyright and payment marks, a star divider and the store name set huge,
 * widely tracked and faded across the full width.
 */
export async function Footer() {
	const { identity, tiles, legal, socialLinks, year } = await getFooterData();
	// Large enough to read as a wordmark, small enough that the letters never touch.
	const wordmarkSize = Math.round(Math.min(150, 1300 / Math.max(identity.name.length, 1)));

	return (
		<footer className="bg-ink pt-9 text-on-ink lg:pt-16">
			<div className="mx-auto w-full max-w-[80rem] px-5 md:px-6">
				<div className="flex flex-col gap-12 pb-10 md:flex-row md:gap-6 lg:gap-16">
					<div className="flex flex-1 flex-col items-start gap-4">
						<p className="font-serif text-lg">Our shop</p>
						<p className="max-w-lg text-base leading-relaxed text-ink-muted">
							{identity.description ??
								`${identity.name} brings together well-made everyday things, chosen with care.`}
						</p>
						{socialLinks.length > 0 && (
							<ul className="flex flex-wrap gap-2">
								{socialLinks.map((s) => (
									<li key={s.label}>
										<a
											href={s.url}
											target="_blank"
											rel="noopener noreferrer"
											className="inline-flex h-8 items-center rounded-full border border-line px-3 text-xs transition-opacity hover:opacity-70"
										>
											{s.label}
										</a>
									</li>
								))}
							</ul>
						)}
					</div>
					{identity.newsletterEnabled && (
						<div className="flex flex-1 flex-col gap-3 rounded-lg bg-ink-card p-6">
							<p className="font-serif text-[22px] uppercase">Stay in touch</p>
							<p className="text-[13px] text-ink-muted">News and inspiration in your inbox, every week.</p>
							<NewsletterForm tone="dark" />
						</div>
					)}
				</div>
				<div className="grid grid-cols-2 gap-x-6 gap-y-10 py-10 md:grid-cols-4 lg:gap-8">
					<Column title="Collections">
						{tiles.collections.slice(0, 4).map((c) => (
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
					<Column title="Shop">
						{tiles.categories.slice(0, 4).map((c) => (
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
						<li>
							<Link href="/faq" className={linkClass}>
								FAQ
							</Link>
						</li>
						<li>
							<Link href={resellerHref(identity.contactEnabled)} className={linkClass}>
								Contact
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
						<li>
							<Link href={resellerHref(identity.contactEnabled)} className={linkClass}>
								Become a reseller
							</Link>
						</li>
						{identity.blogEnabled && (
							<li>
								<Link href="/blog" className={linkClass}>
									Blog
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
				<div className="h-px w-full bg-line opacity-35" />
				<div className="flex flex-col gap-6 py-6 md:flex-row md:items-center md:justify-between">
					<p className="order-2 text-sm md:order-1">
						&copy; {year} {identity.name}.
					</p>
					<div className="order-1 md:order-2">
						<PaymentMethods />
					</div>
				</div>
				<StarDivider />
				{/* The tracked-out name spans the divider's width: SVG text spread with textLength (decorative,
				    so it is out of the accessibility tree and out of the contrast audit, as a picture). */}
				<svg
					aria-hidden="true"
					viewBox={`0 0 1000 ${wordmarkSize}`}
					className="block w-full pt-5 pb-10 lg:pt-8 lg:pb-14"
				>
					<text
						x="0"
						y={wordmarkSize * 0.86}
						textLength="1000"
						lengthAdjust="spacing"
						fontSize={wordmarkSize}
						className="fill-[rgb(241_241_230/0.2)] font-serif uppercase"
					>
						{identity.name}
					</text>
				</svg>
			</div>
		</footer>
	);
}
