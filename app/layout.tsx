import "@/app/globals.css";

import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { Geist_Mono, Jost } from "next/font/google";
import { getImageProps } from "next/image";
import Link from "next/link";
import { ThemeProvider } from "next-themes";
import { Suspense } from "react";
import { CartProvider } from "@/app/cart/cart-context";
import { CartSidebar } from "@/app/cart/cart-sidebar";
import { CartButton } from "@/app/cart-button";
import { Footer, getCopyrightYear } from "@/app/footer";
import { HeaderScroll } from "@/app/header-scroll";
import { Navbar, type NavLink, NavLinks } from "@/app/navbar";
import { CookieConsent } from "@/components/cookie-consent";
import { ErrorOverlayRemover, NavigationReporter } from "@/components/devtools";
import { NewsletterDialog } from "@/components/newsletter-dialog";
import { SearchButtonFallback, SearchPanel } from "@/components/search/search-panel";
import { StoreChatSection } from "@/components/store-chat/store-chat-section";
import { StoreConfigProvider } from "@/components/store-config-provider";
import { Toaster } from "@/components/ui/sonner";
import { getNavCategories } from "@/lib/catalog";
import { commerce, getCanonicalUrl, getStoreFaviconUrl, meGetCached } from "@/lib/commerce";
import { StoreJsonLd } from "@/lib/json-ld";
import { formatMoney } from "@/lib/money";
import { getStoreConfig } from "@/lib/store-config";

// The original's single face: Jost carries the wide-tracked uppercase display, the UI and the body.
const jost = Jost({
	variable: "--font-jost",
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

async function getNavData(): Promise<{
	links: NavLink[];
	collections: NavLink[];
	storeName: string;
	contactEnabled: boolean;
	announcement: string;
}> {
	"use cache";
	cacheLife("hours");
	const [categories, collections, me] = await Promise.all([
		getNavCategories().catch(() => []),
		commerce.collectionBrowse({ limit: 6 }).catch(() => ({ data: [] })),
		meGetCached().catch(() => null),
	]);
	const settings = me?.store.settings;
	const storeName = settings?.storeName || me?.store.name || "Store";
	const collectionLinks = collections.data
		.filter((c) => (c.productCollections?.length ?? 0) > 0 || (c.metafieldRules?.length ?? 0) > 0)
		.map((collection) => ({
			href: `/collection/${collection.slug}`,
			label: collection.name,
		}));
	// Data-driven centre nav: the top-level categories (the original's four product types), or the
	// collections when a store has no categories.
	const primary = categories.length > 0 ? categories : collectionLinks;
	const threshold = settings?.freeShippingThreshold;
	const currency = me?.store.currency;
	const announcement =
		threshold && /^\d+$/.test(String(threshold)) && currency
			? `Free shipping on orders over ${formatMoney({
					amount: BigInt(threshold),
					currency,
					locale: me?.store.locale || "en-US",
				})}`
			: "Delivery options and costs shown at checkout";
	return {
		storeName,
		contactEnabled: settings?.enabledTools?.contactForm ?? false,
		links: [
			...primary.slice(0, 4),
			...(settings?.enabledTools?.blog ? [{ href: "/blog", label: "Journal" }] : []),
		],
		collections: collectionLinks,
		announcement,
	};
}

async function CartProviderWrapper({ children }: { children: React.ReactNode }) {
	// Only cached reads here. Awaiting anything request-time (cookies, headers) would
	// take the header, nav and footer out of the prerendered shell and leave the page
	// blank until the server responds; CartProvider loads the cart in the browser. The
	// other half of the rule: no
	// <Suspense> around this component either — the boundary itself is what streams the
	// chrome out of the shell, whether or not anything inside it is request-time.
	const [{ links, collections, storeName, contactEnabled, announcement }, storeConfig, year] =
		await Promise.all([getNavData(), getStoreConfig(), getCopyrightYear()]);
	const accountHref = storeConfig.language
		? `/account?lang=${encodeURIComponent(storeConfig.language)}`
		: "/account";
	const icon = "grid h-10 w-10 place-items-center border border-transparent transition hover:border-current";

	return (
		<StoreConfigProvider value={storeConfig}>
			<CartProvider>
				<div className="flex min-h-screen flex-col">
					{/* The original's white promo strip, minus the "star the repo" link and the promo code. */}
					<p className="bg-white px-4 py-2 text-center text-[13px] font-medium text-[#0a0a0a]">
						{announcement}
						<span aria-hidden className="mx-2 opacity-50">
							·
						</span>
						<Link
							href="/products"
							className="whitespace-nowrap font-semibold underline underline-offset-2 hover:opacity-80"
						>
							Shop all
						</Link>
					</p>
					{/* logo — nav — controls. Transparent over a hero photograph, glass once scrolled. */}
					<header className="site-header sticky top-0 z-40 w-full">
						<HeaderScroll />
						<nav
							aria-label="Main"
							className="mx-auto grid h-[76px] max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-3 sm:px-5 lg:grid-cols-[auto_1fr_auto]"
						>
							<Link href="/" className="flex min-w-0 items-center gap-2.5 lg:justify-self-start">
								<span
									aria-hidden
									className="flex h-8 w-8 shrink-0 items-center justify-center bg-white text-[18px] font-bold text-[#0a0a0a]"
								>
									{storeName.charAt(0).toUpperCase()}
								</span>
								<span className="truncate text-[15px] font-bold uppercase tracking-[0.2em] sm:text-[17px] sm:tracking-[0.32em]">
									{storeName}
								</span>
							</Link>
							<NavLinks links={links} />
							<div className="flex items-center gap-1.5 justify-self-end">
								<Suspense fallback={<SearchButtonFallback />}>
									<SearchPanel />
								</Suspense>
								<CartButton />
								{/* Plain <a>: /account is a proxied zone — soft navigation 500s (see AGENTS.md).
								    Static on purpose: reading the session here would pull the header out of the
								    prerendered shell. Guests get the sign-in flow, shoppers land on the dashboard. */}
								<a href={accountHref} className={`${icon} hidden sm:grid`}>
									<span className="sr-only">Account</span>
									<svg
										aria-hidden
										width="19"
										height="19"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="1.6"
										strokeLinecap="round"
										strokeLinejoin="round"
									>
										<circle cx="12" cy="8" r="4" />
										<path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5" />
									</svg>
								</a>
								<Navbar
									links={links}
									collections={collections}
									storeName={storeName}
									accountHref={accountHref}
									contactEnabled={contactEnabled}
									year={year}
								/>
							</div>
						</nav>
					</header>
					<main className="site-main flex-1">{children}</main>
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
			<body className={`${jost.variable} ${geistMono.variable} antialiased`}>
				{/* DO NOT REMOVE / REORDER: required for GDPR + GTM Consent Mode v2. Must stay at top of <body>. */}
				<Suspense>
					<CookieConsent />
				</Suspense>
				<Suspense>
					<StoreJsonLd />
				</Suspense>
				{/* Dark only: content pages and the cart card turn white through the local .light-section remap. */}
				<ThemeProvider attribute="class" forcedTheme="dark" enableSystem={false} disableTransitionOnChange>
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
