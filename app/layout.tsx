import "@/app/globals.css";

import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { Inter, Playfair_Display } from "next/font/google";
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

const playfair = Playfair_Display({
	variable: "--font-playfair",
	subsets: ["latin"],
	display: "swap",
	weight: ["400", "500", "600", "700", "800", "900"],
	style: ["normal", "italic"],
});

const inter = Inter({
	variable: "--font-inter",
	subsets: ["latin"],
	display: "swap",
	weight: ["300", "400", "500", "600", "700"],
});

async function getStoreMetadata(): Promise<Metadata> {
	"use cache";
	cacheLife("hours");
	const me = await meGetCached();
	const storeName = me.store.name || "Your Next Store";
	const storeDescription =
		me.store.settings?.storeDescription ||
		"Heritage mattresses, bedding, and pillows — slow-made for a lifetime of rest.";
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
		<div className="bg-[var(--oxblood)] text-[var(--cream)]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-center gap-6 h-9 text-[11px] tracking-[0.18em] uppercase font-medium">
					<span aria-hidden="true" className="hidden sm:inline opacity-60">
						‹
					</span>
					<p className="font-display italic text-[13px] tracking-[0.04em] normal-case opacity-95">
						Try a Your Next Store mattress risk-free with our 100-night trial
					</p>
					<span aria-hidden="true" className="hidden sm:inline opacity-60">
						›
					</span>
				</div>
			</div>
		</div>
	);
}

function Wordmark() {
	return (
		<YnsLink prefetch={"eager"} href="/" className="block group" aria-label="Your Next Store — home">
			<div className="flex items-center gap-3 sm:gap-5">
				<span
					aria-hidden="true"
					className="relative inline-flex h-12 w-12 sm:h-16 sm:w-16 lg:h-20 lg:w-20 shrink-0 items-center justify-center rounded-full border border-[rgba(15,14,12,0.4)] bg-[var(--cream)] overflow-hidden"
				>
					<svg viewBox="0 0 80 80" className="h-full w-full" aria-hidden="true">
						<title>YNS heritage emblem</title>
						<circle cx="40" cy="40" r="38" fill="none" stroke="#0F0E0C" strokeWidth="1.2" />
						<circle cx="40" cy="40" r="32" fill="none" stroke="#0F0E0C" strokeWidth="0.6" opacity="0.5" />
						{Array.from({ length: 8 }).map((_, i) => {
							const a = (i / 8) * Math.PI * 2;
							const r1 = 20;
							const r2 = 12;
							return (
								<g key={`p-${i}`} transform={`rotate(${(i / 8) * 360} 40 40)`}>
									<path
										d={`M40 ${40 - r1} Q ${40 + r2 * 0.6} ${40 - r1 * 0.4} ${40 + r2 * 0.4} ${40 - r2 * 0.2} Q 40 ${40 - r2} ${40 - r2 * 0.4} ${40 - r2 * 0.2} Q ${40 - r2 * 0.6} ${40 - r1 * 0.4} 40 ${40 - r1} Z`}
										fill="#0F0E0C"
									/>
								</g>
							);
						})}
						<circle cx="40" cy="40" r="4" fill="#0F0E0C" />
					</svg>
				</span>
				<span className="font-display tracking-[-0.02em] leading-[0.85] text-[var(--ink)] text-[clamp(2.4rem,9vw,7.5rem)] font-semibold whitespace-nowrap">
					Your Next Store
				</span>
			</div>
		</YnsLink>
	);
}

async function CartProviderWrapper({ children }: { children: React.ReactNode }) {
	const [{ cart, cartId }, links] = await Promise.all([getInitialCart(), getNavLinks()]);

	return (
		<CartProvider initialCart={cart} initialCartId={cartId}>
			<div className="flex min-h-screen flex-col bg-[var(--cream)] text-[var(--ink)]">
				<AnnouncementBar />

				<header className="bg-[var(--cream)]">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-2">
						<Wordmark />
					</div>

					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 sm:mt-6">
						<div className="heritage-rule" />
					</div>

					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="flex items-center justify-between py-3 sm:py-4">
							<div className="flex items-center gap-6 sm:gap-8">
								<Suspense fallback={null}>
									<Navbar links={links} />
								</Suspense>
							</div>
							<div className="flex items-center gap-3 sm:gap-5">
								<Suspense>
									<SearchInput />
								</Suspense>
								{AUTH_ENABLED && <AuthButton />}
								<CartButton />
							</div>
						</div>
					</div>

					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="heritage-rule" />
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
			<body className={`${playfair.variable} ${inter.variable} antialiased`}>
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
