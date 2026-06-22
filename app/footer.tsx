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
				className="text-sm text-neutral-500 hover:text-[#ff6b35] transition-colors"
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
				className="text-sm text-neutral-500 hover:text-[#ff6b35] transition-colors"
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
			<h3 className="font-display uppercase text-sm tracking-wider text-[#0f0f0f]">Shop</h3>
			<ul className="mt-5 space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/collection/${collection.slug}`}
							className="text-sm text-neutral-500 hover:text-[#ff6b35] transition-colors"
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
			<h3 className="font-display uppercase text-sm tracking-wider text-[#0f0f0f]">Legal</h3>
			<ul className="mt-5 space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/legal${page.href}`}
							className="text-sm text-neutral-500 hover:text-[#ff6b35] transition-colors"
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
		<footer className="mx-auto w-full max-w-[1280px] px-3 sm:px-5 lg:px-6 pb-5">
			<div className="rounded-[2rem] bg-white ring-1 ring-black/5 p-6 sm:p-10 lg:p-12">
				<div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-8 sm:gap-10">
					{/* Brand */}
					<div className="col-span-2 lg:col-span-2 sm:max-w-xs">
						<YnsLink prefetch={"eager"} href="/" className="inline-flex items-center gap-2.5">
							<span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#0f0f0f] text-white">
								<svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
									<path
										d="M5 19V9l7-5 7 5v10h-4v-6h-6v6H5z"
										stroke="currentColor"
										strokeWidth="1.6"
										strokeLinejoin="round"
									/>
								</svg>
							</span>
							<span className="font-display text-xl text-[#0f0f0f]">Your Next Store</span>
						</YnsLink>
						<p className="mt-5 text-sm text-neutral-500 leading-relaxed max-w-xs">
							Furniture & home essentials curated for design-conscious living. Quality you can sit on for
							decades.
						</p>
						<div className="mt-6 flex items-center gap-2">
							{(
								[
									{
										label: "Instagram",
										path: (
											<>
												<rect
													x="3"
													y="3"
													width="18"
													height="18"
													rx="5"
													stroke="currentColor"
													strokeWidth="1.6"
												/>
												<circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
												<circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
											</>
										),
									},
									{
										label: "Twitter",
										path: (
											<path
												d="M18 5L13 12L18.5 19H16L11.5 13.4L6.5 19H4L9.5 12.2L4 5h2.5l4.5 5.4L15.5 5H18z"
												fill="currentColor"
											/>
										),
									},
									{
										label: "Pinterest",
										path: (
											<>
												<circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
												<path
													d="M11 8.5C11 11 9.5 14 9.5 16M13 8.5C13 10 13.5 12 12 14"
													stroke="currentColor"
													strokeWidth="1.6"
													strokeLinecap="round"
												/>
											</>
										),
									},
								] as const
							).map((social) => (
								<a
									key={social.label}
									href="https://yournextstore.com"
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#f5e8e4] text-[#0f0f0f] hover:bg-[#ff6b35] hover:text-white transition-colors"
								>
									<span className="sr-only">{social.label}</span>
									<svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
										{social.path}
									</svg>
								</a>
							))}
						</div>
					</div>

					{/* Collections */}
					<FooterCollections />

					{/* Support */}
					<div>
						<h3 className="font-display uppercase text-sm tracking-wider text-[#0f0f0f]">Support</h3>
						<ul className="mt-5 space-y-3">
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/about"
									className="text-sm text-neutral-500 hover:text-[#ff6b35] transition-colors"
								>
									About Us
								</YnsLink>
							</li>
							<FooterContactLink />
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/faq"
									className="text-sm text-neutral-500 hover:text-[#ff6b35] transition-colors"
								>
									FAQ
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/search"
									className="text-sm text-neutral-500 hover:text-[#ff6b35] transition-colors"
								>
									Search
								</YnsLink>
							</li>
							<FooterBlogLink />
						</ul>
					</div>

					{/* Legal */}
					<FooterLegalPages />
				</div>

				<div className="mt-10 pt-6 border-t border-neutral-200 flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
					<p className="text-xs text-neutral-500">
						&copy; {new Date().getFullYear()} Your Next Store. Designed with care.
					</p>
					<p className="text-xs text-neutral-400">Crafted in Brooklyn · Shipped worldwide</p>
				</div>
			</div>
		</footer>
	);
}
