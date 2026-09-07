import "@/app/globals.css";

import { UserRound } from "lucide-react";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { Geist, Geist_Mono, Oswald } from "next/font/google";
import Link from "next/link";
import { Suspense } from "react";
import { CartBootstrap, CartProvider } from "@/app/cart/cart-context";
import { CartSidebar } from "@/app/cart/cart-sidebar";
import { CartButton } from "@/app/cart-button";
import { Footer } from "@/app/footer";
import { Navbar } from "@/app/navbar";
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

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

const oswald = Oswald({
	variable: "--font-oswald",
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
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

	if (!cartCookie?.id) {
		return { cart: null, cartId: null };
	}

	try {
		const cart = await commerce.cartGet({ cartId: cartCookie.id });
		return { cart: cart ?? null, cartId: cartCookie.id };
	} catch {
		return { cart: null, cartId: cartCookie.id };
	}
}

async function CartBootstrapper() {
	const { cart, cartId } = await getInitialCart();

	return <CartBootstrap cart={cart} cartId={cartId} />;
}

async function CartProviderWrapper({ children }: { children: React.ReactNode }) {
	// Cached reads only — awaiting the cart or cookies here would pull the header,
	// nav and footer out of the prerendered shell.
	const storeConfig = await getStoreConfig();

	return (
		<StoreConfigProvider value={storeConfig}>
			<CartProvider>
				<div className="flex min-h-screen flex-col">
					{/* Top utility bar */}
					<div className="bg-[#1a1a1a] text-white/70 text-xs">
						<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-8">
							<span className="hidden sm:inline">Helpline: (+800) 123 456 7890</span>
							<div className="flex items-center gap-4 ml-auto">
								<Link href="/products" className="hover:text-white transition-colors">
									Track your order
								</Link>
							</div>
						</div>
					</div>

					{/* Main header */}
					<header className="sticky top-0 z-50 bg-[#222222] shadow-lg">
						<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
							<div className="flex items-center justify-between h-16">
								<div className="flex items-center gap-8">
									<Link
										href="/"
										className="font-heading text-2xl font-bold text-white uppercase tracking-wider"
									>
										Your Next Store
									</Link>
								</div>
								<div className="flex items-center gap-4">
									<Navbar />
									<Suspense>
										<SearchInput />
									</Suspense>
									{/* Plain <a>: /account is a proxied zone — soft navigation 500s (see AGENTS.md).
								    Static on purpose: reading the session here would pull the header out of the
								    prerendered shell. */}
									<a
										href="/account"
										className="p-2 text-white hover:bg-white/10 transition-colors"
										aria-label="Account"
									>
										<UserRound className="w-5 h-5" />
									</a>
									<CartButton />
								</div>
							</div>
						</div>
					</header>

					{/* Yellow navigation bar */}
					<div className="bg-brand text-brand-foreground font-heading">
						<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
							<div className="flex items-center h-12 gap-6 text-sm font-semibold uppercase tracking-wide overflow-x-auto">
								<Link href="/products" className="whitespace-nowrap hover:opacity-80 transition-opacity">
									Shop All
								</Link>
								<Suspense>
									<NavCollections />
								</Suspense>
							</div>
						</div>
					</div>

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

async function NavCollections() {
	const collections = await commerce.collectionBrowse({ limit: 5 });
	return collections.data.map((collection) => (
		<Link
			key={collection.id}
			href={`/collection/${collection.slug}`}
			className="whitespace-nowrap hover:opacity-80 transition-opacity"
		>
			{collection.name}
		</Link>
	));
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
	const env = process.env.VERCEL_ENV || "development";
	const lang = await getHtmlLang();

	return (
		<html lang={lang}>
			<body className={`${geistSans.variable} ${geistMono.variable} ${oswald.variable} antialiased`}>
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
