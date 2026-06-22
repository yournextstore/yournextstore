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
				className="font-mono text-[0.72rem] tracking-[0.18em] uppercase text-parchment/75 hover:text-parchment transition-colors"
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
				className="font-mono text-[0.72rem] tracking-[0.18em] uppercase text-parchment/75 hover:text-parchment transition-colors"
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
		<FooterColumn title="Catalogue">
			{collections.data.map((collection) => (
				<FooterLink key={collection.id} href={`/collection/${collection.slug}`}>
					{collection.name}
				</FooterLink>
			))}
		</FooterColumn>
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
		<FooterColumn title="Index">
			{pages.data.map((page) => (
				<FooterLink key={page.id} href={`/legal${page.href}`}>
					{page.label}
				</FooterLink>
			))}
		</FooterColumn>
	);
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
	return (
		<div>
			<h3 className="font-mono text-[0.6rem] tracking-[0.32em] uppercase text-parchment/45 mb-6">{title}</h3>
			<ul className="space-y-3">{children}</ul>
		</div>
	);
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
	return (
		<li>
			<YnsLink
				prefetch={"eager"}
				href={href}
				className="font-mono text-[0.72rem] tracking-[0.18em] uppercase text-parchment/75 hover:text-parchment transition-colors"
			>
				{children}
			</YnsLink>
		</li>
	);
}

export function Footer() {
	return (
		<footer className="bg-ink text-parchment relative" style={{ backgroundColor: "#0e0d0b" }}>
			<div className="px-6 sm:px-10 lg:px-14 pt-20 pb-8">
				{/* Top: oversized wordmark */}
				<div className="border-b border-parchment/10 pb-14 mb-14 flex flex-col lg:flex-row lg:items-end justify-between gap-10">
					<div>
						<p className="eyebrow text-sand mb-6">From sea to cell — and beyond.</p>
						<h2 className="font-serif text-[16vw] lg:text-[10.5rem] leading-[0.9] tracking-[0.04em] uppercase text-parchment">
							Your<span className="text-sand">·</span>Next<span className="text-sand">·</span>Store
						</h2>
					</div>
					<p className="font-mono text-[0.72rem] leading-relaxed text-parchment/55 max-w-xs">
						Biotech-grade skincare for men. Shipping cold-chain, worldwide, from a small lab on the Atlantic
						coast.
					</p>
				</div>

				<div className="grid grid-cols-2 md:grid-cols-5 gap-10">
					<div className="col-span-2 max-w-xs">
						<p className="font-mono text-[0.6rem] tracking-[0.3em] uppercase text-parchment/50 mb-4">
							The atelier
						</p>
						<p className="font-serif text-2xl leading-snug text-parchment/90">
							A field journal, a small lab, and an obstinate belief in slow chemistry.
						</p>
					</div>

					<FooterCollections />

					<FooterColumn title="The store">
						<FooterLink href="/about">About Us</FooterLink>
						<FooterContactLink />
						<FooterLink href="/faq">Help & FAQ</FooterLink>
						<FooterBlogLink />
						<FooterLink href="/products">All products</FooterLink>
						<FooterLink href="/search">Search</FooterLink>
					</FooterColumn>

					<FooterLegalPages />
				</div>

				<div className="mt-20 pt-8 border-t border-parchment/10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
					<div className="font-mono text-[0.6rem] tracking-[0.3em] uppercase text-parchment/45">
						© {new Date().getFullYear()} Your Next Store — All formulas, all reserved.
					</div>
					<div className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-[0.6rem] tracking-[0.3em] uppercase text-parchment/40">
						<span>Lat 36.7°N</span>
						<span>Vol. 042</span>
						<span>Pressed on 100% recycled paper</span>
						<span>EST. 2026</span>
					</div>
				</div>
			</div>
		</footer>
	);
}
