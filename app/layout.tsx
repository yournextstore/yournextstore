import "@/app/globals.css";

import { UserRound } from "lucide-react";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { Cormorant_Garamond, Inter } from "next/font/google";
import Link from "next/link";
import { Suspense } from "react";
import { CartBootstrap, CartProvider } from "@/app/cart/cart-context";
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
import { Toaster } from "@/components/ui/sonner";
import { commerce, getCanonicalUrl, getStoreFaviconUrl, meGetCached } from "@/lib/commerce";
import { getCartCookieJson } from "@/lib/cookies";
import { StoreJsonLd } from "@/lib/json-ld";
import { getStoreConfig } from "@/lib/store-config";

const inter = Inter({
	variable: "--font-sans",
	subsets: ["latin"],
	display: "swap",
});

const cormorant = Cormorant_Garamond({
	variable: "--font-display",
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
	display: "swap",
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
		alternates: { canonical: "/" },
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
	// URL instances can't cross the "use cache" serialization boundary, so
	// metadataBase is attached outside the cached scope (env-only, no IO).
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

function AnnouncementBar() {
	const items = [
		"Free carbon-neutral shipping on orders over $80",
		"New Spring Edition is here",
		"Members save 15% on first order",
		"Refill, reuse, repeat — our ethos",
	];
	const loop = [...items, ...items];

	return (
		<div className="bg-[var(--olive-deep)] text-[var(--cream)] overflow-hidden text-[11px] tracking-[0.18em] uppercase">
			<div className="flex animate-ticker whitespace-nowrap py-2.5 gap-12">
				{loop.map((text, i) => (
					<span key={`${text}-${i}`} className="flex items-center gap-12 shrink-0">
						<span className="opacity-60">✦</span>
						<span>{text}</span>
					</span>
				))}
			</div>
		</div>
	);
}

function Logo() {
	return (
		<Link href="/" className="flex items-center gap-2 group">
			<svg
				viewBox="0 0 32 32"
				className="h-7 w-7 text-[var(--olive-deep)] transition-transform group-hover:rotate-12"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.6"
				aria-hidden="true"
			>
				<path d="M16 4 C 9 9, 6 16, 16 28 C 26 16, 23 9, 16 4 Z" strokeLinejoin="round" />
				<path d="M16 4 L 16 28" strokeLinecap="round" />
				<path d="M16 12 L 11 9" strokeLinecap="round" />
				<path d="M16 16 L 22 13" strokeLinecap="round" />
				<path d="M16 20 L 11 17" strokeLinecap="round" />
			</svg>
			<span className="font-display text-2xl font-medium tracking-tight text-[var(--olive-deep)]">
				Your Next Store
			</span>
		</Link>
	);
}

async function CartBootstrapper() {
	const { cart, cartId } = await getInitialCart();

	return <CartBootstrap cart={cart} cartId={cartId} />;
}

async function CartProviderWrapper({ children }: { children: React.ReactNode }) {
	const [links] = await Promise.all([getNavLinks()]);
	const storeConfig = await getStoreConfig();

	return (
		<StoreConfigProvider value={storeConfig}>
			<CartProvider>
				<div className="flex min-h-screen flex-col bg-background">
					<AnnouncementBar />
					<header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-md">
						<div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
							<div className="flex items-center justify-between h-20">
								<div className="flex items-center gap-10 flex-1">
									<Logo />
									<Navbar links={links} />
								</div>
								<div className="flex items-center gap-2">
									<Suspense>
										<SearchInput />
									</Suspense>
									{/* Plain <a>: /account is a proxied zone — soft navigation 500s (see AGENTS.md).
Static on purpose: reading the session here would pull the header out of the
prerendered shell. */}
									<a href="/account" className="p-2 transition-opacity hover:opacity-80" aria-label="Account">
										<UserRound className="w-5 h-5" />
									</a>
									<CartButton />
								</div>
							</div>
						</div>
					</header>
					<div className="flex-1">{children}</div>
					<Footer />
				</div>
				<CartSidebar />
				<Suspense>
					<CartBootstrapper />
				</Suspense>
				{/* Inside CartProvider on purpose: add-to-cart from chat uses the cart context. */}
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
