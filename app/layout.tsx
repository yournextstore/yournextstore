import "@/app/globals.css";

import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { Bagel_Fat_One, Inter } from "next/font/google";
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
	variable: "--font-sans",
	subsets: ["latin"],
});

const bagel = Bagel_Fat_One({
	variable: "--font-display",
	weight: "400",
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
		<div className="w-full bg-[var(--butter)] text-[var(--cobalt)]">
			<div className="max-w-7xl mx-auto px-4 py-2 text-center text-[11px] sm:text-xs font-medium tracking-wide">
				Fuel your day the perfect way — Your Next Store is now stocked nationwide. Grab a bag and your
				favorite protein drink for the perfect pairing.
			</div>
		</div>
	);
}

async function CartProviderWrapper({ children }: { children: React.ReactNode }) {
	const [{ cart, cartId }, links] = await Promise.all([getInitialCart(), getNavLinks()]);

	return (
		<CartProvider initialCart={cart} initialCartId={cartId}>
			<div className="flex min-h-screen flex-col bg-background">
				<AnnouncementBar />
				<header className="sticky top-0 z-50 border-b border-border bg-white/85 backdrop-blur-md">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="grid grid-cols-3 items-center h-16">
							<div className="flex items-center gap-6">
								<Navbar links={links} />
							</div>
							<div className="flex justify-center">
								<YnsLink
									prefetch={"eager"}
									href="/"
									className="font-display text-3xl text-[var(--cobalt)] leading-none italic tracking-tight"
								>
									Your Next Store
								</YnsLink>
							</div>
							<div className="flex items-center justify-end gap-2">
								<YnsLink
									prefetch={"eager"}
									href="/products"
									className="hidden md:inline-flex items-center gap-1.5 h-9 px-4 rounded-full border border-[var(--cobalt)] text-[var(--cobalt)] text-xs font-semibold uppercase tracking-wide hover:bg-[var(--cobalt)] hover:text-white transition-colors"
								>
									<svg
										aria-hidden="true"
										className="h-3.5 w-3.5"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2.5"
										strokeLinecap="round"
										strokeLinejoin="round"
									>
										<path d="M20 10c0 7-8 12-8 12s-8-5-8-12a8 8 0 1 1 16 0Z" />
										<circle cx="12" cy="10" r="3" />
									</svg>
									Find Near You
								</YnsLink>
								<Suspense>
									<SearchInput />
								</Suspense>
								{AUTH_ENABLED && <AuthButton />}
								<CartButton />
							</div>
						</div>
					</div>
				</header>
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

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const env = process.env.VERCEL_ENV || "development";
	const lang = await getHtmlLang();

	return (
		<html lang={lang}>
			<body className={`${inter.variable} ${bagel.variable} antialiased`}>
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
