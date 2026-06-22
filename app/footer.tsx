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
				className="text-[12px] text-[var(--ivory)]/65 hover:text-[var(--ivory)] transition-colors"
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
				className="text-[12px] text-[var(--ivory)]/65 hover:text-[var(--ivory)] transition-colors"
			>
				Contact Us
			</YnsLink>
		</li>
	);
}

const linkClass = "text-[12px] text-foreground/65 hover:text-foreground transition-colors";
const headingClass = "text-[10px] uppercase tracking-[0.32em] text-foreground/45";

async function FooterCollections() {
	"use cache";
	cacheLife("hours");

	const collections = await commerce.collectionBrowse({ limit: 5 });

	if (collections.data.length === 0) {
		return null;
	}

	return (
		<div>
			<h3 className={headingClass}>The Range</h3>
			<ul className="mt-5 space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<YnsLink prefetch={"eager"} href={`/collection/${collection.slug}`} className={linkClass}>
							{collection.name}
						</YnsLink>
					</li>
				))}
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
			<h3 className={headingClass}>Fine print</h3>
			<ul className="mt-5 space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<YnsLink prefetch={"eager"} href={`/legal${page.href}`} className={linkClass}>
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
		<footer className="bg-[var(--ink)] text-[var(--ivory)]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-10">
				{/* Wordmark sign-off */}
				<div className="text-center pb-14 border-b border-white/10">
					<YnsLink
						prefetch={"eager"}
						href="/"
						className="font-serif italic font-light text-[14vw] sm:text-[10rem] leading-[0.85] tracking-tight text-[var(--ivory)] block"
					>
						Your Next Store
					</YnsLink>
					<p className="mt-6 font-serif italic text-lg text-[var(--ivory)]/60">
						A laundry ritual, packed in paper.
					</p>
				</div>

				{/* Columns */}
				<div className="pt-14 grid grid-cols-2 md:grid-cols-4 gap-10 text-[var(--ivory)]">
					<div>
						<h3 className={`${headingClass} text-[var(--ivory)]/45`}>Studio</h3>
						<p className="mt-5 text-[12px] leading-[1.7] text-[var(--ivory)]/65 max-w-[28ch]">
							Mess-free, enzyme-powered laundry detergent sheets in signature scents. Made slowly.
						</p>
					</div>
					{/* Collections (override text colors for dark footer via wrapper) */}
					<div className="[&_*]:!text-[var(--ivory)]/65 [&_h3]:!text-[var(--ivory)]/45 hover:[&_a]:!text-[var(--ivory)] [&_a]:transition-colors">
						<FooterCollections />
					</div>
					<div>
						<h3 className={`${headingClass} text-[var(--ivory)]/45`}>Care</h3>
						<ul className="mt-5 space-y-3">
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/about"
									className="text-[12px] text-[var(--ivory)]/65 hover:text-[var(--ivory)] transition-colors"
								>
									About Us
								</YnsLink>
							</li>
							<FooterContactLink />
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/faq"
									className="text-[12px] text-[var(--ivory)]/65 hover:text-[var(--ivory)] transition-colors"
								>
									FAQ
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/products"
									className="text-[12px] text-[var(--ivory)]/65 hover:text-[var(--ivory)] transition-colors"
								>
									Shop
								</YnsLink>
							</li>
							<FooterBlogLink />
						</ul>
					</div>
					<div className="[&_*]:!text-[var(--ivory)]/65 [&_h3]:!text-[var(--ivory)]/45 hover:[&_a]:!text-[var(--ivory)] [&_a]:transition-colors">
						<FooterLegalPages />
					</div>
				</div>

				{/* Bottom bar */}
				<div className="mt-14 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
					<p className="text-[10px] uppercase tracking-[0.28em] text-[var(--ivory)]/45">
						&copy; {new Date().getFullYear()} Your Next Store — All rights reserved
					</p>
					<p className="text-[10px] uppercase tracking-[0.28em] text-[var(--ivory)]/45">
						Designed slowly, shipped in paper
					</p>
				</div>
			</div>
		</footer>
	);
}
