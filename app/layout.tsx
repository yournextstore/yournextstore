import "@/app/globals.css";

import { MapPin, Phone } from "lucide-react";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { Inter, Poppins } from "next/font/google";
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
	display: "swap",
});

const poppins = Poppins({
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

function BrandMark() {
	return (
		<YnsLink prefetch={"eager"} href="/" className="flex items-center gap-2">
			<span className="grid h-9 w-9 place-items-center rounded-full bg-[var(--brand)] text-white shadow-soft">
				<svg
					viewBox="0 0 24 24"
					className="h-5 w-5"
					fill="none"
					stroke="currentColor"
					strokeWidth="2.4"
					strokeLinecap="round"
					strokeLinejoin="round"
					aria-hidden="true"
				>
					<path d="M12 21c0-5 3-9 8-10-1 5-4 9-8 10Z" fill="currentColor" stroke="none" opacity=".9" />
					<path d="M12 21c0-5-3-9-8-10 1 5 4 9 8 10Z" fill="currentColor" stroke="none" opacity=".7" />
					<path d="M12 21V8" />
				</svg>
			</span>
			<span className="font-display text-lg font-bold tracking-tight text-white">Your Next Store</span>
		</YnsLink>
	);
}

async function CartProviderWrapper({ children }: { children: React.ReactNode }) {
	const [{ cart, cartId }, links] = await Promise.all([getInitialCart(), getNavLinks()]);

	return (
		<CartProvider initialCart={cart} initialCartId={cartId}>
			<div className="flex min-h-screen flex-col bg-background">
				<header className="sticky top-0 z-50 bg-[var(--brand-deep)] text-white">
					{/* Announcement strip */}
					<div className="border-b border-white/10 bg-[var(--brand-deep)]/95">
						<div className="mx-auto flex h-9 max-w-7xl items-center justify-between px-4 text-[12px] text-white/80 sm:px-6 lg:px-8">
							<div className="flex items-center gap-4">
								<span className="hidden items-center gap-1.5 sm:flex">
									<MapPin className="h-3.5 w-3.5" />
									Deliver to 10001 — New York
								</span>
								<span className="hidden items-center gap-1.5 md:flex">
									<Phone className="h-3.5 w-3.5" />
									(555) 010-FRESH
								</span>
							</div>
							<div className="flex items-center gap-4">
								<span className="hidden sm:inline">Free same-day delivery on orders over $35</span>
								<span className="rounded-full bg-[var(--accent-saffron)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--brand-deep)]">
									New
								</span>
							</div>
						</div>
					</div>
					{/* Main header */}
					<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
						<div className="flex h-20 items-center gap-4">
							<BrandMark />
							<div className="hidden flex-1 md:block">
								<Suspense>
									<SearchInput />
								</Suspense>
							</div>
							<div className="ml-auto flex items-center gap-1 md:gap-2">
								<button
									type="button"
									className="hidden items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/15 lg:flex"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-4 w-4"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										strokeWidth="2"
										aria-hidden="true"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M20 21v-2a4 4 0 00-3-3.87M4 21v-2a4 4 0 013-3.87m6-4a4 4 0 100-8 4 4 0 000 8z"
										/>
									</svg>
									Sign in
								</button>
								{AUTH_ENABLED && <AuthButton />}
								<CartButton />
							</div>
						</div>
						<div className="border-t border-white/10 md:hidden">
							<div className="py-3">
								<Suspense>
									<SearchInput />
								</Suspense>
							</div>
						</div>
						<div className="hidden md:block">
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

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	const env = process.env.VERCEL_ENV || "development";
	const lang = await getHtmlLang();
	return (
		<html lang={lang}>
			<body className={`${inter.variable} ${poppins.variable} antialiased`}>
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
