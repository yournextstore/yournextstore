import "@/app/globals.css";

import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { Bodoni_Moda, Geist_Mono, Hanken_Grotesk, Prata } from "next/font/google";
import { getImageProps } from "next/image";
import Link from "next/link";
import { ThemeProvider } from "next-themes";
import { Suspense } from "react";
import { CartProvider } from "@/app/cart/cart-context";
import { CartSidebar } from "@/app/cart/cart-sidebar";
import { CartButton } from "@/app/cart-button";
import { Footer } from "@/app/footer";
import { HeaderScroll } from "@/app/header-scroll";
import { DesktopNav, MobileMenu, NavActive, type NavLink } from "@/app/navbar";
import { LogoLockup } from "@/components/brand/logo";
import { CookieConsent } from "@/components/cookie-consent";
import { ErrorOverlayRemover, NavigationReporter } from "@/components/devtools";
import { UserIcon } from "@/components/icons";
import { NewsletterDialog } from "@/components/newsletter-dialog";
import { SearchInput } from "@/components/search/search-input";
import { StoreChatSection } from "@/components/store-chat/store-chat-section";
import { StoreConfigProvider } from "@/components/store-config-provider";
import { Toaster } from "@/components/ui/sonner";
import { commerce, getCanonicalUrl, getStoreFaviconUrl, meGetCached } from "@/lib/commerce";
import { StoreJsonLd } from "@/lib/json-ld";
import { getStoreConfig } from "@/lib/store-config";

// The original's three faces: Prata for display, Bodoni Moda italic for the gold accent phrase,
// Hanken Grotesk for everything else.
const prata = Prata({ variable: "--font-prata", subsets: ["latin"], weight: "400" });
const bodoni = Bodoni_Moda({ variable: "--font-bodoni", subsets: ["latin"], style: "italic" });
const hanken = Hanken_Grotesk({ variable: "--font-hanken", subsets: ["latin"] });

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

// The original's menu (Home, Shop, Collections, About, …) filled from the catalog: the Shop
// dropdown lists the categories with their family dots, Collections lists the collections.
async function getHeaderData(): Promise<{ storeName: string; links: NavLink[] }> {
	"use cache";
	cacheLife("hours");
	const [categories, collections, me] = await Promise.all([
		commerce.categoriesBrowse({ active: true, limit: 20 }).catch(() => ({ data: [] })),
		commerce.collectionBrowse({ limit: 8 }).catch(() => ({ data: [] })),
		meGetCached().catch(() => null),
	]);
	const tools = me?.store.settings?.enabledTools;
	const topCategories = categories.data.filter((category) => !category.parentId).slice(0, 6);
	return {
		storeName: me?.store.name || "Your Next Store",
		links: [
			{ href: "/", label: "Home" },
			{
				href: "/products",
				label: "Shop",
				children: [
					{ href: "/products", label: "Everything" },
					...topCategories.map((category, index) => ({
						href: `/category/${category.slug}`,
						label: category.name,
						tone: index,
					})),
				],
			},
			...(collections.data.length > 0
				? [
						{
							href: `/collection/${collections.data[0]?.slug}`,
							label: "Collections",
							children: collections.data.map((collection) => ({
								href: `/collection/${collection.slug}`,
								label: collection.name,
							})),
						},
					]
				: []),
			{ href: "/about", label: "About" },
			...(tools?.blog ? [{ href: "/blog", label: "Journal" }] : []),
			...(tools?.contactForm ? [{ href: "/contact", label: "Contact" }] : []),
		],
	};
}

async function CartProviderWrapper({ children }: { children: React.ReactNode }) {
	// Only cached reads here. Awaiting anything request-time (cookies, headers) would
	// take the header, nav and footer out of the prerendered shell and leave the page
	// blank until the server responds; CartProvider loads the cart in the browser. The
	// other half of the rule: no
	// <Suspense> around this component either — the boundary itself is what streams the
	// chrome out of the shell, whether or not anything inside it is request-time.
	const [{ storeName, links }, storeConfig] = await Promise.all([getHeaderData(), getStoreConfig()]);
	const accountHref = storeConfig.language
		? `/account?lang=${encodeURIComponent(storeConfig.language)}`
		: "/account";

	return (
		<StoreConfigProvider value={storeConfig}>
			<CartProvider>
				<div className="flex min-h-screen flex-col">
					<header id="site-header" className="site-header" data-sticky="false">
						<div className="container-page relative flex h-full items-center justify-between gap-4 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:gap-6">
							<Link href="/" className="justify-self-start">
								<LogoLockup name={storeName} />
							</Link>
							<DesktopNav links={links} />
							<Suspense>
								<NavActive />
							</Suspense>
							<div className="flex items-center gap-0.5 justify-self-end">
								<Suspense>
									<SearchInput />
								</Suspense>
								{/* Plain <a>: /account is a proxied zone — soft navigation 500s (see AGENTS.md).
								    Static on purpose: reading the session here would pull the header out of the
								    prerendered shell. Guests get the sign-in flow, shoppers land on the dashboard. */}
								<a
									href={accountHref}
									aria-label="Account"
									className="inline-flex size-11 items-center justify-center rounded-md text-ink/85 transition-colors hover:text-gold"
								>
									<UserIcon />
								</a>
								<CartButton />
								<MobileMenu links={links} />
							</div>
						</div>
					</header>
					<HeaderScroll />
					<main id="main" className="site-main flex-1">
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
			<body
				className={`${prata.variable} ${bodoni.variable} ${hanken.variable} ${geistMono.variable} font-sans antialiased`}
			>
				{/* DO NOT REMOVE / REORDER: required for GDPR + GTM Consent Mode v2. Must stay at top of <body>. */}
				<Suspense>
					<CookieConsent />
				</Suspense>
				<Suspense>
					<StoreJsonLd />
				</Suspense>
				{/* Dark only, like the original: the forced theme keeps the toaster and chat on the espresso palette. */}
				<ThemeProvider attribute="class" forcedTheme="dark" disableTransitionOnChange>
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
