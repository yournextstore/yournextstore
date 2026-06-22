import { Clock, Leaf, MapPin, Phone, Truck } from "lucide-react";
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
			<h3 className="font-display text-sm font-semibold text-white">Shop fresh</h3>
			<ul className="mt-4 space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/collection/${collection.slug}`}
							className="text-sm text-white/70 transition-colors hover:text-[var(--accent-saffron)]"
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
			<h3 className="font-display text-sm font-semibold text-white">Legal</h3>
			<ul className="mt-4 space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<YnsLink
							prefetch={"eager"}
							href={`/legal${page.href}`}
							className="text-sm text-white/70 transition-colors hover:text-[var(--accent-saffron)]"
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
		<footer className="bg-[var(--brand-deep)] text-white">
			{/* Trust ribbon */}
			<div className="border-b border-white/10">
				<div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:gap-8 lg:px-8">
					{[
						{
							icon: Truck,
							title: "Same-day delivery",
							sub: "Order before 4pm, get it tonight",
						},
						{ icon: Leaf, title: "Organic & local", sub: "Direct from regional growers" },
						{ icon: Clock, title: "Fresh guarantee", sub: "Picked at dawn, packed at noon" },
						{ icon: Phone, title: "24/7 support", sub: "We're here whenever you need us" },
					].map((item) => (
						<div key={item.title} className="flex items-start gap-3">
							<span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/10 text-[var(--accent-saffron)]">
								<item.icon className="h-5 w-5" />
							</span>
							<div>
								<div className="font-display text-sm font-semibold text-white">{item.title}</div>
								<div className="text-xs text-white/65">{item.sub}</div>
							</div>
						</div>
					))}
				</div>
			</div>

			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-5">
					{/* Brand */}
					<div className="lg:col-span-2">
						<YnsLink prefetch={"eager"} href="/" className="inline-flex items-center gap-2">
							<span className="grid h-9 w-9 place-items-center rounded-full bg-[var(--accent-saffron)] text-[var(--brand-deep)]">
								<Leaf className="h-5 w-5" />
							</span>
							<span className="font-display text-xl font-bold">Your Next Store</span>
						</YnsLink>
						<p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">
							Fresh groceries and pantry essentials, delivered to your door from neighbourhood growers and
							makers.
						</p>
						<div className="mt-5 space-y-2 text-sm text-white/75">
							<div className="flex items-center gap-2">
								<MapPin className="h-4 w-4 text-[var(--accent-saffron)]" />
								221 Harvest Lane, Brooklyn NY
							</div>
							<div className="flex items-center gap-2">
								<Phone className="h-4 w-4 text-[var(--accent-saffron)]" />
								(555) 010-FRESH
							</div>
						</div>
					</div>

					<FooterCollections />

					<div>
						<h3 className="font-display text-sm font-semibold text-white">Support</h3>
						<ul className="mt-4 space-y-3">
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
									className="text-sm text-white/70 transition-colors hover:text-[var(--accent-saffron)]"
								>
									Help center
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/products"
									className="text-sm text-white/70 transition-colors hover:text-[var(--accent-saffron)]"
								>
									Delivery info
								</YnsLink>
							</li>
							<li>
								<YnsLink
									prefetch={"eager"}
									href="/search"
									className="text-sm text-white/70 transition-colors hover:text-[var(--accent-saffron)]"
								>
									Track an order
								</YnsLink>
							</li>
							<FooterBlogLink />
						</ul>
					</div>

					<FooterLegalPages />
				</div>

				<div className="border-t border-white/10 py-6">
					<div className="flex flex-col items-start justify-between gap-3 text-sm text-white/60 sm:flex-row sm:items-center">
						<p>&copy; {new Date().getFullYear()} Your Next Store. Grown with care.</p>
						<p className="text-xs">Fresh groceries · Delivered daily · Made in the city</p>
					</div>
				</div>
			</div>
		</footer>
	);
}
