import "@/app/globals.css";

import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { IBM_Plex_Mono, Inter_Tight } from "next/font/google";
import { getImageProps } from "next/image";
import { ThemeProvider } from "next-themes";
import { Suspense } from "react";
import { CartProvider } from "@/app/cart/cart-context";
import { Footer } from "@/app/footer";
import { CookieConsent } from "@/components/cookie-consent";
import { ErrorOverlayRemover, NavigationReporter } from "@/components/devtools";
import { NewsletterDialog } from "@/components/newsletter-dialog";
import { StoreChatSection } from "@/components/store-chat/store-chat-section";
import { StoreConfigProvider } from "@/components/store-config-provider";
import { type DockLink, SwagDock } from "@/components/swag/dock";
import { Toaster } from "@/components/ui/sonner";
import { getCanonicalUrl, getStoreFaviconUrl, meGetCached } from "@/lib/commerce";
import { StoreJsonLd } from "@/lib/json-ld";
import { getStoreConfig } from "@/lib/store-config";
import { getCartBuckets, getStoreIdentity } from "@/lib/swag";

// IBM Plex Mono carries every UI label, as in the original. Its display face (Waldenburg) is a
// commercial font; Inter Tight is the closest open grotesk for headlines, prices and "Checkout".
const plexMono = IBM_Plex_Mono({
	variable: "--font-plex-mono",
	subsets: ["latin", "latin-ext"],
	weight: ["400", "500"],
});

const interTight = Inter_Tight({
	variable: "--font-inter-tight",
	subsets: ["latin", "latin-ext"],
});

async function getStoreMetadata(): Promise<Metadata> {
	"use cache";
	cacheLife("hours");
	const me = await meGetCached();
	const storeName = me.store.settings?.storeName || me.store.name || "Your Next Store";
	const storeDescription = me.store.settings?.storeDescription || "Your next e-commerce store";
	const faviconUrl = getStoreFaviconUrl(me.store.settings) ?? "/logo.svg";
	// The platform favicon is whatever was uploaded (here a 500x500 PNG). Route it through
	// the image optimizer so browsers fetch a few KB from this origin, not the blob host.
	const iconUrl = (size: number) =>
		getImageProps({ src: faviconUrl, width: size, height: size, alt: "" }).props.src;
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
		// No `alternates.canonical` here on purpose: Next inherits it into every page that
		// does not set its own, which silently declares each such page a duplicate of the
		// home page. The home page carries its own canonical in app/page.tsx instead.
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
			// No `type`: the URL is whatever the admin uploaded and the optimizer negotiates the
			// format, and declaring image/svg+xml over a PNG makes Chrome drop the icon.
			icon: [{ url: iconUrl(64), sizes: "64x64" }],
			// iOS wants a PNG here (the optimizer negotiates WebP), so the original stays for the home-screen icon.
			apple: [{ url: faviconUrl, sizes: "180x180" }],
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

async function getDockLinks(): Promise<DockLink[]> {
	"use cache";
	cacheLife("hours");
	const identity = await getStoreIdentity();
	return [
		{ href: "/products", label: "Catalogue", short: "Shop" },
		...(identity.blogEnabled ? [{ href: "/blog", label: "Journal", desktopOnly: true }] : []),
		{ href: "/about", label: "About" },
		{ href: "/search", label: "Search", desktopOnly: true },
	];
}

async function CartProviderWrapper({ children }: { children: React.ReactNode }) {
	// Only cached reads here. Awaiting anything request-time (cookies, headers) would
	// take the dock and footer out of the prerendered shell; CartProvider loads the cart in
	// the browser. No <Suspense> around this component either, for the same reason.
	const [links, storeConfig, identity, buckets] = await Promise.all([
		getDockLinks(),
		getStoreConfig(),
		getStoreIdentity(),
		getCartBuckets(),
	]);
	const accountHref = storeConfig.language
		? `/account?lang=${encodeURIComponent(storeConfig.language)}`
		: "/account";

	return (
		<StoreConfigProvider value={storeConfig}>
			<CartProvider>
				<div className="flex flex-wrap">
					<main className="swag-main relative min-h-svh w-full bg-swag-paper">{children}</main>
					<SwagDock
						storeName={identity.name}
						buckets={buckets}
						links={[...links, { href: accountHref, label: "Account", desktopOnly: true, plain: true }]}
					/>
				</div>
				<Footer />
				{/* Inside CartProvider on purpose: add-to-cart from chat uses the cart context.
			    Also renders the "Made with YNS" badge so badge and launcher share one dock. */}
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
	// VERCEL_ENV is unset off Vercel, so fall back to NODE_ENV: a self-hosted production
	// build must not ship the builder devtools.
	const env = process.env.VERCEL_ENV || process.env.NODE_ENV;
	const lang = await getHtmlLang();

	return (
		// suppressHydrationWarning: next-themes sets the theme class on <html> before hydration.
		<html lang={lang} suppressHydrationWarning className={`${plexMono.variable} ${interTight.variable}`}>
			<body className="antialiased">
				{/* DO NOT REMOVE / REORDER: required for GDPR + GTM Consent Mode v2. Must stay at top of <body>. */}
				<Suspense>
					<CookieConsent />
				</Suspense>
				<Suspense>
					<StoreJsonLd />
				</Suspense>
				<ThemeProvider attribute="class" forcedTheme="light" disableTransitionOnChange>
					<CartProviderWrapper>{children}</CartProviderWrapper>
					<Suspense>
						<NewsletterPopupSection />
					</Suspense>
					<Toaster richColors position="top-center" />
				</ThemeProvider>
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
