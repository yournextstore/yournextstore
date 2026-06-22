import "@/app/globals.css";

import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { Suspense } from "react";
import { CartProvider } from "@/app/cart/cart-context";
import { CartSidebar } from "@/app/cart/cart-sidebar";
import { CartButton } from "@/app/cart-button";
import { Footer } from "@/app/footer";
import { Navbar, type NavLink } from "@/app/navbar";
import { SearchInput } from "@/app/search-input";
import { AuthButton } from "@/components/auth-button";
import { CookieConsent } from "@/components/cookie-consent";
import { ErrorOverlayRemover, NavigationReporter } from "@/components/devtools";
import { NewsletterDialog } from "@/components/newsletter-dialog";
import { ReferralBadge } from "@/components/referral-badge";
import { Toaster } from "@/components/ui/sonner";
import { YnsLink } from "@/components/yns-link";
import { AUTH_ENABLED } from "@/lib/auth-config";
import { commerce, getCanonicalUrl, getStoreFaviconUrl, meGetCached } from "@/lib/commerce";
import { getCartCookieJson } from "@/lib/cookies";
import { StoreJsonLd } from "@/lib/json-ld";

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
		alternates: {
			canonical: "/",
		},
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
			icon: [
				{ url: faviconUrl, sizes: "any", type: "image/svg+xml" },
				{ url: faviconUrl, sizes: "192x192", type: "image/png" },
			],
			apple: [{ url: faviconUrl, sizes: "180x180" }],
			shortcut: faviconUrl,
		},
		manifest: "/manifest.webmanifest",
	};
}

export async function generateMetadata(): Promise<Metadata> {
	const metadata = await getStoreMetadata();
	return { ...metadata, metadataBase: new URL(getCanonicalUrl()) };
}

async function getInitialCart() {
	const cartCookie = await getCartCookieJson();
	if (!cartCookie?.id) return { cart: null, cartId: null };
	try {
		const cart = await commerce.cartGet({ cartId: cartCookie.id });
		return { cart: cart ?? null, cartId: cartCookie.id };
	} catch {
		return { cart: null, cartId: cartCookie.id };
	}
}

async function getNavLinks(): Promise<NavLink[]> {
	"use cache";
	cacheLife("hours");
	const [collections, me] = await Promise.all([
		commerce.collectionBrowse({ limit: 5 }),
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

function SiteHeader({ links }: { links: import("@/app/navbar").NavLink[] }) {
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
						<YnsLink
							prefetch="eager"
							href="/"
							className="font-display text-[28px] sm:text-[32px] leading-none font-light tracking-[0.04em] text-foreground"
						>
							Your Next Store
						</YnsLink>
					</div>
					{/* Right: Icons */}
					<div className="flex items-center justify-end gap-1">
						<Suspense fallback={<div className="w-9 h-9" />}>
							<SearchInput />
						</Suspense>
						{AUTH_ENABLED && <AuthButton />}
						<button
							type="button"
							className="hidden sm:flex items-center justify-center w-9 h-9 hover:bg-accent/40 transition-colors"
							aria-label="Account"
						>
							<UserIcon />
						</button>
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
	const [{ cart, cartId }, links] = await Promise.all([getInitialCart(), getNavLinks()]);

	return (
		<CartProvider initialCart={cart} initialCartId={cartId}>
			<div className="flex min-h-screen flex-col bg-background">
				<SiteHeader links={links} />
				<div className="flex-1">{children}</div>
				<Footer />
				<ReferralBadge />
			</div>
			<CartSidebar />
		</CartProvider>
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

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	const env = process.env.VERCEL_ENV || "development";
	const lang = await getHtmlLang();
	return (
		<html lang={lang}>
			<body className={`${inter.variable} ${cormorant.variable} antialiased`}>
				{/* DO NOT REMOVE / REORDER: required for GDPR + GTM Consent Mode v2. Must stay at top of <body>. */}
				<Suspense>
					<CookieConsent />
				</Suspense>
				<Suspense>
					<StoreJsonLd />
				</Suspense>
				<Suspense>
					<CartProviderWrapper>{children}</CartProviderWrapper>
				</Suspense>
				<Suspense>
					<NewsletterPopupSection />
				</Suspense>
				<Toaster richColors position="top-center" />
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
