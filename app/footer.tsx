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
				className="text-sm text-muted-foreground hover:text-foreground transition-colors"
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
				className="text-sm text-muted-foreground hover:text-foreground transition-colors"
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
			<h3 className="eyebrow text-[color:var(--oxblood)]">Collections</h3>
			<ul className="mt-5 space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/collection/${collection.slug}`}
							className="text-[15px] font-serif text-cream/85 hover:text-cream transition-colors"
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
			<h3 className="eyebrow text-[color:var(--oxblood)]">Legal</h3>
			<ul className="mt-5 space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/legal${page.href}`}
							className="text-[15px] font-serif text-cream/85 hover:text-cream transition-colors"
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
		<footer className="relative bg-[color:var(--ink)] text-cream">
			<div
				aria-hidden
				className="absolute inset-0 opacity-[0.07] mix-blend-overlay"
				style={{
					backgroundImage:
						"url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='320' height='320'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
				}}
			/>
			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="py-16 text-center border-b border-cream/10">
					<YnsLink
						prefetch={"eager"}
						href="/"
						className="font-serif text-3xl sm:text-4xl tracking-[0.18em] text-cream"
					>
						YOUR NEXT STORE
					</YnsLink>
					<p className="mt-4 max-w-md mx-auto text-sm text-cream/60 leading-relaxed">
						Breathing new life into cultural craft. Handmade objects, gathered slowly.
					</p>
				</div>
				<div className="py-14 grid grid-cols-2 md:grid-cols-4 gap-10">
					<div>
						<h3 className="eyebrow text-[color:var(--oxblood)]">Atelier</h3>
						<ul className="mt-5 space-y-3">
							<li>
								<YnsLink
									href="/#about"
									prefetch={"eager"}
									className="text-[15px] font-serif text-cream/85 hover:text-cream transition-colors"
								>
									Our Story
								</YnsLink>
							</li>
							<FooterContactLink />
							<li>
								<YnsLink
									href="/products"
									prefetch={"eager"}
									className="text-[15px] font-serif text-cream/85 hover:text-cream transition-colors"
								>
									All Goods
								</YnsLink>
							</li>
							<li>
								<YnsLink
									href="/faq"
									prefetch={"eager"}
									className="text-[15px] font-serif text-cream/85 hover:text-cream transition-colors"
								>
									Journal
								</YnsLink>
							</li>
							<FooterBlogLink />
						</ul>
					</div>

					<FooterCollections />

					<div>
						<h3 className="eyebrow text-[color:var(--oxblood)]">Care</h3>
						<ul className="mt-5 space-y-3">
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/faq"
									className="text-[15px] font-serif text-cream/85 hover:text-cream transition-colors"
								>
									Frequently Asked
								</YnsLink>
							</li>
							<li>
								<a
									href="mailto:hello@yournextstore.com"
									className="text-[15px] font-serif text-cream/85 hover:text-cream transition-colors"
								>
									Write to us
								</a>
							</li>
						</ul>
					</div>

					<FooterLegalPages />
				</div>

				<div className="py-6 border-t border-cream/10 flex flex-col sm:flex-row gap-4 items-center justify-between">
					<p className="text-[11px] tracking-[0.2em] uppercase text-cream/50">
						&copy; {new Date().getFullYear()} Your Next Store — All rights reserved
					</p>
					<p className="text-[11px] tracking-[0.2em] uppercase text-cream/50">
						Crafted with care · Made on Earth
					</p>
				</div>
			</div>
		</footer>
	);
}
