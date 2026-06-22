import "@/app/globals.css";

import { MapPin } from "lucide-react";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { Nunito, Sniglet } from "next/font/google";
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

const sniglet = Sniglet({
	variable: "--font-sniglet",
	subsets: ["latin"],
	weight: ["400", "800"],
	display: "swap",
});

const nunito = Nunito({
	variable: "--font-nunito",
	subsets: ["latin"],
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

function AnnouncementBar() {
	return (
		<div className="bg-[#a8b5a0] text-[#3a2418]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-center gap-2 text-center text-xs sm:text-sm font-medium tracking-wide">
				<MapPin className="h-3.5 w-3.5" aria-hidden />
				<span>Now in more stores! Find us near you</span>
			</div>
		</div>
	);
}

function StoreBadge() {
	return (
		<YnsLink prefetch="eager" href="/" aria-label="Your Next Store" className="group inline-flex">
			<span className="relative flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full bg-[#fbf4e8] border-2 border-[#c99a5e] shadow-[0_8px_24px_-12px_rgba(74,44,26,0.4)] transition-transform group-hover:rotate-3">
				<svg viewBox="0 0 96 96" className="h-full w-full" aria-hidden>
					<defs>
						<path id="circle-text" d="M 48,48 m -34,0 a 34,34 0 1,1 68,0 a 34,34 0 1,1 -68,0" />
					</defs>
					<text
						fontFamily="var(--font-sniglet)"
						fontSize="9"
						fontWeight="800"
						fill="#4a2c1a"
						letterSpacing="1.2"
					>
						<textPath href="#circle-text" startOffset="2%">
							YOUR NEXT STORE · WHOLESOME SMALL-BATCH ·
						</textPath>
					</text>
					<g transform="translate(48 50)">
						<circle r="14" fill="#f5e6d3" stroke="#c99a5e" strokeWidth="1.5" />
						<path d="M -8 4 Q -4 -6 0 -4 Q 4 -6 8 4 Z" fill="#c99a5e" />
						<circle cx="-3" cy="-1" r="1.4" fill="#4a2c1a" />
						<circle cx="3" cy="-1" r="1.4" fill="#4a2c1a" />
						<path d="M -3 5 Q 0 7 3 5" stroke="#4a2c1a" strokeWidth="1.2" fill="none" strokeLinecap="round" />
					</g>
				</svg>
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
			<div className="flex min-h-screen flex-col bg-background">
				<AnnouncementBar />
				<header className="sticky top-0 z-50 bg-[#f5e6d3]/95 backdrop-blur-md border-b border-[#d9c1a3]/60">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="relative flex items-center justify-between h-20 sm:h-24">
							<div className="flex items-center gap-6">
								<Suspense>
									<Navbar links={links} />
								</Suspense>
							</div>
							<div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
								<StoreBadge />
							</div>
							<div className="flex items-center gap-2">
								<Suspense>
									<SearchInput />
								</Suspense>
								{AUTH_ENABLED && <AuthButton />}
								<YnsLink
									prefetch="eager"
									href="/products"
									className="hidden md:inline-flex items-center justify-center h-10 px-5 rounded-full bg-[#c99a5e] text-[#4a2c1a] text-xs sm:text-sm font-bold tracking-[0.18em] uppercase border-2 border-[#8b5e3c] shadow-[0_4px_0_0_#8b5e3c] hover:translate-y-[2px] hover:shadow-[0_2px_0_0_#8b5e3c] transition-all"
								>
									Where to Buy
								</YnsLink>
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
			<body className={`${sniglet.variable} ${nunito.variable} font-body antialiased`}>
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
