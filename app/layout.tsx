import "@/app/globals.css";

import { UserRoundIcon } from "lucide-react";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { Climate_Crisis, Geist_Mono, Instrument_Sans, Instrument_Serif } from "next/font/google";
import { getImageProps } from "next/image";
import Link from "next/link";
import { ThemeProvider } from "next-themes";
import { Suspense } from "react";
import { CartProvider } from "@/app/cart/cart-context";
import { CartSidebar } from "@/app/cart/cart-sidebar";
import { CartButton } from "@/app/cart-button";
import { Footer } from "@/app/footer";
import { AnnouncementBar, DesktopNav, HeaderScrollRule, MobileMenu, type NavData } from "@/app/navbar";
import { CookieConsent } from "@/components/cookie-consent";
import { ErrorOverlayRemover, NavigationReporter } from "@/components/devtools";
import { Wordmark } from "@/components/munch/wordmark";
import { NewsletterDialog } from "@/components/newsletter-dialog";
import { Newsletter } from "@/components/sections/newsletter";
import { StoreChatSection } from "@/components/store-chat/store-chat-section";
import { StoreConfigProvider } from "@/components/store-config-provider";
import { Toaster } from "@/components/ui/sonner";
import {
	getAnnouncement,
	getBrowsableCollections,
	getCollectionTiles,
	getNavCategories,
	getStoreName,
} from "@/lib/catalog";
import { getCanonicalUrl, getStoreFaviconUrl, meGetCached } from "@/lib/commerce";
import { StoreJsonLd } from "@/lib/json-ld";
import { getStoreConfig } from "@/lib/store-config";

const instrumentSans = Instrument_Sans({
	variable: "--font-instrument-sans",
	subsets: ["latin", "latin-ext"],
});

const instrumentSerif = Instrument_Serif({
	variable: "--font-instrument-serif",
	weight: "400",
	subsets: ["latin", "latin-ext"],
});

const climateCrisis = Climate_Crisis({
	variable: "--font-climate-crisis",
	subsets: ["latin", "latin-ext"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
	// Paints only inside chat and code spans, so it loads on use instead of blocking every first paint.
	preload: false,
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

async function getNavData(language: string | null): Promise<NavData & { storeName: string }> {
	"use cache";
	cacheLife("hours");
	const [collections, categories, cards, me, storeName] = await Promise.all([
		getBrowsableCollections(),
		getNavCategories(),
		getCollectionTiles(6),
		meGetCached().catch(() => null),
		getStoreName(),
	]);
	const blogEnabled = me?.store.settings?.enabledTools?.blog ?? false;
	const collectionLinks = collections.map((collection) => ({
		href: `/collection/${collection.slug}`,
		label: collection.name,
	}));
	return {
		storeName,
		links: [
			...collectionLinks.slice(0, 2),
			{ href: "/about", label: "About" },
			...(blogEnabled ? [{ href: "/blog", label: "Blog" }] : []),
		],
		categories,
		collections: collectionLinks,
		cards,
		// Plain <a>: /account is a proxied zone — soft navigation 500s (see AGENTS.md).
		accountHref: language ? `/account?lang=${encodeURIComponent(language)}` : "/account",
	};
}

async function CartProviderWrapper({ children }: { children: React.ReactNode }) {
	// Only cached reads here. Awaiting anything request-time (cookies, headers) would
	// take the header, nav and footer out of the prerendered shell and leave the page
	// blank until the server responds; CartProvider loads the cart in the browser. The
	// other half of the rule: no
	// <Suspense> around this component either — the boundary itself is what streams the
	// chrome out of the shell, whether or not anything inside it is request-time.
	const storeConfig = await getStoreConfig();
	const [nav, announcement] = await Promise.all([getNavData(storeConfig.language), getAnnouncement()]);
	const brand = <Wordmark name={nav.storeName} />;

	return (
		<StoreConfigProvider value={storeConfig}>
			<CartProvider>
				<div className="flex min-h-screen flex-col">
					<header className="site-header sticky top-0 z-50 bg-background">
						{announcement && <AnnouncementBar text={announcement} />}
						<div className="shell relative flex h-[60px] items-center justify-between gap-2xl lg:h-[76px]">
							<div className="flex min-w-0 items-center gap-m self-stretch">
								<div className="flex min-w-0 items-center gap-s">
									<MobileMenu data={nav} brand={brand} />
									<Link href="/" className="min-w-0" aria-label={`${nav.storeName} home`}>
										{brand}
									</Link>
								</div>
								<DesktopNav data={nav} />
							</div>
							<div className="-mr-2 flex shrink-0 items-center gap-1">
								{/* Static on purpose: reading the session here would pull the header out of the
								    prerendered shell. Guests get the sign-in flow, shoppers land on the dashboard. */}
								<a
									href={nav.accountHref}
									className="hidden size-10 items-center justify-center sm:inline-flex"
									aria-label="Account"
								>
									<UserRoundIcon aria-hidden="true" className="size-6" strokeWidth={1.5} />
								</a>
								<CartButton />
							</div>
						</div>
						<HeaderScrollRule />
					</header>
					<main className="flex-1">{children}</main>
					<Newsletter />
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
			<body
				className={`${instrumentSans.variable} ${instrumentSerif.variable} ${climateCrisis.variable} ${geistMono.variable} overflow-x-clip antialiased`}
			>
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
					<Toaster position="top-center" />
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
