import "@/app/globals.css";

import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { Inter, Playfair_Display, Sora } from "next/font/google";
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

const body = Inter({
	variable: "--font-sans",
	subsets: ["latin"],
});

const display = Sora({
	variable: "--font-display",
	subsets: ["latin"],
	weight: ["700", "800"],
});

const italic = Playfair_Display({
	variable: "--font-italic",
	subsets: ["latin"],
	style: ["italic"],
	weight: ["500", "600"],
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
	const items = [
		"Free shipping on orders over $40",
		"New flavor drop — Smoky Sesame is live",
		"12g protein • 0g added sugar • All plants",
		"Enter the giveaway — win a year of snacks",
	];
	const stream = [...items, ...items, ...items, ...items];
	return (
		<div className="border-b border-charcoal/15 bg-chili text-cream text-xs tracking-[0.18em] uppercase font-medium">
			<div className="flex overflow-hidden py-2.5">
				<div className="yns-marquee flex shrink-0 gap-12 whitespace-nowrap pr-12">
					{stream.map((item, i) => (
						<span key={`a-${i}`} className="inline-flex items-center gap-12">
							<span>{item}</span>
							<span aria-hidden className="text-cream/60">
								✦
							</span>
						</span>
					))}
				</div>
				<div className="yns-marquee flex shrink-0 gap-12 whitespace-nowrap pr-12" aria-hidden>
					{stream.map((item, i) => (
						<span key={`b-${i}`} className="inline-flex items-center gap-12">
							<span>{item}</span>
							<span className="text-cream/60">✦</span>
						</span>
					))}
				</div>
			</div>
		</div>
	);
}

function GiveawayTab() {
	return (
		<a
			href="#newsletter"
			className="fixed left-0 top-1/2 z-40 hidden -translate-y-1/2 items-center justify-center bg-chili px-2 py-6 text-cream shadow-[0_8px_24px_rgba(58,26,18,0.25)] transition-transform hover:translate-x-1 sm:flex"
		>
			<span className="giveaway-tab text-[11px] font-bold uppercase tracking-[0.28em]">
				Enter the Giveaway →
			</span>
		</a>
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
			<div className="flex min-h-screen flex-col bg-cream">
				<AnnouncementBar />
				<header className="sticky top-0 z-40 border-b border-charcoal/10 bg-cream/90 backdrop-blur-md">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="grid grid-cols-[1fr_auto_1fr] items-center h-16 sm:h-20 gap-4">
							<div className="flex items-center">
								<YnsLink
									prefetch={"eager"}
									href="/"
									className="font-display text-2xl sm:text-3xl font-extrabold text-chili tracking-tight"
								>
									YOUR NEXT STORE
								</YnsLink>
							</div>
							<div className="hidden md:flex justify-center">
								<Navbar links={links} />
							</div>
							<div className="flex items-center justify-end gap-1 sm:gap-2">
								<Suspense>
									<SearchInput />
								</Suspense>
								{AUTH_ENABLED && <AuthButton />}
								<div className="hidden sm:flex items-center gap-1 text-xs font-medium text-mahogany/80 px-3 py-1.5 rounded-full border border-charcoal/10">
									<span aria-hidden>🇨🇦</span>
									<span>USD&nbsp;$</span>
								</div>
								<CartButton />
							</div>
						</div>
						<div className="md:hidden pb-2">
							<Navbar links={links} />
						</div>
					</div>
				</header>
				<GiveawayTab />
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
			<body
				className={`${body.variable} ${display.variable} ${italic.variable} font-sans antialiased bg-cream text-charcoal`}
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
