import { cacheLife } from "next/cache";
import { YnsLink } from "@/components/yns-link";
import { commerce, meGetCached } from "@/lib/commerce";

async function FooterBlogLink() {
	"use cache";
	cacheLife("hours");

	const me = await meGetCached().catch(() => null);
	if (!me?.store.settings?.enabledTools?.blog) {
		return null;
	}

	return (
		<li>
			<YnsLink
				prefetch={"eager"}
				href="/blog"
				className="font-display italic text-[15px] text-[var(--cream)]/85 hover:text-[var(--sand)] transition-colors"
			>
				Blog
			</YnsLink>
		</li>
	);
}

async function FooterContactLink() {
	"use cache";
	cacheLife("hours");

	const me = await meGetCached().catch(() => null);
	if (!me?.store.settings?.enabledTools?.contactForm) {
		return null;
	}

	return (
		<li>
			<YnsLink
				prefetch={"eager"}
				href="/contact"
				className="font-display italic text-[15px] text-[var(--cream)]/85 hover:text-[var(--sand)] transition-colors"
			>
				Contact Us
			</YnsLink>
		</li>
	);
}

async function FooterCollections() {
	"use cache";
	cacheLife("hours");

	const collections = await commerce.collectionBrowse({ limit: 5 });

	if (collections.data.length === 0) {
		return null;
	}

	return (
		<div>
			<h3 className="heritage-smallcaps text-[var(--cream)]/80">Shop</h3>
			<ul className="mt-5 space-y-2.5">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/collection/${collection.slug}`}
							className="font-display italic text-[15px] text-[var(--cream)]/85 hover:text-[var(--sand)] transition-colors"
						>
							{collection.name}
						</YnsLink>
					</li>
				))}
				<li>
					<YnsLink
						prefetch={"eager"}
						href="/products"
						className="font-display italic text-[15px] text-[var(--cream)]/85 hover:text-[var(--sand)] transition-colors"
					>
						The whole catalogue
					</YnsLink>
				</li>
			</ul>
		</div>
	);
}

async function FooterLegalPages() {
	"use cache";
	cacheLife("hours");

	const pages = await commerce.legalPageBrowse();

	if (pages.data.length === 0) {
		return null;
	}

	return (
		<div>
			<h3 className="heritage-smallcaps text-[var(--cream)]/80">The Fine Print</h3>
			<ul className="mt-5 space-y-2.5">
				{pages.data.map((page) => (
					<li key={page.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/legal${page.href}`}
							className="font-display italic text-[15px] text-[var(--cream)]/85 hover:text-[var(--sand)] transition-colors"
						>
							{page.label}
						</YnsLink>
					</li>
				))}
			</ul>
		</div>
	);
}

export function Footer() {
	return (
		<footer className="heritage-oxblood-gradient text-[var(--cream)]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="pt-16 sm:pt-20 pb-12 grid grid-cols-2 lg:grid-cols-12 gap-10">
					<div className="col-span-2 lg:col-span-4">
						<YnsLink prefetch={"eager"} href="/" className="block">
							<span className="font-display text-3xl sm:text-4xl tracking-[-0.01em] text-[var(--cream)]">
								Your Next Store
							</span>
						</YnsLink>
						<p className="mt-4 max-w-sm text-[15px] italic leading-relaxed text-[var(--cream)]/75">
							A heritage mattress workshop on Elizabeth Street. Hand-tufted goods, ticking-striped cotton, and
							a hundred-year ledger of slow, repairable sleep.
						</p>
						<address className="mt-6 not-italic font-sans text-[13px] leading-relaxed text-[var(--cream)]/65">
							The Workshop, 114 Elizabeth Street
							<br />
							New York · Open by appointment
							<br />
							<a
								href="mailto:bench@yournextstore.com"
								className="underline-offset-4 hover:text-[var(--sand)]"
							>
								bench@yournextstore.com
							</a>
						</address>
					</div>

					<div className="col-span-1 lg:col-span-2">
						<FooterCollections />
					</div>

					<div className="col-span-1 lg:col-span-2">
						<h3 className="heritage-smallcaps text-[var(--cream)]/80">Workroom</h3>
						<ul className="mt-5 space-y-2.5">
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/#story"
									className="font-display italic text-[15px] text-[var(--cream)]/85 hover:text-[var(--sand)] transition-colors"
								>
									Our story
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/about"
									className="font-display italic text-[15px] text-[var(--cream)]/85 hover:text-[var(--sand)] transition-colors"
								>
									About Us
								</YnsLink>
							</li>
							<FooterContactLink />
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/faq"
									className="font-display italic text-[15px] text-[var(--cream)]/85 hover:text-[var(--sand)] transition-colors"
								>
									FAQ
								</YnsLink>
							</li>
							<FooterBlogLink />
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/#journal"
									className="font-display italic text-[15px] text-[var(--cream)]/85 hover:text-[var(--sand)] transition-colors"
								>
									Journal
								</YnsLink>
							</li>
						</ul>
					</div>

					<div className="col-span-2 lg:col-span-2">
						<FooterLegalPages />
					</div>

					<div className="col-span-2 lg:col-span-2">
						<h3 className="heritage-smallcaps text-[var(--cream)]/80">Correspondence</h3>
						<ul className="mt-5 space-y-2.5 font-display italic text-[15px] text-[var(--cream)]/85">
							{[
								{ label: "Instagram", href: "https://instagram.com" },
								{ label: "Pinterest", href: "https://pinterest.com" },
								{ label: "Substack", href: "https://substack.com" },
							].map((s) => (
								<li key={s.label}>
									<a href={s.href} className="hover:text-[var(--sand)] transition-colors">
										{s.label}
									</a>
								</li>
							))}
						</ul>
					</div>
				</div>

				<div className="border-t border-[var(--cream)]/15 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
					<p className="font-sans text-[12px] tracking-[0.18em] uppercase text-[var(--cream)]/55">
						© {new Date().getFullYear()} Your Next Store · Est. an heirloom
					</p>
					<p className="font-display italic text-[13px] text-[var(--cream)]/65">
						Made slowly, in a brownstone, in New York.
					</p>
				</div>
			</div>
		</footer>
	);
}
