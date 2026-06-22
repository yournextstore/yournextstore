import "@/app/globals.css";

import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { Fraunces, Lobster_Two, Mulish } from "next/font/google";
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

const bodyFont = Mulish({
	variable: "--font-body",
	subsets: ["latin"],
	display: "swap",
});

const headingFont = Fraunces({
	variable: "--font-heading",
	subsets: ["latin"],
	display: "swap",
	weight: ["500", "600", "700", "900"],
});

const displayFont = Lobster_Two({
	variable: "--font-display",
	subsets: ["latin"],
	display: "swap",
	weight: ["400", "700"],
});

async function getStoreMetadata(): Promise<Metadata> {
	"use cache";
	cacheLife("hours");
	const me = await meGetCached();
	const storeName = me.store.name || "Your Next Store";
	const storeDescription =
		me.store.settings?.storeDescription ||
		"Better-for-you classics, reimagined. Your Next Store — wholesome flavors, joyful packaging.";
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

function AnnouncementBar() {
	const items = [
		"SIGN UP FOR 10% OFF YOUR FIRST PURCHASE",
		"FREE SHIPPING ON ORDERS OVER $40",
		"GLUTEN-FREE · DAIRY-FREE · NUT-FREE",
		"BAKED FRESH · SHIPPED FAST",
	];
	const stream = [...items, ...items];

	return (
		<div className="bg-[#e8456a] text-[#fff8e7] text-[11px] sm:text-xs tracking-[0.18em] font-semibold overflow-hidden">
			<div className="flex animate-marquee whitespace-nowrap py-2">
				{stream.map((text, idx) => (
					<span key={`announce-${idx}-${text}`} className="mx-8 inline-flex items-center gap-3">
						<span aria-hidden className="text-[#fcefa8]">
							★
						</span>
						{text}
					</span>
				))}
			</div>
		</div>
	);
}

function Logo() {
	return (
		<YnsLink prefetch={"eager"} href="/" className="inline-flex flex-col items-center leading-none">
			<span className="font-display text-[2.1rem] sm:text-[2.4rem] text-[#e8456a] -rotate-2 leading-[0.85]">
				Your
			</span>
			<span className="font-display text-[2.1rem] sm:text-[2.4rem] text-[#3a4a8c] rotate-1 -mt-2 leading-[0.85]">
				Next Store
			</span>
		</YnsLink>
	);
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

async function CartProviderWrapper({ children }: { children: React.ReactNode }) {
	const [{ cart, cartId }, links] = await Promise.all([getInitialCart(), getNavLinks()]);

	return (
		<CartProvider initialCart={cart} initialCartId={cartId}>
			<div className="flex min-h-screen flex-col bg-[#fdf6cf]">
				<AnnouncementBar />
				<header className="sticky top-0 z-50 bg-[#fcefa8]/95 backdrop-blur-md border-b-2 border-[#3a4a8c]/15">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="flex items-center justify-between h-20 sm:h-24">
							<div className="flex-1 hidden sm:flex">
								<Suspense>
									<SearchInput />
								</Suspense>
							</div>
							<div className="flex-1 flex justify-center sm:justify-center">
								<Logo />
							</div>
							<div className="flex-1 flex items-center justify-end gap-1 sm:gap-2">
								<div className="sm:hidden">
									<Suspense>
										<SearchInput />
									</Suspense>
								</div>
								{AUTH_ENABLED && <AuthButton />}
								<CartButton />
							</div>
						</div>
						<div className="pb-3 sm:pb-4">
							<Navbar links={links} />
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
			<body className={`${bodyFont.variable} ${headingFont.variable} ${displayFont.variable} antialiased`}>
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
