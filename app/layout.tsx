import "@/app/globals.css";

import { ArrowUpRight, ChevronDown, Info, Layers, LayoutGrid, Search, Truck, UserRound } from "lucide-react";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { Geist, Geist_Mono } from "next/font/google";
import { getImageProps } from "next/image";
import Link from "next/link";
import { ThemeProvider } from "next-themes";
import { Suspense } from "react";
import { CartProvider } from "@/app/cart/cart-context";
import { CartSidebar } from "@/app/cart/cart-sidebar";
import { CartButton } from "@/app/cart-button";
import { Footer } from "@/app/footer";
import { DesktopNavigation, MobileMenu } from "@/app/navbar";
import { CookieConsent } from "@/components/cookie-consent";
import { ErrorOverlayRemover, NavigationReporter } from "@/components/devtools";
import { NewsletterDialog } from "@/components/newsletter-dialog";
import { SearchInput, SearchInputFallback } from "@/components/search/search-input";
import { StoreChatSection } from "@/components/store-chat/store-chat-section";
import { Announcement, TabBar } from "@/components/store-chrome";
import { StoreConfigProvider } from "@/components/store-config-provider";
import { Toaster } from "@/components/ui/sonner";
import { getCategoryTiles, getCollectionTiles } from "@/lib/catalog";
import { getCanonicalUrl, getStoreFaviconUrl, meGetCached } from "@/lib/commerce";
import { StoreJsonLd } from "@/lib/json-ld";
import { getStoreConfig } from "@/lib/store-config";
import { YNSMedia } from "@/lib/yns-media";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
	// Paints only inside chat and code spans, so it loads on use instead of blocking every first paint.
	preload: false,
});

async function getStoreMetadata(): Promise<Metadata> {
	"use cache";
	cacheLife("hours");
	const me = await meGetCached();
	const storeName = me.store.name || "Your Next Store";
	const storeDescription = me.store.settings?.storeDescription || "Your next e-commerce store";
	const faviconUrl = getStoreFaviconUrl(me.store.settings) ?? "/logo.svg";
	// The platform favicon is whatever was uploaded (here a 500x500 PNG). Route it through
	// the image optimizer so browsers fetch a few KB from this origin, not the blob host.
	const iconUrl = (size: number) =>
		getImageProps({ src: faviconUrl, width: size, height: size, alt: "" }).props.src;
	const storeLogo =
		typeof me.store.settings?.logo === "string" ? me.store.settings.logo : me.store.settings?.logo?.imageUrl;
	const ogImage = me.store.settings?.ogimage || storeLogo || "/logo.svg";

	return {
		title: {
			default: storeName,
			template: `%s — ${storeName}`,
		},
		description: storeDescription,
		applicationName: storeName,
		// No `alternates.canonical` here on purpose: Next inherits it into every page that
		// does not set its own, which silently declares each such page a duplicate of the
		// home page. The home page carries its own canonical in app/page.tsx instead.
		openGraph: {
			type: "website",
			siteName: storeName,
			title: storeName,
			description: storeDescription,
			url: "/",
			images: [{ url: ogImage, alt: storeName }],
		},
		twitter: {
			card: "summary_large_image",
			title: storeName,
			description: storeDescription,
			images: [ogImage],
		},
		robots: {
			index: true,
			follow: true,
			googleBot: {
				index: true,
				follow: true,
				"max-image-preview": "large",
				"max-snippet": -1,
				"max-video-preview": -1,
			},
		},
		icons: {
			// No `type`: the URL is whatever the admin uploaded and the optimizer negotiates the
			// format, and declaring image/svg+xml over a PNG makes Chrome drop the icon.
			icon: [{ url: iconUrl(64), sizes: "64x64" }],
			// iOS wants a PNG here (the optimizer negotiates WebP), so the original stays for the home-screen icon.
			apple: [{ url: faviconUrl, sizes: "180x180" }],
		},
		manifest: "/manifest.webmanifest",
	};
}

export async function generateMetadata(): Promise<Metadata> {
	const metadata = await getStoreMetadata();
	// URL instances can't cross the "use cache" serialization boundary, so
	// metadataBase is attached outside the cached scope (env-only, no IO).
	return { ...metadata, metadataBase: new URL(getCanonicalUrl()) };
}

const clip = (text: string, max = 46) => (text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text);

async function getHeaderData() {
	"use cache";
	cacheLife("hours");
	const [categories, collections, me] = await Promise.all([
		getCategoryTiles(),
		getCollectionTiles(),
		meGetCached().catch(() => null),
	]);
	const tools = me?.store.settings?.enabledTools;
	return {
		storeName: me?.store.name || "Your Next Store",
		shop: categories.map((c) => ({ href: c.href, name: c.name, image: c.image, hint: clip(c.description) })),
		collections: collections.map((c) => ({
			href: c.href,
			name: c.name,
			image: c.image,
			photo: c.photo,
			hint: clip(c.description),
		})),
		pages: [
			{ href: "/about", name: "About us" },
			{ href: "/faq", name: "FAQ" },
			...(tools?.blog ? [{ href: "/blog", name: "Journal" }] : []),
		],
	};
}

/** Desktop "Shop" mega panel: white cards on a grey panel, server-rendered, no JS. */
function ShopPanel({ shop, collections }: Awaited<ReturnType<typeof getHeaderData>>) {
	const promos = collections.slice(0, 2);
	return (
		<div className="nav-panel shop-panel">
			<div className="nav-card">
				<div className="nav-card-head">
					<p>Shop by</p>
				</div>
				<div className="nav-list">
					<Link href="/products" className="nav-row">
						<span className="icon-tile" aria-hidden>
							<LayoutGrid size={17} aria-hidden />
						</span>
						<span className="nav-row-copy">
							<strong>All products</strong>
							<small>Everything in store</small>
						</span>
					</Link>
					{shop.map((item) => (
						<Link key={item.href} href={item.href} className="nav-row">
							<span className="icon-tile" aria-hidden>
								{item.image ? (
									<YNSMedia src={item.image} alt="" width={40} height={40} sizes="40px" />
								) : (
									<Layers size={17} aria-hidden />
								)}
							</span>
							<span className="nav-row-copy">
								<strong>{item.name}</strong>
								{item.hint && <small>{item.hint}</small>}
							</span>
						</Link>
					))}
				</div>
			</div>
			{collections.length > 0 && (
				<div className="nav-card">
					<div className="nav-card-head">
						<p>
							Collections <span className="count-pill">{collections.length}</span>
						</p>
					</div>
					<div className="nav-list">
						{collections.map((item) => (
							<Link key={item.href} href={item.href} className="nav-row">
								<span className="icon-tile" aria-hidden>
									{item.image ? (
										<YNSMedia src={item.image} alt="" width={40} height={40} sizes="40px" />
									) : (
										<Layers size={17} aria-hidden />
									)}
								</span>
								<span className="nav-row-copy">
									<strong>{item.name}</strong>
									{item.hint && <small>{item.hint}</small>}
								</span>
							</Link>
						))}
					</div>
				</div>
			)}
			{promos.map((item) => (
				<Link key={item.href} href={item.href} className="nav-promo">
					<span className="media">
						<YNSMedia src={item.photo} alt="" fill sizes="320px" className="object-cover" />
					</span>
					<span className="nav-feature-caption">
						<span>
							<small>Collection</small>
							<strong>{item.name}</strong>
						</span>
						<span className="arrow-chip" aria-hidden>
							<ArrowUpRight size={16} aria-hidden />
						</span>
					</span>
				</Link>
			))}
		</div>
	);
}

async function CartProviderWrapper({ children }: { children: React.ReactNode }) {
	// Only cached reads here. Awaiting anything request-time (cookies, headers) would
	// take the header, nav and footer out of the prerendered shell and leave the page
	// blank until the server responds; CartProvider loads the cart in the browser. The
	// other half of the rule: no
	// <Suspense> around this component either — the boundary itself is what streams the
	// chrome out of the shell, whether or not anything inside it is request-time.
	const [header, storeConfig] = await Promise.all([getHeaderData(), getStoreConfig()]);
	// Plain <a> to /account: a proxied zone, soft navigation 500s (see AGENTS.md). Static on
	// purpose: reading the session here would pull the header out of the prerendered shell.
	const accountHref = storeConfig.language
		? `/account?lang=${encodeURIComponent(storeConfig.language)}`
		: "/account";
	const featured = header.collections[0];
	const railLinks = [...header.shop, ...header.collections].slice(0, 6);

	return (
		<StoreConfigProvider value={storeConfig}>
			<CartProvider>
				<div className="flex min-h-screen flex-col">
					<a href="#main" className="skip-link">
						Skip to content
					</a>
					{featured && (
						<Announcement text={`Discover the ${featured.name.toLowerCase()} edit`} href={featured.href} />
					)}
					<header className="store-header">
						<div className="header-main store-width">
							<MobileMenu
								storeName={header.storeName}
								shop={header.shop}
								collections={header.collections}
								pages={header.pages}
								accountHref={accountHref}
							/>
							<Link href="/" className="store-logo">
								{header.storeName}
							</Link>
							<div className="header-search">
								<Suspense fallback={<SearchInputFallback />}>
									<SearchInput />
								</Suspense>
							</div>
							<a className="header-call" href={accountHref}>
								<span className="icon-tile sm" aria-hidden>
									<UserRound size={15} aria-hidden />
								</span>
								<span>
									<small>Your account</small>
									Sign in &amp; orders
								</span>
							</a>
							<div className="header-actions">
								<Link
									className="icon-button mobile-only header-search-link"
									href="/search"
									aria-label="Search products"
								>
									<Search size={18} aria-hidden />
								</Link>
								<a className="icon-button account-link" href={accountHref} aria-label="Account">
									<UserRound size={18} aria-hidden />
								</a>
								<CartButton />
							</div>
						</div>
						<DesktopNavigation
							aside={
								<>
									<a href={accountHref} className="nav-link">
										<Truck size={15} aria-hidden /> Track order
									</a>
									<Link href="/about" className="nav-link">
										<Info size={15} aria-hidden /> About
									</Link>
								</>
							}
						>
							<details name="store-navigation" className="nav-menu">
								<summary className="nav-link">
									Shop <ChevronDown size={15} aria-hidden />
								</summary>
								<ShopPanel {...header} />
							</details>
							{railLinks.map((link) => (
								<Link key={link.href} href={link.href} className="nav-link">
									{link.name}
								</Link>
							))}
						</DesktopNavigation>
					</header>
					<main id="main" className="flex-1">
						{children}
					</main>
					<Footer />
				</div>
				<TabBar />
				<CartSidebar />
				{/* Inside CartProvider on purpose: add-to-cart from chat uses the cart context.
			    Also renders the "Made with YNS" badge so badge and launcher share one dock. */}
				<Suspense>
					<StoreChatSection />
				</Suspense>
			</CartProvider>
		</StoreConfigProvider>
	);
}

async function getHtmlLang(): Promise<string> {
	try {
		const me = await meGetCached();
		return me.store.settings?.defaultLanguage?.split("-")[0] ?? "en";
	} catch {
		return "en";
	}
}

async function NewsletterPopupSection() {
	const me = await meGetCached();
	if (!me.store.settings?.enabledTools?.newsletterPopup) {
		return null;
	}
	return <NewsletterDialog settings={me.store.settings?.newsletterPopup} />;
}

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	// VERCEL_ENV is unset off Vercel, so fall back to NODE_ENV: a self-hosted production
	// build must not ship the builder devtools.
	const env = process.env.VERCEL_ENV || process.env.NODE_ENV;
	const lang = await getHtmlLang();

	return (
		// suppressHydrationWarning: next-themes sets the theme class on <html> before hydration.
		<html lang={lang} suppressHydrationWarning>
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				{/* DO NOT REMOVE / REORDER: required for GDPR + GTM Consent Mode v2. Must stay at top of <body>. */}
				<Suspense>
					<CookieConsent />
				</Suspense>
				<Suspense>
					<StoreJsonLd />
				</Suspense>
				<ThemeProvider attribute="class" forcedTheme="light" disableTransitionOnChange>
					<CartProviderWrapper>{children}</CartProviderWrapper>
					<Suspense>
						<NewsletterPopupSection />
					</Suspense>
					<Toaster richColors position="top-center" />
				</ThemeProvider>
				{env === "development" && (
					<>
						<NavigationReporter />
						<ErrorOverlayRemover />
					</>
				)}
			</body>
		</html>
	);
}
