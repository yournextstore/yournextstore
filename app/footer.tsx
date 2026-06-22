import { cacheLife } from "next/cache";
import Link from "next/link";
import { PaymentMethods } from "@/components/payment-methods";
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
			<Link href="/blog" className="text-[13px] text-foreground/75 hover:text-foreground transition-colors">
				Blog
			</Link>
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
			<Link
				href="/contact"
				className="text-[13px] text-foreground/75 hover:text-foreground transition-colors"
			>
				Contact Us
			</Link>
		</li>
	);
}

const labelClass = "text-[10px] tracking-[0.4em] uppercase font-light text-foreground/55 mb-5";
const linkClass = "text-[13px] text-foreground/75 hover:text-foreground transition-colors";

async function FooterCollections() {
	"use cache";
	cacheLife("hours");

	const collections = await commerce.collectionBrowse({ active: true, limit: 5 });

	if (collections.data.length === 0) return null;

	return (
		<div>
			<h3 className={labelClass}>Shop</h3>
			<ul className="space-y-3">
				{collections.data.map((c) => (
					<li key={c.id}>
						<Link href={`/collection/${c.slug}`} className={linkClass}>
							{c.name}
						</Link>
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
	if (pages.data.length === 0) return null;

	return (
		<div>
			<h3 className={labelClass}>Legal</h3>
			<ul className="space-y-3">
				{pages.data.map((p) => (
					<li key={p.id}>
						<Link href={`/legal${p.href}`} className={linkClass}>
							{p.label}
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}

// `new Date()` is an unstable value: now that the footer is part of the prerendered
// shell, reading it during the prerender is an error. Caching pins it to the entry.
async function getCopyrightYear() {
	"use cache";
	cacheLife("days");

	return new Date().getFullYear();
}

export async function Footer() {
	const year = await getCopyrightYear();

	return (
		<footer className="bg-[#f2ebdd] border-t border-foreground/10">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Big wordmark */}
				<div className="py-16 sm:py-20 text-center border-b border-foreground/10">
					<div className="font-serif text-5xl sm:text-7xl lg:text-8xl tracking-[-0.015em] text-foreground/85">
						Your Next Store
						<sup className="ml-1 align-super text-[14px] tracking-normal text-foreground/40">™</sup>
					</div>
					<p className="mt-5 text-[11px] tracking-[0.4em] uppercase text-foreground/50 font-light">
						The New Standard of Considered Living
					</p>
				</div>

				<div className="py-14 grid grid-cols-2 sm:grid-cols-4 gap-10">
					<FooterCollections />

					<div>
						<h3 className={labelClass}>Studio</h3>
						<ul className="space-y-3">
							<li>
								<Link href="/#about" className={linkClass}>
									Philosophy
								</Link>
							</li>
							<li>
								<Link href="/products" className={linkClass}>
									All Goods
								</Link>
							</li>
						</ul>
					</div>

					<div>
						<h3 className={labelClass}>Support</h3>
						<ul className="space-y-3">
							<li>
								<Link href="/about" className={linkClass}>
									About Us
								</Link>
							</li>
							<FooterContactLink />
							<li>
								<Link href="/faq" className={linkClass}>
									FAQ
								</Link>
							</li>
							<li>
								{/* Plain <a>: /account is a proxied zone (see AGENTS.md). */}
								<a href="/account" className={linkClass}>
									Account
								</a>
							</li>
							<FooterBlogLink />
						</ul>
					</div>

					<FooterLegalPages />
				</div>

				<div className="py-6 border-t border-foreground/10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
					<p className="text-[11px] tracking-[0.22em] uppercase text-foreground/50 font-light">
						&copy; {year} Your Next Store
					</p>
					<PaymentMethods />
					<p className="text-[11px] tracking-[0.22em] uppercase text-foreground/50 font-light">
						Made slowly, in good company
					</p>
				</div>
			</div>
		</footer>
	);
}
