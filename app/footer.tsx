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
			<YnsLink prefetch={"eager"} href="/blog" className="hover:text-white transition-colors">
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
			<YnsLink prefetch={"eager"} href="/contact" className="hover:text-white transition-colors">
				Contact Us
			</YnsLink>
		</li>
	);
}

function SocialIcon({ kind }: { kind: "ig" | "fb" | "x" | "yt" }) {
	const common = "h-5 w-5";
	if (kind === "ig") {
		return (
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={common}>
				<rect x="3" y="3" width="18" height="18" rx="5" />
				<circle cx="12" cy="12" r="4" />
				<circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
			</svg>
		);
	}
	if (kind === "fb") {
		return (
			<svg viewBox="0 0 24 24" fill="currentColor" className={common}>
				<path d="M13 22v-8h3l1-4h-4V7.5C13 6.4 13.4 6 14.5 6H17V2.2C16.5 2.1 15.2 2 14 2c-3 0-5 1.8-5 5.2V10H6v4h3v8h4z" />
			</svg>
		);
	}
	if (kind === "x") {
		return (
			<svg viewBox="0 0 24 24" fill="currentColor" className={common}>
				<path d="M3 3h4.2l4.6 6.2L17 3h3.6l-6.8 7.9L21 21h-4.2l-5-6.8L5 21H1.4l7.2-8.4L3 3z" />
			</svg>
		);
	}
	return (
		<svg viewBox="0 0 24 24" fill="currentColor" className={common}>
			<path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18 5 12 5 12 5s-6 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C6 19 12 19 12 19s6 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8c.3-1.5.4-3 .4-4.8 0-1.7-.1-3.3-.4-4.8zM10 15V9l5 3-5 3z" />
		</svg>
	);
}

async function FooterCollections() {
	"use cache";
	cacheLife("hours");

	const collections = await commerce.collectionBrowse({ limit: 6 });

	if (collections.data.length === 0) {
		return null;
	}

	return (
		<div>
			<h3 className="text-[11px] uppercase tracking-[0.18em] font-semibold text-foreground">Shop</h3>
			<ul className="mt-5 space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/collection/${collection.slug}`}
							className="text-sm text-foreground/65 hover:text-foreground transition-colors"
						>
							{collection.name}
						</YnsLink>
					</li>
				))}
				<li>
					<YnsLink
						href="/products"
						className="text-sm text-foreground/65 hover:text-foreground transition-colors"
					>
						All products
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
			<h3 className="text-[11px] uppercase tracking-[0.18em] font-semibold text-foreground">Legal</h3>
			<ul className="mt-5 space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/legal${page.href}`}
							className="text-sm text-foreground/65 hover:text-foreground transition-colors"
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
		<footer className="bg-[--ink] text-[--bone]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-10">
				{/* Top CTA strip */}
				<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-12 border-b border-white/10">
					<div className="max-w-md">
						<h3 className="display-section text-3xl sm:text-4xl text-white tracking-tight">
							Stay close to the brand.
						</h3>
						<p className="mt-3 text-sm text-white/60">
							Behind-the-scenes drops, training notes, and stories — straight to your inbox.
						</p>
					</div>
					<form className="flex w-full max-w-md gap-2">
						<input
							type="email"
							placeholder="email address"
							className="h-11 flex-1 border border-white/20 bg-transparent px-4 text-white text-sm outline-none placeholder:text-white/40 focus:border-white"
						/>
						<button
							type="submit"
							className="h-11 px-6 bg-white text-[--ink] text-xs uppercase tracking-[0.18em] font-semibold hover:bg-[--bone]"
						>
							Join
						</button>
					</form>
				</div>

				{/* Link columns */}
				<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-10 sm:gap-8 py-12">
					{/* Brand */}
					<div className="col-span-2 lg:col-span-2 sm:max-w-xs">
						<div className="flex items-center gap-2 text-white">
							<svg viewBox="0 0 40 24" className="h-6 w-auto" aria-hidden="true" fill="none">
								<path d="M2 22 L12 4 L22 22" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
								<path d="M16 22 L26 4 L36 22" stroke="#8c2a24" strokeWidth="3" strokeLinecap="round" />
								<circle cx="32" cy="4" r="2" fill="#e3b766" />
							</svg>
							<span className="display-section text-lg tracking-tight uppercase font-bold">
								Your Next Store
							</span>
						</div>
						<p className="mt-4 text-sm text-white/60 leading-relaxed">
							Performance apparel built for the way you move — and the way you live the rest of the day.
						</p>
						<div className="mt-6 flex items-center gap-4 text-white/60">
							<a href="#" className="hover:text-white" aria-label="Instagram">
								<SocialIcon kind="ig" />
							</a>
							<a href="#" className="hover:text-white" aria-label="Facebook">
								<SocialIcon kind="fb" />
							</a>
							<a href="#" className="hover:text-white" aria-label="X">
								<SocialIcon kind="x" />
							</a>
							<a href="#" className="hover:text-white" aria-label="YouTube">
								<SocialIcon kind="yt" />
							</a>
						</div>
					</div>

					<FooterCollections />

					<div>
						<h3 className="text-[11px] uppercase tracking-[0.18em] font-semibold text-white">Help</h3>
						<ul className="mt-5 space-y-3 text-sm text-white/65">
							<li>
								<YnsLink prefetch={"eager"} href="/about" className="hover:text-white transition-colors">
									About Us
								</YnsLink>
							</li>
							<FooterContactLink />
							<li>
								<YnsLink href="/faq" className="hover:text-white transition-colors">
									FAQ
								</YnsLink>
							</li>
							<FooterBlogLink />
							<li>
								<a href="#" className="hover:text-white transition-colors">
									Shipping & Returns
								</a>
							</li>
							<li>
								<a href="#" className="hover:text-white transition-colors">
									Size Guide
								</a>
							</li>
							<li>
								<a href="#" className="hover:text-white transition-colors">
									Contact
								</a>
							</li>
						</ul>
					</div>

					<div>
						<h3 className="text-[11px] uppercase tracking-[0.18em] font-semibold text-white">Company</h3>
						<ul className="mt-5 space-y-3 text-sm text-white/65">
							<li>
								<a href="#" className="hover:text-white transition-colors">
									Our Story
								</a>
							</li>
							<li>
								<a href="#" className="hover:text-white transition-colors">
									Sustainability
								</a>
							</li>
							<li>
								<a href="#" className="hover:text-white transition-colors">
									Careers
								</a>
							</li>
							<li>
								<a href="#" className="hover:text-white transition-colors">
									Press
								</a>
							</li>
						</ul>
					</div>
				</div>

				<FooterLegalPages />

				{/* Bottom bar */}
				<div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-white/50">
					<p>&copy; {new Date().getFullYear()} Your Next Store. All rights reserved.</p>
					<div className="flex items-center gap-5">
						<span>USD $</span>
						<span>United States</span>
						<span>Accessibility</span>
					</div>
				</div>
			</div>
		</footer>
	);
}
