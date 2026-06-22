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
				className="text-[14px] text-white/85 hover:text-yns-yellow transition-colors"
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
				className="text-[14px] text-white/85 hover:text-yns-yellow transition-colors"
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
			<h3 className="text-[11px] tracking-[0.22em] uppercase text-white/55 font-medium">Collections</h3>
			<ul className="mt-5 space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/collection/${collection.slug}`}
							className="text-[14px] text-white/85 hover:text-yns-yellow transition-colors"
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
			<h3 className="text-[11px] tracking-[0.22em] uppercase text-white/55 font-medium">Fine print</h3>
			<ul className="mt-5 space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/legal${page.href}`}
							className="text-[14px] text-white/85 hover:text-yns-yellow transition-colors"
						>
							{page.label}
						</YnsLink>
					</li>
				))}
			</ul>
		</div>
	);
}

const socialLinks = [
	{
		href: "https://instagram.com",
		label: "Instagram",
		path: "M12 2.4c2.7 0 3 .01 4.07.06 1 .04 1.5.2 1.85.34.46.18.79.4 1.14.75.35.35.57.68.75 1.14.14.35.3.85.34 1.85.05 1.07.06 1.37.06 4.07s-.01 3-.06 4.07c-.04 1-.2 1.5-.34 1.85-.18.46-.4.79-.75 1.14a3 3 0 0 1-1.14.75c-.35.14-.85.3-1.85.34-1.07.05-1.37.06-4.07.06s-3-.01-4.07-.06c-1-.04-1.5-.2-1.85-.34a3 3 0 0 1-1.14-.75 3 3 0 0 1-.75-1.14c-.14-.35-.3-.85-.34-1.85C2.4 15 2.4 14.7 2.4 12s.01-3 .06-4.07c.04-1 .2-1.5.34-1.85.18-.46.4-.79.75-1.14.35-.35.68-.57 1.14-.75.35-.14.85-.3 1.85-.34C9 2.4 9.3 2.4 12 2.4Zm0 1.8c-2.65 0-2.96.01-4 .06-.83.04-1.28.17-1.58.29-.4.15-.68.34-.98.64-.3.3-.49.58-.64.98-.12.3-.25.75-.29 1.58-.05 1.04-.06 1.35-.06 4s.01 2.96.06 4c.04.83.17 1.28.29 1.58.15.4.34.68.64.98.3.3.58.49.98.64.3.12.75.25 1.58.29 1.04.05 1.35.06 4 .06s2.96-.01 4-.06c.83-.04 1.28-.17 1.58-.29.4-.15.68-.34.98-.64.3-.3.49-.58.64-.98.12-.3.25-.75.29-1.58.05-1.04.06-1.35.06-4s-.01-2.96-.06-4c-.04-.83-.17-1.28-.29-1.58a2.6 2.6 0 0 0-.64-.98c-.3-.3-.58-.49-.98-.64-.3-.12-.75-.25-1.58-.29-1.04-.05-1.35-.06-4-.06Zm0 3.06a4.74 4.74 0 1 1 0 9.48 4.74 4.74 0 0 1 0-9.48Zm0 1.8a2.94 2.94 0 1 0 0 5.88 2.94 2.94 0 0 0 0-5.88Zm6.04-2.04a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0Z",
	},
	{
		href: "https://twitter.com",
		label: "Twitter",
		path: "M17.7 3h2.7l-5.9 6.74L21.5 21h-5.4l-4.23-5.53L7.04 21H4.34l6.32-7.22L3 3h5.54l3.83 5.07L17.7 3Zm-.95 16.4h1.5L7.32 4.51H5.71l11.04 14.89Z",
	},
	{
		href: "https://youtube.com",
		label: "YouTube",
		path: "M21.6 7.2a2.51 2.51 0 0 0-1.77-1.77C18.25 5 12 5 12 5s-6.25 0-7.83.43A2.51 2.51 0 0 0 2.4 7.2C2 8.79 2 12 2 12s0 3.21.4 4.8a2.51 2.51 0 0 0 1.77 1.77C5.75 19 12 19 12 19s6.25 0 7.83-.43A2.51 2.51 0 0 0 21.6 16.8C22 15.21 22 12 22 12s0-3.21-.4-4.8ZM10 15.5v-7l5.2 3.5L10 15.5Z",
	},
];

export function Footer() {
	return (
		<footer className="navy-gradient text-white">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pt-20 pb-10">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
					<div className="lg:col-span-5">
						<YnsLink prefetch={"eager"} href="/" className="font-display italic text-4xl text-yns-yellow">
							Your Next Store
						</YnsLink>
						<p className="mt-5 text-[14px] text-white/70 leading-relaxed max-w-sm">
							Perfectly pure water from a protected spring in the Cascades. Bottled at source, in glass, for
							over a decade.
						</p>
						<div className="mt-8 flex items-center gap-3">
							{socialLinks.map((s) => (
								<a
									key={s.label}
									href={s.href}
									target="_blank"
									rel="noreferrer"
									className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:border-yns-yellow hover:text-yns-yellow transition-colors"
								>
									<span className="sr-only">{s.label}</span>
									<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
										<title>{s.label}</title>
										<path d={s.path} />
									</svg>
								</a>
							))}
						</div>
					</div>

					<div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-10">
						<div>
							<h3 className="text-[11px] tracking-[0.22em] uppercase text-white/55 font-medium">Shop</h3>
							<ul className="mt-5 space-y-3">
								<li>
									<YnsLink
										prefetch={"eager"}
										href="/products"
										className="text-[14px] text-white/85 hover:text-yns-yellow transition-colors"
									>
										All Water
									</YnsLink>
								</li>
								<li>
									<YnsLink
										prefetch={"eager"}
										href="/products"
										className="text-[14px] text-white/85 hover:text-yns-yellow transition-colors"
									>
										Subscribe
									</YnsLink>
								</li>
								<li>
									<YnsLink
										prefetch={"eager"}
										href="/products"
										className="text-[14px] text-white/85 hover:text-yns-yellow transition-colors"
									>
										Gift Cards
									</YnsLink>
								</li>
							</ul>
						</div>

						<FooterCollections />

						<div>
							<h3 className="text-[11px] tracking-[0.22em] uppercase text-white/55 font-medium">Help</h3>
							<ul className="mt-5 space-y-3">
								<li>
									<YnsLink
										prefetch={"eager"}
										href="/about"
										className="text-[14px] text-white/85 hover:text-yns-yellow transition-colors"
									>
										About Us
									</YnsLink>
								</li>
								<li>
									<YnsLink
										prefetch={"eager"}
										href="/faq"
										className="text-[14px] text-white/85 hover:text-yns-yellow transition-colors"
									>
										FAQ
									</YnsLink>
								</li>
								<li>
									<a
										href="mailto:hello@yournextstore.com"
										className="text-[14px] text-white/85 hover:text-yns-yellow transition-colors"
									>
										Contact
									</a>
								</li>
								<li>
									<YnsLink
										prefetch={"eager"}
										href="/products"
										className="text-[14px] text-white/85 hover:text-yns-yellow transition-colors"
									>
										Test Results
									</YnsLink>
								</li>
								<FooterContactLink />
								<FooterBlogLink />
							</ul>
						</div>

						<FooterLegalPages />
					</div>
				</div>

				<div className="mt-16 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
					<p className="text-[12px] text-white/50">
						© {new Date().getFullYear()} Your Next Store. Bottled at source in the Pacific Northwest.
					</p>
					<p className="text-[12px] text-white/50 font-display italic">
						All of the minerals, none of the chemicals.
					</p>
				</div>
			</div>
		</footer>
	);
}
