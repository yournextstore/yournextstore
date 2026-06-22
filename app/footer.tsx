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
				className="text-[13px] text-muted-foreground hover:text-foreground editorial-underline transition-colors"
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
				className="text-[13px] text-muted-foreground hover:text-foreground editorial-underline transition-colors"
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

	const shopLinks = [
		{ href: "/products", label: "All garments" },
		...collections.data.map((c) => ({ href: `/collection/${c.slug}`, label: c.name })),
		{ href: "/products", label: "Capsule 003" },
	].slice(0, 6);

	return (
		<div>
			<h3 className="font-eyebrow text-[10px] text-foreground mb-5">Shop</h3>
			<ul className="space-y-3">
				{shopLinks.map((link) => (
					<li key={`${link.href}-${link.label}`}>
						<YnsLink
							prefetch={"eager"}
							href={link.href}
							className="text-[13px] text-muted-foreground hover:text-foreground editorial-underline transition-colors"
						>
							{link.label}
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

	const helpLinks = [
		{ href: "/faq", label: "FAQ" },
		{ href: "/cart", label: "Shipping & returns" },
		{ href: "/search", label: "Size guide" },
		{ href: "/faq", label: "Care guide" },
		...pages.data.map((p) => ({ href: `/legal${p.href}`, label: p.label })),
	].slice(0, 6);

	return (
		<div>
			<h3 className="font-eyebrow text-[10px] text-foreground mb-5">Help</h3>
			<ul className="space-y-3">
				{helpLinks.map((link) => (
					<li key={`${link.href}-${link.label}`}>
						<YnsLink
							prefetch={"eager"}
							href={link.href}
							className="text-[13px] text-muted-foreground hover:text-foreground editorial-underline transition-colors"
						>
							{link.label}
						</YnsLink>
					</li>
				))}
			</ul>
		</div>
	);
}

function SocialDot({ label }: { label: string }) {
	return (
		<YnsLink
			href="#"
			className="inline-flex items-center justify-center w-9 h-9 border border-foreground/30 hover:border-foreground hover:bg-foreground hover:text-background transition-colors font-eyebrow text-[10px]"
			aria-label={label}
		>
			{label.slice(0, 2)}
		</YnsLink>
	);
}

export function Footer() {
	return (
		<footer className="bg-editorial-warm border-t border-border/70 paper-grain">
			<div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
				{/* Top — large wordmark */}
				<div className="pt-20 pb-12 border-b border-border/60">
					<p className="font-serif font-light text-foreground tracking-tight text-[56px] sm:text-[88px] lg:text-[120px] leading-[0.9]">
						Your Next Store
					</p>
					<p className="mt-4 text-[13px] text-muted-foreground max-w-md">
						Sustainably crafted wardrobe icons, made in small ateliers from natural and organic fibres.
					</p>
				</div>

				{/* Link columns */}
				<div className="grid grid-cols-2 md:grid-cols-4 gap-10 sm:gap-12 py-14">
					<FooterCollections />
					<FooterLegalPages />
					<div>
						<h3 className="font-eyebrow text-[10px] text-foreground mb-5">Company</h3>
						<ul className="space-y-3">
							{[
								{ href: "#about", label: "Our story" },
								{ href: "#sustainability", label: "Sustainability" },
								{ href: "#kynfolk", label: "YNS Folk journal" },
								{ href: "/products", label: "Atelier visits" },
								{ href: "/faq", label: "Press" },
							].map((link) => (
								<li key={`${link.href}-${link.label}`}>
									<YnsLink
										href={link.href}
										className="text-[13px] text-muted-foreground hover:text-foreground editorial-underline transition-colors"
									>
										{link.label}
									</YnsLink>
								</li>
							))}
							<FooterContactLink />
							<FooterBlogLink />
						</ul>
					</div>
					<div>
						<h3 className="font-eyebrow text-[10px] text-foreground mb-5">Connect</h3>
						<ul className="space-y-3">
							{[
								{ href: "#", label: "Instagram" },
								{ href: "#", label: "Pinterest" },
								{ href: "#", label: "Spotify" },
								{ href: "#", label: "Newsletter" },
							].map((link) => (
								<li key={link.label}>
									<YnsLink
										href={link.href}
										className="text-[13px] text-muted-foreground hover:text-foreground editorial-underline transition-colors"
									>
										{link.label}
									</YnsLink>
								</li>
							))}
						</ul>
						<div className="mt-6 flex gap-2">
							<SocialDot label="Instagram" />
							<SocialDot label="Pinterest" />
							<SocialDot label="TikTok" />
						</div>
					</div>
				</div>

				{/* Bottom bar */}
				<div className="py-7 border-t border-border/60 flex flex-col sm:flex-row gap-3 sm:gap-0 justify-between items-start sm:items-center">
					<p className="text-[11px] text-muted-foreground">
						© {new Date().getFullYear()} Your Next Store. Designed with care. All rights reserved.
					</p>
					<p className="font-eyebrow text-[10px] text-muted-foreground">
						Made slowly · Natural fibres · Carbon-conscious shipping
					</p>
				</div>
			</div>
		</footer>
	);
}
