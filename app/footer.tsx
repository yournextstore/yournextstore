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
			<h3 className="font-display text-sm uppercase tracking-[0.28em] text-[color:#ee7a1a]">Shop</h3>
			<ul className="mt-5 space-y-3">
				<li>
					<YnsLink
						prefetch={"eager"}
						href="/products"
						className="text-sm text-[color:#c9b79b] transition-colors hover:text-[color:#fff8ec]"
					>
						All Products
					</YnsLink>
				</li>
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/collection/${collection.slug}`}
							className="text-sm text-[color:#c9b79b] transition-colors hover:text-[color:#fff8ec]"
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
		<>
			{pages.data.map((page) => (
				<li key={page.id}>
					<YnsLink
						prefetch={"eager"}
						href={`/legal${page.href}`}
						className="text-sm text-[color:#c9b79b] transition-colors hover:text-[color:#fff8ec]"
					>
						{page.label}
					</YnsLink>
				</li>
			))}
		</>
	);
}

const socials = ["Instagram", "TikTok", "Pinterest"];

export function Footer() {
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
						<YnsLink
							prefetch={"eager"}
							href="/"
							className="font-display text-2xl font-bold tracking-[0.3em] text-[color:#f6efe2]"
						>
							YOUR&nbsp;NEXT&nbsp;STORE
						</YnsLink>
						<p className="mt-5 text-sm leading-relaxed text-[color:#c9b79b]">
							Artisan Italian hot sauce, painted in fire. Made in Calabria, bottled with patience.
						</p>
						<div className="mt-6 flex gap-4">
							{socials.map((s) => (
								<a
									key={s}
									href="#"
									className="text-xs uppercase tracking-[0.2em] text-[color:#c9b79b] underline-offset-4 transition-colors hover:text-[color:#ee7a1a] hover:underline"
								>
									{s}
								</a>
							))}
						</div>
					</div>

					{/* Story */}
					<div>
						<h3 className="font-display text-sm uppercase tracking-[0.28em] text-[color:#ee7a1a]">Story</h3>
						<ul className="mt-5 space-y-3">
							<li>
								<YnsLink
									prefetch={"eager"}
									href="#story"
									className="text-sm text-[color:#c9b79b] transition-colors hover:text-[color:#fff8ec]"
								>
									Our heritage
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="#story"
									className="text-sm text-[color:#c9b79b] transition-colors hover:text-[color:#fff8ec]"
								>
									Provenance
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/about"
									className="text-sm text-muted-foreground hover:text-foreground transition-colors"
								>
									About Us
								</YnsLink>
							</li>
							<FooterContactLink />
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/faq"
									className="text-sm text-[color:#c9b79b] transition-colors hover:text-[color:#fff8ec]"
								>
									FAQ
								</YnsLink>
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
					<p className="text-xs text-[color:#c9b79b]">
						&copy; {new Date().getFullYear()} Your Next Store. Painted with fire.
					</p>
					<p className="text-xs uppercase tracking-[0.28em] text-[color:#c9b79b]/60">Made in Italy</p>
				</div>
			</div>
		</footer>
	);
}
