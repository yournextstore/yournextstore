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
			<Link
				href="/blog"
				className="text-sm text-[color:#c9b79b] transition-colors hover:text-[color:#fff8ec]"
			>
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
				className="text-sm text-[color:#c9b79b] transition-colors hover:text-[color:#fff8ec]"
			>
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
			<h3 className="font-display text-sm uppercase tracking-[0.28em] text-[color:#ee7a1a]">Shop</h3>
			<ul className="mt-5 space-y-3">
				<li>
					<Link
						href="/products"
						className="text-sm text-[color:#c9b79b] transition-colors hover:text-[color:#fff8ec]"
					>
						All Products
					</Link>
				</li>
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<Link
							href={`/collection/${collection.slug}`}
							className="text-sm text-[color:#c9b79b] transition-colors hover:text-[color:#fff8ec]"
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
		<>
			{pages.data.map((page) => (
				<li key={page.id}>
					<Link
						href={`/legal${page.href}`}
						className="text-sm text-[color:#c9b79b] transition-colors hover:text-[color:#fff8ec]"
					>
						{page.label}
					</Link>
				</li>
			))}
		</>
	);
}

// `new Date()` is an unstable value: now that the footer is part of the prerendered
// shell, reading it during the prerender is an error. Caching pins it to the entry.
async function getCopyrightYear() {
	"use cache";
	cacheLife("days");

	return new Date().getFullYear();
}

// Placeholders until the store's real profiles are set: not links yet, so no href.
const socials = ["Instagram", "TikTok", "Pinterest"];

export async function Footer() {
	const year = await getCopyrightYear();

	return (
		<footer className="relative overflow-hidden bg-[#0a1d2c] text-[color:#f6efe2]">
			<div
				aria-hidden="true"
				className="absolute inset-0 opacity-40"
				style={{
					backgroundImage:
						"radial-gradient(at 90% 0%, rgba(238,122,26,0.15), transparent 50%), radial-gradient(at 0% 100%, rgba(124,31,18,0.25), transparent 50%)",
				}}
			/>

			<div className="relative mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-10">
				<div className="grid grid-cols-1 gap-12 py-16 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12 lg:py-20">
					{/* Brand */}
					<div className="lg:max-w-xs">
						<Link href="/" className="font-display text-2xl font-bold tracking-[0.3em] text-[color:#f6efe2]">
							YOUR&nbsp;NEXT&nbsp;STORE
						</Link>
						<p className="mt-5 text-sm leading-relaxed text-[color:#c9b79b]">
							Artisan Italian hot sauce, painted in fire. Made in Calabria, bottled with patience.
						</p>
						<div className="mt-6 flex gap-4">
							{socials.map((s) => (
								<span
									key={s}
									className="text-xs uppercase tracking-[0.2em] text-[color:#c9b79b] underline-offset-4 transition-colors hover:text-[color:#ee7a1a] hover:underline"
								>
									{s}
								</span>
							))}
						</div>
					</div>

					{/* Story */}
					<div>
						<h3 className="font-display text-sm uppercase tracking-[0.28em] text-[color:#ee7a1a]">Story</h3>
						<ul className="mt-5 space-y-3">
							<li>
								<Link
									href="#story"
									className="text-sm text-[color:#c9b79b] transition-colors hover:text-[color:#fff8ec]"
								>
									Our heritage
								</Link>
							</li>
							<li>
								<Link
									href="#story"
									className="text-sm text-[color:#c9b79b] transition-colors hover:text-[color:#fff8ec]"
								>
									Provenance
								</Link>
							</li>
							<li>
								<Link
									href="/about"
									className="text-sm text-[color:#c9b79b] transition-colors hover:text-[color:#fff8ec]"
								>
									About Us
								</Link>
							</li>
							<FooterContactLink />
							<li>
								<Link
									href="/faq"
									className="text-sm text-[color:#c9b79b] transition-colors hover:text-[color:#fff8ec]"
								>
									FAQ
								</Link>
							</li>
							<FooterBlogLink />
						</ul>
					</div>

					{/* Shop */}
					<FooterCollections />

					{/* Contact + Legal */}
					<div>
						<h3 className="font-display text-sm uppercase tracking-[0.28em] text-[color:#ee7a1a]">Contact</h3>
						<ul className="mt-5 space-y-3">
							<li className="text-sm text-[color:#c9b79b]">
								Via dei Pomodori, 12
								<br />
								Cosenza, Calabria
							</li>
							<li>
								<a
									href="mailto:hello@yournextstore.com"
									className="text-sm text-[color:#c9b79b] underline-offset-4 transition-colors hover:text-[color:#fff8ec] hover:underline"
								>
									hello@yournextstore.com
								</a>
							</li>
							<FooterLegalPages />
						</ul>
					</div>
				</div>

				{/* Big wordmark repeat */}
				<div
					aria-hidden="true"
					className="border-t border-white/10 py-6 text-center font-display text-3xl tracking-[0.4em] text-[color:#ee7a1a] sm:text-5xl lg:text-7xl"
				>
					YOUR · NEXT · STORE
				</div>

				<div className="flex flex-col items-center justify-between gap-2 border-t border-white/10 py-6 sm:flex-row">
					<p className="text-xs text-[color:#c9b79b]">&copy; {year} Your Next Store. Painted with fire.</p>
					<div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-6">
						<PaymentMethods />
						<p className="text-xs uppercase tracking-[0.28em] text-[color:#c9b79b]/60">Made in Italy</p>
					</div>
				</div>
			</div>
		</footer>
	);
}
