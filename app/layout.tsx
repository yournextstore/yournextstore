import "@/app/globals.css";

import { UserRound } from "lucide-react";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { DM_Sans, Geist_Mono, Playfair_Display } from "next/font/google";
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

const playfair = Playfair_Display({
	variable: "--font-playfair",
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
	style: ["normal", "italic"],
});

const dmSans = DM_Sans({
	variable: "--font-dm-sans",
	subsets: ["latin"],
	weight: ["300", "400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
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
	// URL instances can't cross the "use cache" serialization boundary, so
	// metadataBase is attached outside the cached scope (env-only, no IO).
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
	return (
		<div className="bg-coral-gradient text-white text-xs sm:text-sm">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-9 flex items-center justify-between gap-4">
				<span className="hidden sm:inline-flex items-center gap-1.5 opacity-90">
					<span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-white/80" />
					Customer service
				</span>
				<p className="flex-1 text-center font-medium tracking-wide">
					Free shipping on orders over $50 — small-batch &amp; lovingly packed
				</p>
				<span className="hidden sm:inline-block opacity-90 tabular-nums">$ USD</span>
			</div>
		</div>
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
						<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
							<div className="grid grid-cols-3 items-center h-16">
								<div className="flex items-center gap-6">
									<Navbar links={links} />
								</div>
								<div className="flex justify-center">
									<Link
										href="/"
										className="font-serif italic text-2xl sm:text-3xl tracking-tight text-foreground"
									>
										Your Next Store
									</Link>
								</div>
								<div className="flex items-center justify-end gap-2">
									<Suspense>
										<SearchInput />
									</Suspense>
									{/* Plain <a>: /account is a proxied zone — soft navigation 500s (see AGENTS.md).
Static on purpose: reading the session here would pull the header out of the
prerendered shell. */}
									<a href="/account" className="p-2 transition-opacity hover:opacity-80" aria-label="Account">
										<UserRound className="w-5 h-5" />
									</a>
									<Link
										href="/products"
										className="hidden md:inline-flex text-xs uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground transition-colors px-2"
									>
										Shop
									</Link>
									<CartButton />
								</div>
							</div>
						</div>
					</header>
					<main className="flex-1">{children}</main>
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

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const env = process.env.VERCEL_ENV || "development";
	const lang = await getHtmlLang();

	return (
		<html lang={lang}>
			<body className={`${dmSans.variable} ${playfair.variable} ${geistMono.variable} font-sans antialiased`}>
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
