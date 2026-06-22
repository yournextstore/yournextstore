import { AtSign, Mail, MessageCircle, Send } from "lucide-react";
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
				className="font-display text-base text-[var(--brand-ink)] transition-colors hover:text-[var(--brand-ember)]"
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
				className="font-display text-base text-[var(--brand-ink)] transition-colors hover:text-[var(--brand-ember)]"
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
			<h3 className="font-mono-ed text-[10px] uppercase tracking-[0.28em] text-[var(--brand-ink)]/55">
				Shop
			</h3>
			<ul className="mt-6 space-y-3.5">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/collection/${collection.slug}`}
							className="font-display text-base text-[var(--brand-ink)] transition-colors hover:text-[var(--brand-ember)]"
						>
							{collection.name}
						</YnsLink>
					</li>
				))}
				<li>
					<YnsLink
						prefetch={"eager"}
						href="/products"
						className="font-display text-base text-[var(--brand-ink)] transition-colors hover:text-[var(--brand-ember)]"
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
		return (
			<div>
				<h3 className="font-mono-ed text-[10px] uppercase tracking-[0.28em] text-[var(--brand-ink)]/55">
					Fine print
				</h3>
				<ul className="mt-6 space-y-3.5">
					<li>
						<YnsLink
							prefetch={"eager"}
							href="/faq"
							className="font-display text-base text-[var(--brand-ink)] transition-colors hover:text-[var(--brand-ember)]"
						>
							FAQ
						</YnsLink>
					</li>
				</ul>
			</div>
		);
	}

	return (
		<div>
			<h3 className="font-mono-ed text-[10px] uppercase tracking-[0.28em] text-[var(--brand-ink)]/55">
				Fine print
			</h3>
			<ul className="mt-6 space-y-3.5">
				<li>
					<YnsLink
						prefetch={"eager"}
						href="/faq"
						className="font-display text-base text-[var(--brand-ink)] transition-colors hover:text-[var(--brand-ember)]"
					>
						FAQ
					</YnsLink>
				</li>
				{pages.data.map((page) => (
					<li key={page.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/legal${page.href}`}
							className="font-display text-base text-[var(--brand-ink)] transition-colors hover:text-[var(--brand-ember)]"
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
		<footer className="relative border-t border-[var(--brand-ink)]/10 bg-[var(--brand-cream)]">
			<div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
				{/* Oversized wordmark */}
				<div className="border-b border-[var(--brand-ink)]/10 py-14 sm:py-20">
					<p className="font-wordmark text-[clamp(3rem,12vw,11rem)] leading-[0.85] uppercase text-[var(--brand-ink)]">
						Your Next
						<br />
						<span className="text-[var(--brand-ember)]">Store.</span>
					</p>
				</div>

				<div className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
					<div className="max-w-xs">
						<p className="font-mono-ed text-[10px] uppercase tracking-[0.28em] text-[var(--brand-ink)]/55">
							Made with intent
						</p>
						<p className="mt-6 font-display text-lg leading-relaxed text-[var(--brand-ink)]">
							Clean, convenient sauces — bottled in small batches and shipped flat to your door.
						</p>
						<div className="mt-8 flex items-center gap-3">
							{[
								{ Icon: AtSign, label: "Instagram" },
								{ Icon: MessageCircle, label: "TikTok" },
								{ Icon: Send, label: "Telegram" },
								{ Icon: Mail, label: "Email" },
							].map(({ Icon, label }) => (
								<a
									key={label}
									href="#"
									aria-label={label}
									className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--brand-ink)]/20 text-[var(--brand-ink)] transition-colors hover:border-[var(--brand-ember)] hover:bg-[var(--brand-ember)] hover:text-[var(--brand-cream)]"
								>
									<Icon className="h-4 w-4" strokeWidth={1.6} />
								</a>
							))}
						</div>
					</div>

					<FooterCollections />

					<div>
						<h3 className="font-mono-ed text-[10px] uppercase tracking-[0.28em] text-[var(--brand-ink)]/55">
							Inside
						</h3>
						<ul className="mt-6 space-y-3.5">
							{[
								{ label: "Our story", href: "#about" },
								{ label: "Recipes", href: "#recipes" },
								{ label: "Sustainability", href: "#about" },
								{ label: "Press kit", href: "#about" },
							].map((link) => (
								<li key={link.label}>
									<YnsLink
										prefetch={"eager"}
										href={link.href}
										className="font-display text-base text-[var(--brand-ink)] transition-colors hover:text-[var(--brand-ember)]"
									>
										{link.label}
									</YnsLink>
								</li>
							))}
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/about"
									className="font-display text-base text-[var(--brand-ink)] transition-colors hover:text-[var(--brand-ember)]"
								>
									About Us
								</YnsLink>
							</li>
							<FooterContactLink />
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/faq"
									className="font-display text-base text-[var(--brand-ink)] transition-colors hover:text-[var(--brand-ember)]"
								>
									FAQ
								</YnsLink>
							</li>
							<FooterBlogLink />
						</ul>
					</div>

					<FooterLegalPages />
				</div>

				<div className="flex flex-col justify-between gap-4 border-t border-[var(--brand-ink)]/10 py-8 sm:flex-row sm:items-center">
					<p className="font-mono-ed text-[10px] uppercase tracking-[0.22em] text-[var(--brand-ink)]/55">
						© {new Date().getFullYear()} Your Next Store · Bottled in California
					</p>
					<p className="font-mono-ed text-[10px] uppercase tracking-[0.22em] text-[var(--brand-ink)]/55">
						Real flavor · No nonsense
					</p>
				</div>
			</div>
		</footer>
	);
}
