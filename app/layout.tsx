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
	display: "swap",
});

const cormorant = Cormorant_Garamond({
	variable: "--font-cormorant",
	subsets: ["latin"],
	weight: ["300", "400", "500", "600", "700"],
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

function MascotMark() {
	return (
		<svg
			width="22"
			height="26"
			viewBox="0 0 22 26"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden="true"
		>
			<title>YNS mascot</title>
			<path d="M6 2 L6 8 M16 2 L16 8" stroke="#f4f2f8" strokeWidth="1.5" strokeLinecap="round" />
			<ellipse cx="11" cy="14" rx="8" ry="9" stroke="#f4f2f8" strokeWidth="1.5" fill="none" />
			<circle cx="8" cy="13" r="1.2" fill="#f4f2f8" />
			<circle cx="14" cy="13" r="1.2" fill="#f4f2f8" />
			<path d="M9 17 Q11 19 13 17" stroke="#f4f2f8" strokeWidth="1.3" strokeLinecap="round" fill="none" />
		</svg>
	);
}

async function CartProviderWrapper({ children }: { children: React.ReactNode }) {
	const [{ cart, cartId }, links] = await Promise.all([getInitialCart(), getNavLinks()]);

	return (
		<CartProvider initialCart={cart} initialCartId={cartId}>
			<div className="flex min-h-screen flex-col bg-background text-foreground">
				<header className="fixed top-0 left-0 right-0 z-50">
					<div className="absolute inset-0 bg-gradient-to-b from-[#050817]/80 via-[#050817]/40 to-transparent pointer-events-none" />
					<div className="relative max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
						<div className="flex items-center justify-between h-16">
							<div className="flex items-center gap-3">
								<YnsLink prefetch={"eager"} href="/" className="flex items-center gap-2.5 group">
									<MascotMark />
									<span className="font-serif text-base tracking-tight text-foreground hidden sm:inline">
										Your Next Store
									</span>
								</YnsLink>
							</div>

							<div className="hidden md:flex items-center gap-8">
								<Navbar links={links} />
							</div>

							<div className="flex items-center gap-3">
								<Suspense>
									<SearchInput />
								</Suspense>
								{AUTH_ENABLED && <AuthButton />}
								<YnsLink
									prefetch={"eager"}
									href="/products"
									className="btn-cobalt inline-flex items-center justify-center h-8 px-5 rounded-full text-[13px] font-medium text-white"
								>
									Buy
								</YnsLink>
								<CartButton />
							</div>
						</div>
					</div>
				</header>
				<div className="flex-1 pt-16">{children}</div>
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

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
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
