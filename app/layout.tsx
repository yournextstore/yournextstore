import "@/app/globals.css";

import { Phone, Search, UserRound } from "lucide-react";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { Oswald, Source_Sans_3 } from "next/font/google";
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

const headingFont = Oswald({
	variable: "--font-heading",
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
});

const bodyFont = Source_Sans_3({
	variable: "--font-body",
	subsets: ["latin"],
	weight: ["300", "400", "500", "600", "700"],
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
					{/* Announcement Bar */}
					<div className="bg-primary text-primary-foreground text-center text-sm py-2 px-4">
						<span className="font-medium">Free Shipping on Orders Over $500</span>
						<span className="mx-3 hidden sm:inline">|</span>
						<span className="hidden sm:inline">30-Day Returns on All Parts</span>
					</div>

					{/* Top Bar */}
					<div className="bg-[#1a1a1a] text-[#cccccc] text-xs py-2 px-4 hidden sm:block">
						<div className="max-w-7xl mx-auto flex items-center justify-between">
							<div className="flex items-center gap-4">
								<span className="flex items-center gap-1.5">
									<Phone className="w-3 h-3" />
									Helpline: (+800) 123 456 7890
								</span>
							</div>
							<div className="flex items-center gap-3">
								<Link href="/" className="hover:text-white transition-colors">
									Track your order
								</Link>
							</div>
						</div>
					</div>

					{/* Main Header */}
					<header className="sticky top-0 z-50 border-b border-border bg-background shadow-sm">
						<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
							<div className="flex items-center justify-between h-16 sm:h-20">
								<Link
									href="/"
									className="font-heading text-2xl sm:text-3xl font-bold uppercase tracking-tight text-foreground"
								>
									Your Next Store
								</Link>

								{/* Search Bar - Desktop */}
								<div className="hidden md:flex flex-1 max-w-xl mx-8">
									<div className="relative w-full">
										<div className="flex items-center w-full border border-border rounded-sm overflow-hidden">
											<input
												type="text"
												placeholder="Search automotive parts & accessories..."
												className="w-full px-4 py-2.5 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none"
												readOnly
											/>
											<button
												type="button"
												className="px-4 py-2.5 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
											>
												<Search className="w-4 h-4" />
											</button>
										</div>
									</div>
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

						{/* Navigation Bar */}
						<div className="bg-[#1a1a1a]">
							<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
								<div className="flex items-center h-12">
									<Navbar />
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

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const env = process.env.VERCEL_ENV || "development";
	const lang = await getHtmlLang();

	return (
		<html lang={lang}>
			<body
				className={`${headingFont.variable} ${bodyFont.variable} font-[family-name:var(--font-body)] antialiased`}
			>
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
