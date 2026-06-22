import { Globe } from "lucide-react";
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
				className="text-sm text-mushroom hover:text-foreground transition-colors"
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
				className="text-sm text-mushroom hover:text-foreground transition-colors"
			>
				Contact Us
			</YnsLink>
		</li>
	);
}

function SocialIcon({ d, label }: { d: string; label: string }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="currentColor"
			className="h-4 w-4"
			role="img"
			aria-label={label}
		>
			<title>{label}</title>
			<path d={d} />
		</svg>
	);
}

const socials = [
	{
		label: "Instagram",
		href: "https://instagram.com",
		d: "M12 2.2c3.2 0 3.584.012 4.85.07 1.366.062 2.633.336 3.608 1.311.975.975 1.249 2.242 1.311 3.608.058 1.266.07 1.65.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.336 2.633-1.311 3.608-.975.975-2.242 1.249-3.608 1.311-1.266.058-1.65.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.336-3.608-1.311-.975-.975-1.249-2.242-1.311-3.608C2.212 15.584 2.2 15.2 2.2 12s.012-3.584.07-4.85c.062-1.366.336-2.633 1.311-3.608.975-.975 2.242-1.249 3.608-1.311C8.416 2.212 8.8 2.2 12 2.2zm0 1.8c-3.155 0-3.522.012-4.766.069-1.027.046-1.585.218-1.957.362-.492.191-.843.42-1.213.79-.37.37-.598.72-.79 1.213-.144.372-.316.93-.362 1.957C3.012 8.478 3 8.845 3 12s.012 3.522.069 4.766c.046 1.027.218 1.585.362 1.957.191.492.42.843.79 1.213.37.37.72.598 1.213.79.372.144.93.316 1.957.362C8.478 20.988 8.845 21 12 21s3.522-.012 4.766-.069c1.027-.046 1.585-.218 1.957-.362.492-.191.843-.42 1.213-.79.37-.37.598-.72.79-1.213.144-.372.316-.93.362-1.957.057-1.244.069-1.611.069-4.766s-.012-3.522-.069-4.766c-.046-1.027-.218-1.585-.362-1.957a3.27 3.27 0 00-.79-1.213 3.27 3.27 0 00-1.213-.79c-.372-.144-.93-.316-1.957-.362C15.522 4.012 15.155 4 12 4zm0 3.3a4.7 4.7 0 110 9.4 4.7 4.7 0 010-9.4zm0 1.8a2.9 2.9 0 100 5.8 2.9 2.9 0 000-5.8zm5.9-2.2a1.1 1.1 0 110 2.2 1.1 1.1 0 010-2.2z",
	},
	{
		label: "TikTok",
		href: "https://tiktok.com",
		d: "M19.6 6.6c-1.4 0-2.7-.5-3.7-1.4-1-.9-1.7-2.1-1.8-3.5h-3v13.4a2.4 2.4 0 11-2.4-2.4c.3 0 .6 0 .8.1V9.7a5.7 5.7 0 00-.8-.1A5.5 5.5 0 1014.2 15V8.5c1.5 1 3.4 1.6 5.4 1.6V6.6z",
	},
	{
		label: "Facebook",
		href: "https://facebook.com",
		d: "M22 12a10 10 0 10-11.6 9.9v-7H8v-2.9h2.4V9.4c0-2.4 1.4-3.7 3.5-3.7 1 0 2.1.2 2.1.2v2.3h-1.2c-1.2 0-1.5.7-1.5 1.5v1.8H16l-.4 2.9h-2.2v7A10 10 0 0022 12z",
	},
	{
		label: "YouTube",
		href: "https://youtube.com",
		d: "M21.6 7.2a2.5 2.5 0 00-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 002.4 7.2 26 26 0 002 12a26 26 0 00.4 4.8 2.5 2.5 0 001.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 001.8-1.8A26 26 0 0022 12a26 26 0 00-.4-4.8zM10 15V9l5.2 3-5.2 3z",
	},
];

async function FooterCollections() {
	"use cache";
	cacheLife("hours");

	const collections = await commerce.collectionBrowse({ limit: 5 });

	if (collections.data.length === 0) {
		return (
			<div>
				<h3 className="utility-caps text-foreground">Shop</h3>
				<ul className="mt-5 space-y-3">
					{[
						{ href: "/products", label: "New Arrivals" },
						{ href: "/products", label: "Tailoring" },
						{ href: "/products", label: "Knitwear" },
						{ href: "/products", label: "Accessories" },
						{ href: "/products", label: "The Archive" },
					].map((item) => (
						<li key={item.label}>
							<YnsLink
								prefetch={"eager"}
								href={item.href}
								className="text-sm text-mushroom hover:text-foreground transition-colors"
							>
								{item.label}
							</YnsLink>
						</li>
					))}
				</ul>
			</div>
		);
	}

	return (
		<div>
			<h3 className="utility-caps text-foreground">Shop</h3>
			<ul className="mt-5 space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/collection/${collection.slug}`}
							className="text-sm text-mushroom hover:text-foreground transition-colors"
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
		return (
			<div>
				<h3 className="utility-caps text-foreground">Company</h3>
				<ul className="mt-5 space-y-3">
					{["About", "Our Atelier", "Sustainability", "Careers", "Press"].map((label) => (
						<li key={label}>
							<YnsLink
								prefetch={"eager"}
								href="/"
								className="text-sm text-mushroom hover:text-foreground transition-colors"
							>
								{label}
							</YnsLink>
						</li>
					))}
				</ul>
			</div>
		);
	}

	return (
		<div>
			<h3 className="utility-caps text-foreground">Company</h3>
			<ul className="mt-5 space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/legal${page.href}`}
							className="text-sm text-mushroom hover:text-foreground transition-colors"
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
		<footer className="border-t border-border bg-background">
			<div className="mx-auto max-w-[1600px] px-6 lg:px-10">
				<div className="grid grid-cols-2 gap-y-12 gap-x-8 py-16 sm:grid-cols-3 lg:grid-cols-6 lg:py-20">
					{/* Brand */}
					<div className="col-span-2 sm:col-span-3 lg:col-span-2 lg:max-w-sm">
						<YnsLink
							prefetch={"eager"}
							href="/"
							className="font-wordmark text-xl text-foreground tracking-[0.22em]"
						>
							Your Next Store
						</YnsLink>
						<p className="mt-5 text-sm leading-relaxed text-mushroom">
							Considered tailoring, knitwear and accessories — patterned in our studio, finished by hand, made
							to last beyond the season.
						</p>
						<div className="mt-7 flex items-center gap-5 text-foreground/80">
							{socials.map((s) => (
								<a
									key={s.label}
									aria-label={s.label}
									href={s.href}
									className="hover:text-foreground transition-colors"
								>
									<SocialIcon d={s.d} label={s.label} />
								</a>
							))}
						</div>
					</div>

					<FooterCollections />

					<div>
						<h3 className="utility-caps text-foreground">Customer Care</h3>
						<ul className="mt-5 space-y-3">
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/about"
									className="text-sm text-mushroom hover:text-foreground transition-colors"
								>
									About Us
								</YnsLink>
							</li>
							<FooterContactLink />
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/faq"
									className="text-sm text-mushroom hover:text-foreground transition-colors"
								>
									Contact Us
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/faq"
									className="text-sm text-mushroom hover:text-foreground transition-colors"
								>
									Shipping & Returns
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/faq"
									className="text-sm text-mushroom hover:text-foreground transition-colors"
								>
									Size Guide
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/faq"
									className="text-sm text-mushroom hover:text-foreground transition-colors"
								>
									Order Status
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/faq"
									className="text-sm text-mushroom hover:text-foreground transition-colors"
								>
									FAQ
								</YnsLink>
							</li>
							<FooterBlogLink />
						</ul>
					</div>

					<FooterLegalPages />

					<div>
						<h3 className="utility-caps text-foreground">Discover</h3>
						<ul className="mt-5 space-y-3">
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/"
									className="text-sm text-mushroom hover:text-foreground transition-colors"
								>
									Journal
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/"
									className="text-sm text-mushroom hover:text-foreground transition-colors"
								>
									Gift Cards
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/"
									className="text-sm text-mushroom hover:text-foreground transition-colors"
								>
									Stores
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/"
									className="text-sm text-mushroom hover:text-foreground transition-colors"
								>
									Wholesale
								</YnsLink>
							</li>
						</ul>
					</div>
				</div>

				{/* Country bar */}
				<div className="flex flex-col gap-4 border-t border-border py-7 sm:flex-row sm:items-center sm:justify-between">
					<div className="flex items-center gap-2 text-mushroom">
						<Globe className="h-4 w-4" strokeWidth={1.4} />
						<span className="utility-caps text-foreground">United States · USD $</span>
						<span className="text-mushroom"> · English</span>
					</div>
					<p className="text-xs text-mushroom">
						&copy; {new Date().getFullYear()} Your Next Store. All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
}
