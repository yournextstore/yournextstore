import "@/app/globals.css";

import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { getImageProps } from "next/image";
import Link from "next/link";
import { ThemeProvider } from "next-themes";
import { Suspense } from "react";
import { CartProvider } from "@/app/cart/cart-context";
import { CartSidebar } from "@/app/cart/cart-sidebar";
import { CartButton } from "@/app/cart-button";
import { Footer } from "@/app/footer";
import { Navbar, type NavLink } from "@/app/navbar";
import { CookieConsent } from "@/components/cookie-consent";
import { ErrorOverlayRemover, NavigationReporter } from "@/components/devtools";
import { NewsletterDialog } from "@/components/newsletter-dialog";
import { SearchInput } from "@/components/search/search-input";
import { StoreChatSection } from "@/components/store-chat/store-chat-section";
import { StoreConfigProvider } from "@/components/store-config-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { Toaster } from "@/components/ui/sonner";
import { commerce, getCanonicalUrl, getStoreFaviconUrl, meGetCached } from "@/lib/commerce";
import { StoreJsonLd } from "@/lib/json-ld";
import { getStoreConfig } from "@/lib/store-config";

const inter = Inter({
	variable: "--font-inter",
	subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
	variable: "--font-cormorant",
	subsets: ["latin"],
	weight: ["300", "400", "500"],
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
	return { ...metadata, metadataBase: new URL(getCanonicalUrl()) };
}

async function getNavLinks(): Promise<NavLink[]> {
	"use cache";
	cacheLife("hours");
	const [collections, me] = await Promise.all([
		commerce.collectionBrowse({ active: true, limit: 5 }),
		meGetCached().catch(() => null),
	]);
	const blogEnabled = me?.store.settings?.enabledTools?.blog ?? false;
	return [
		{ href: "/", label: "Home" },
		{ href: "/products", label: "Products" },
		...collections.data.map((collection) => ({
			href: `/collection/${collection.slug}`,
			label: collection.name,
		})),
		...(blogEnabled ? [{ href: "/blog", label: "Blog" }] : []),
	];
}

function UserIcon() {
	return (
		<svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
			<circle cx="9" cy="6.5" r="3" stroke="currentColor" strokeWidth="1.2" />
			<path d="M3 16c.5-3 3-5 6-5s5.5 2 6 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
		</svg>
	);
}

function HeartIcon() {
	return (
		<svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
			<path
				d="M9 15.5S2.5 11.5 2.5 7.2A3.2 3.2 0 0 1 9 5.5a3.2 3.2 0 0 1 6.5 1.7C15.5 11.5 9 15.5 9 15.5z"
				stroke="currentColor"
				strokeWidth="1.2"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

function SiteHeader({ links, language }: { links: NavLink[]; language: string | null }) {
	return (
		<header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
			{/* Announcement bar */}
			<div className="bg-accent text-accent-foreground">
				<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-2 text-center text-[11px] tracking-[0.22em] uppercase font-medium">
					Complimentary shipping on orders over $250 — Returns within 30 days
				</div>
			</div>
			{/* Utility row */}
			<div className="border-b border-border/50">
				<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-9 flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
					<div className="hidden sm:flex items-center gap-5">
						<span>Edit by Your Next Store</span>
						<span className="w-px h-3 bg-border" />
						<span>Spring · 2026</span>
					</div>
					<div className="flex items-center gap-5">
						<button type="button" className="hover:text-foreground transition-colors hidden sm:inline">
							EN · USD
						</button>
						<span className="w-px h-3 bg-border hidden sm:inline-block" />
						<button type="button" className="hover:text-foreground transition-colors hidden sm:inline">
							Stores
						</button>
						<span className="w-px h-3 bg-border hidden sm:inline-block" />
						<button type="button" className="hover:text-foreground transition-colors">
							Help
						</button>
					</div>
				</div>
			</div>
			{/* Main nav row — centered serif logo */}
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-3 items-center h-[68px]">
					{/* Left: Categories */}
					<div className="flex items-center gap-6">
						<Navbar links={links} />
					</div>
					{/* Center: Serif logo */}
					<div className="flex justify-center">
						<Link
							href="/"
							className="font-display text-[28px] sm:text-[32px] leading-none font-light tracking-[0.04em] text-foreground"
						>
							Your Next Store
						</Link>
					</div>
					{/* Right: Icons */}
					<div className="flex items-center justify-end gap-1">
						<Suspense fallback={<div className="w-9 h-9" />}>
							<SearchInput />
						</Suspense>
						<ThemeToggle />
						{/* Plain <a>: /account is a proxied zone — soft navigation 500s (see AGENTS.md).
						    Static on purpose: reading the session here would pull the header out of the
						    prerendered shell. */}
						<a
							href={language ? `/account?lang=${encodeURIComponent(language)}` : "/account"}
							className="flex items-center justify-center w-9 h-9 hover:bg-accent/40 transition-colors"
							aria-label="Account"
						>
							<UserIcon />
						</a>
						<button
							type="button"
							className="hidden sm:flex items-center justify-center w-9 h-9 hover:bg-accent/40 transition-colors"
							aria-label="Wishlist"
						>
							<HeartIcon />
						</button>
						<CartButton />
					</div>
				</div>
			</div>
		</header>
	);
}

async function CartProviderWrapper({ children }: { children: React.ReactNode }) {
	// Only cached reads here. Awaiting anything request-time (cookies, headers) would
	// take the header, nav and footer out of the prerendered shell and leave the page
	// blank until the server responds; CartProvider loads the cart in the browser. The
	// other half of the rule: no
	// <Suspense> around this component either — the boundary itself is what streams the
	// chrome out of the shell, whether or not anything inside it is request-time.
	const [links, storeConfig] = await Promise.all([getNavLinks(), getStoreConfig()]);

	return (
		<StoreConfigProvider value={storeConfig}>
			<CartProvider>
				<div className="flex min-h-screen flex-col bg-background">
					<SiteHeader links={links} language={storeConfig.language ?? null} />
					<main className="flex-1">{children}</main>
					<Footer />
				</div>
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

// The shop's language, as the platform decides it: the default language once it is switched on, else the store's own.
async function getHtmlLang(): Promise<string> {
	const { locale } = await getStoreConfig();
	return locale.split("-")[0] || "en";
}

async function NewsletterPopupSection() {
	const me = await meGetCached();
	if (!me.store.settings?.enabledTools?.newsletterPopup) {
		return null;
	}
	return <NewsletterDialog settings={me.store.settings?.newsletterPopup} />;
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	// VERCEL_ENV is unset off Vercel, so fall back to NODE_ENV: a self-hosted production
	// build must not ship the builder devtools.
	const env = process.env.VERCEL_ENV || process.env.NODE_ENV;
	const lang = await getHtmlLang();
	return (
		// suppressHydrationWarning: next-themes sets the theme class on <html> before hydration.
		<html lang={lang} suppressHydrationWarning>
			<body className={`${inter.variable} ${cormorant.variable} antialiased`}>
				{/* DO NOT REMOVE / REORDER: required for GDPR + GTM Consent Mode v2. Must stay at top of <body>. */}
				<Suspense>
					<CookieConsent />
				</Suspense>
				<Suspense>
					<StoreJsonLd />
				</Suspense>
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
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
