import "@/app/globals.css";

import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { Geist_Mono, Six_Caps } from "next/font/google";
import { getImageProps } from "next/image";
import { ThemeProvider } from "next-themes";
import { Suspense } from "react";
import { CartProvider } from "@/app/cart/cart-context";
import { CartSidebar } from "@/app/cart/cart-sidebar";
import { Footer } from "@/app/footer";
import type { NavData } from "@/app/navbar";
import { SiteHeader } from "@/app/site-header";
import { CookieConsent } from "@/components/cookie-consent";
import { ErrorOverlayRemover, NavigationReporter } from "@/components/devtools";
import { NewsletterDialog } from "@/components/newsletter-dialog";
import { StoreChatSection } from "@/components/store-chat/store-chat-section";
import { StoreConfigProvider } from "@/components/store-config-provider";
import { Toaster } from "@/components/ui/sonner";
import { photographedFirst } from "@/lib/catalog";
import { commerce, getCanonicalUrl, getStoreFaviconUrl, meGetCached } from "@/lib/commerce";
import { StoreJsonLd } from "@/lib/json-ld";
import { getStoreConfig } from "@/lib/store-config";

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
	// Paints only inside chat and code spans, so it loads on use instead of blocking every first paint.
	preload: false,
});

// The wordmark: a tall, narrow display face standing in for the original's drawn logo.
const sixCaps = Six_Caps({
	variable: "--font-six-caps",
	subsets: ["latin"],
	weight: "400",
});

async function getStoreMetadata(): Promise<Metadata> {
	"use cache";
	cacheLife("hours");
	const me = await meGetCached();
	const storeName = me.store.name || "Your Next Store";
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

async function getNavData(): Promise<NavData> {
	"use cache";
	cacheLife("hours");
	const [collections, featured, legal, me] = await Promise.all([
		commerce.collectionBrowse({ limit: 8 }),
		commerce.productBrowse({ active: true, limit: 24 }).catch(() => ({ data: [] })),
		commerce.legalPageBrowse().catch(() => ({ data: [] })),
		meGetCached().catch(() => null),
	]);
	const settings = me?.store.settings;
	const blogEnabled = settings?.enabledTools?.blog ?? false;
	const contactEnabled = settings?.enabledTools?.contactForm ?? false;
	const threshold = settings?.freeShippingThreshold ? Number(settings.freeShippingThreshold) : 0;
	const { currency, locale } = await getStoreConfig();
	const promo =
		threshold > 0
			? `Free shipping on orders over ${new Intl.NumberFormat(locale, { style: "currency", currency, maximumFractionDigits: threshold % 100 === 0 ? 0 : 2 }).format(threshold / 100)}`
			: null;
	return {
		storeName: me?.store.name || "Your Next Store",
		promo,
		shop: [
			{ href: "/products", label: "Everything" },
			...collections.data
				.filter((collection) => collection.productCollections.length > 0)
				.map((collection) => ({
					href: `/collection/${collection.slug}`,
					label: collection.name,
				})),
		],
		info: [
			{ href: "/about", label: "Our Story" },
			{ href: "/faq", label: "FAQ" },
			...(contactEnabled ? [{ href: "/contact", label: "Contact" }] : []),
			...(blogEnabled ? [{ href: "/blog", label: "Journal" }] : []),
		],
		legal: legal.data.map((page) => ({ href: `/legal${page.href}`, label: page.label })),
		featured: photographedFirst(featured.data)
			.slice(0, 2)
			.map((product) => ({
				href: `/product/${product.slug}`,
				label: product.name,
				image: product.images[0] ?? null,
			})),
	};
}

async function CartProviderWrapper({ children }: { children: React.ReactNode }) {
	// Only cached reads here. Awaiting anything request-time (cookies, headers) would
	// take the header, nav and footer out of the prerendered shell and leave the page
	// blank until the server responds; CartProvider loads the cart in the browser. The
	// other half of the rule: no
	// <Suspense> around this component either — the boundary itself is what streams the
	// chrome out of the shell, whether or not anything inside it is request-time.
	const [nav, storeConfig] = await Promise.all([getNavData(), getStoreConfig()]);
	const accountHref = storeConfig.language
		? `/account?lang=${encodeURIComponent(storeConfig.language)}`
		: "/account";

	return (
		<StoreConfigProvider value={storeConfig}>
			<CartProvider>
				<div className="flex min-h-screen flex-col">
					<a
						href="#content"
						className="fixed top-0 left-1/2 z-[70] -translate-x-1/2 -translate-y-full bg-background px-2 py-1 text-micro font-semibold uppercase focus:translate-y-0"
					>
						Skip to content
					</a>
					{nav.promo && (
						<div className="overflow-x-auto whitespace-nowrap bg-foreground text-center text-background hide-scrollbar">
							<p className="px-7 py-[11px] text-nav leading-none font-semibold">{nav.promo}</p>
						</div>
					)}
					{/* Static on purpose: /account is a plain <a> into a proxied zone, and reading the
					    session here would pull the header out of the prerendered shell. */}
					<SiteHeader nav={nav} accountHref={accountHref} />
					<main id="content" className="flex-1">
						{children}
					</main>
					<Footer />
				</div>
				<CartSidebar />
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
		<html lang={lang} suppressHydrationWarning>
			<body className={`${geistMono.variable} ${sixCaps.variable} antialiased`}>
				{/* DO NOT REMOVE / REORDER: required for GDPR + GTM Consent Mode v2. Must stay at top of <body>. */}
				<Suspense>
					<CookieConsent />
				</Suspense>
				<Suspense>
					<StoreJsonLd />
				</Suspense>
				<ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
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
