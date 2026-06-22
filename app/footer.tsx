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
			<Link href="/blog" className="text-sm text-foreground/70 hover:text-cyan-200 transition-colors">
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
			<Link href="/contact" className="text-sm text-foreground/70 hover:text-cyan-200 transition-colors">
				Contact Us
			</Link>
		</li>
	);
}

async function FooterCollections() {
	"use cache";
	cacheLife("hours");

	const collections = await commerce.collectionBrowse({ active: true, limit: 5 });

	if (collections.data.length === 0) {
		return null;
	}

	return (
		<div>
			<h3 className="font-mono text-[10px] uppercase tracking-[0.28em] text-foreground/50 mb-5">
				[ Collections ]
			</h3>
			<ul className="space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<Link
							href={`/collection/${collection.slug}`}
							className="text-sm text-foreground/70 hover:text-cyan-200 transition-colors"
						>
							{collection.name}
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

	if (pages.data.length === 0) {
		return null;
	}

	return (
		<div>
			<h3 className="font-mono text-[10px] uppercase tracking-[0.28em] text-foreground/50 mb-5">[ Legal ]</h3>
			<ul className="space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<Link
							href={`/legal${page.href}`}
							className="text-sm text-foreground/70 hover:text-cyan-200 transition-colors"
						>
							{page.label}
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
		<footer className="relative border-t border-border bg-background overflow-hidden">
			{/* atmospheric glow */}
			<div
				aria-hidden="true"
				className="absolute -top-32 left-1/2 -translate-x-1/2 w-[80%] h-64 pointer-events-none opacity-30"
				style={{
					background: "radial-gradient(ellipse 50% 100% at 50% 0%, rgba(63,217,214,0.35), transparent 70%)",
					filter: "blur(60px)",
				}}
			/>

			<div className="relative max-w-[1400px] mx-auto px-6">
				<div className="py-16 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-10">
					{/* Brand */}
					<div className="col-span-2">
						<Link href="/" className="inline-flex items-center gap-2">
							<span className="font-mono text-[11px] tracking-[0.22em] uppercase text-foreground/40">[</span>
							<span className="font-display font-semibold tracking-[0.32em] text-foreground">YNS</span>
							<span className="font-mono text-[11px] tracking-[0.22em] uppercase text-foreground/40">]</span>
						</Link>
						<p className="mt-5 text-sm text-foreground/60 leading-relaxed max-w-xs">
							Your Next Store — atmospheric streetwear for the in-between hours. Designed slow, dropped
							limited.
						</p>
						<div className="mt-6 flex items-center gap-3">
							<a
								href="https://instagram.com"
								className="font-mono text-[10px] uppercase tracking-[0.24em] text-foreground/60 hover:text-cyan-200 transition-colors"
							>
								[ IG ]
							</a>
							<a
								href="https://twitter.com"
								className="font-mono text-[10px] uppercase tracking-[0.24em] text-foreground/60 hover:text-cyan-200 transition-colors"
							>
								[ X ]
							</a>
							<a
								href="https://tiktok.com"
								className="font-mono text-[10px] uppercase tracking-[0.24em] text-foreground/60 hover:text-cyan-200 transition-colors"
							>
								[ TT ]
							</a>
						</div>
					</div>

					{/* Collections */}
					<FooterCollections />

					{/* Support */}
					<div>
						<h3 className="font-mono text-[10px] uppercase tracking-[0.28em] text-foreground/50 mb-5">
							[ Support ]
						</h3>
						<ul className="space-y-3">
							<li>
								<Link
									href="/about"
									className="text-sm text-foreground/70 hover:text-cyan-200 transition-colors"
								>
									About Us
								</Link>
							</li>
							<FooterContactLink />
							<li>
								<Link
									href="/faq"
									className="text-sm text-foreground/70 hover:text-cyan-200 transition-colors"
								>
									FAQ
								</Link>
							</li>
							<li>
								<Link
									href="/products"
									className="text-sm text-foreground/70 hover:text-cyan-200 transition-colors"
								>
									Shipping
								</Link>
							</li>
							<li>
								<Link
									href="/products"
									className="text-sm text-foreground/70 hover:text-cyan-200 transition-colors"
								>
									Returns
								</Link>
							</li>
							<FooterBlogLink />
						</ul>
					</div>

					{/* Legal */}
					<FooterLegalPages />
				</div>

				{/* Bottom bar */}
				<div className="py-6 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
					<p className="font-mono text-[10px] uppercase tracking-[0.24em] text-foreground/40">
						[ © {year} Your Next Store — All rights reserved ]
					</p>
					<p className="font-mono text-[10px] uppercase tracking-[0.24em] text-foreground/40">
						[ Built slow, in transit ]
					</p>
					<PaymentMethods />
				</div>
			</div>
		</footer>
	);
}
