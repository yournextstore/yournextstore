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
				className="text-sm font-medium text-white/70 hover:text-white transition-colors"
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
				className="text-sm font-medium text-white/70 hover:text-white transition-colors"
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
			<h3 className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#f5c518] mb-5">Shop</h3>
			<ul className="space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/collection/${collection.slug}`}
							className="text-sm font-medium text-white/70 hover:text-white transition-colors"
						>
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
			<h3 className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#f5c518] mb-5">Legal</h3>
			<ul className="space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/legal${page.href}`}
							className="text-sm font-medium text-white/70 hover:text-white transition-colors"
						>
							{page.label}
						</YnsLink>
					</li>
				))}
			</ul>
		</div>
	);
}

function SocialIcon({ children, href, label }: { children: React.ReactNode; href: string; label: string }) {
	return (
		<a
			href={href}
			aria-label={label}
			className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-[#f5c518] hover:text-[#1a0f4d] transition-colors"
		>
			{children}
		</a>
	);
}

export function Footer() {
	return (
		<footer className="bg-[#1a0f4d] text-white relative overflow-hidden">
			<div
				aria-hidden="true"
				className="absolute inset-0 opacity-10 pointer-events-none"
				style={{
					backgroundImage:
						"radial-gradient(circle at 10% 10%, #f5c518 0%, transparent 25%), radial-gradient(circle at 90% 90%, #4b1fb5 0%, transparent 35%)",
				}}
			/>
			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="py-16 sm:py-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
					<div className="lg:col-span-2 sm:col-span-2">
						<YnsLink prefetch="eager" href="/" className="inline-flex flex-col leading-none">
							<span className="font-marker text-4xl text-[#f5c518] -rotate-2">YNS</span>
							<span className="mt-1 text-[10px] font-extrabold uppercase tracking-[0.25em] text-white">
								Your Next Store
							</span>
						</YnsLink>
						<p className="mt-6 text-sm text-white/70 leading-relaxed max-w-xs">
							Supplements that taste like candy, work like clockwork, and fit in your pocket. No water. No
							nonsense.
						</p>
						<div className="mt-6 flex gap-3">
							<SocialIcon href="#" label="Instagram">
								<svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
									<path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16M12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.34 4.14.63c-.79.31-1.46.72-2.13 1.38C1.35 2.68.94 3.35.63 4.14.34 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.27 2.15.56 2.91.31.79.72 1.46 1.38 2.13.67.66 1.34 1.07 2.13 1.38.76.29 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.27 2.91-.56.79-.31 1.46-.72 2.13-1.38.66-.67 1.07-1.34 1.38-2.13.29-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.27-2.15-.56-2.91-.31-.79-.72-1.46-1.38-2.13C20.32 1.35 19.65.94 18.86.63 18.1.34 17.22.13 15.95.07 14.67.01 14.26 0 12 0z M12 5.84A6.16 6.16 0 1 0 12 18.16 6.16 6.16 0 0 0 12 5.84M12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8M19.85 5.6a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0" />
								</svg>
							</SocialIcon>
							<SocialIcon href="#" label="TikTok">
								<svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
									<path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.84-.1z" />
								</svg>
							</SocialIcon>
							<SocialIcon href="#" label="YouTube">
								<svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
									<path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8zM9.6 15.6V8.4l6.2 3.6-6.2 3.6z" />
								</svg>
							</SocialIcon>
						</div>
					</div>

					<FooterCollections />

					<div>
						<h3 className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#f5c518] mb-5">Help</h3>
						<ul className="space-y-3">
							<li>
								<YnsLink
									prefetch="eager"
									href="/about"
									className="text-sm font-medium text-white/70 hover:text-white transition-colors"
								>
									About Us
								</YnsLink>
							</li>
							<FooterContactLink />
							<li>
								<YnsLink
									prefetch="eager"
									href="/faq"
									className="text-sm font-medium text-white/70 hover:text-white transition-colors"
								>
									FAQ
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch="eager"
									href="/cart"
									className="text-sm font-medium text-white/70 hover:text-white transition-colors"
								>
									Account
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch="eager"
									href="#quiz"
									className="text-sm font-medium text-white/70 hover:text-white transition-colors"
								>
									Take the quiz
								</YnsLink>
							</li>
							<FooterBlogLink />
						</ul>
					</div>

					<FooterLegalPages />
				</div>

				<div className="py-6 border-t border-white/10 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
					<p className="text-xs text-white/50">
						&copy; {new Date().getFullYear()} Your Next Store. All rights reserved.
					</p>
					<div className="flex gap-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
						<span>Third-party tested</span>
						<span>·</span>
						<span>cGMP certified</span>
						<span>·</span>
						<span>Made in USA</span>
					</div>
				</div>
			</div>
		</footer>
	);
}
