import "@/app/globals.css";

import { Search, UserRound } from "lucide-react";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { Figtree, Geist_Mono } from "next/font/google";
import { getImageProps } from "next/image";
import Link from "next/link";
import { ThemeProvider } from "next-themes";
import { Suspense } from "react";
import { CartProvider } from "@/app/cart/cart-context";
import { CartSidebar } from "@/app/cart/cart-sidebar";
import { CartButton } from "@/app/cart-button";
import { Footer } from "@/app/footer";
import { Navbar, type NavLink } from "@/app/navbar";
import { CookieConsent } from "@/components/cookie-consent";
import { ErrorOverlayRemover, NavigationReporter } from "@/components/devtools";
import { NewsletterDialog } from "@/components/newsletter-dialog";
import { SearchInput } from "@/components/search/search-input";
import { StoreChatSection } from "@/components/store-chat/store-chat-section";
import { StoreConfigProvider } from "@/components/store-config-provider";
import { Toaster } from "@/components/ui/sonner";
import { Wordmark } from "@/components/wordmark";
import { commerce, getCanonicalUrl, getStoreFaviconUrl, meGetCached } from "@/lib/commerce";
import { PAGE } from "@/lib/display";
import { StoreJsonLd } from "@/lib/json-ld";
import { getStoreConfig } from "@/lib/store-config";

// Stand-in for the original's Eina 01 (a commercial face): a geometric grotesk with the same light/semibold range.
const figtree = Figtree({
	variable: "--font-figtree",
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

// The original's nav: Home, the first few shelves, then "All". Shelves here are the store's
// collections and categories, capped so the row still fits beside the logo at 1440px.
const MAX_SHELVES = 7;

async function getNavLinks(): Promise<NavLink[]> {
	"use cache";
	cacheLife("hours");
	const [collections, categories, me] = await Promise.all([
		commerce.collectionBrowse({ limit: 5 }).catch(() => ({ data: [] })),
		commerce.categoriesBrowse({ limit: 10 }).catch(() => ({ data: [] })),
		meGetCached().catch(() => null),
	]);
	const blogEnabled = me?.store.settings?.enabledTools?.blog ?? false;
	const shelves = [
		// A manual collection with no members (or a smart one with no rules) would open on an empty grid.
		...collections.data
			.filter((c) => (c.productCollections?.length ?? 0) > 0 || (c.metafieldRules?.length ?? 0) > 0)
			.map((collection) => ({
				href: `/collection/${collection.slug}`,
				label: collection.name,
			})),
		...categories.data
			.filter((category) => category.active !== false && !category.parentId)
			.map((category) => ({ href: `/category/${category.slug}`, label: category.name })),
	].slice(0, MAX_SHELVES);
	return [
		{ href: "/", label: "Home" },
		...shelves,
		...(blogEnabled ? [{ href: "/blog", label: "Blog" }] : []),
		{ href: "/products", label: "All" },
	];
}

async function getStoreName() {
	"use cache";
	cacheLife("hours");
	const me = await meGetCached().catch(() => null);
	return me?.store.settings?.storeName || me?.store.name || "Your Next Store";
}

async function CartProviderWrapper({ children }: { children: React.ReactNode }) {
	// Only cached reads here. Awaiting anything request-time (cookies, headers) would
	// take the header, nav and footer out of the prerendered shell and leave the page
	// blank until the server responds; CartProvider loads the cart in the browser. The
	// other half of the rule: no
	// <Suspense> around this component either — the boundary itself is what streams the
	// chrome out of the shell, whether or not anything inside it is request-time.
	const [links, storeConfig, storeName] = await Promise.all([
		getNavLinks(),
		getStoreConfig(),
		getStoreName(),
	]);

	return (
		<StoreConfigProvider value={storeConfig}>
			<CartProvider>
				<div className="flex min-h-screen flex-col">
					<header className="site-header">
						<div className={`${PAGE} flex items-start gap-x-16 pt-8 pb-6 sm:pt-12`}>
							<div className="flex min-w-0 flex-1 flex-col gap-5 lg:flex-row lg:items-center lg:gap-16">
								<div className="flex items-center justify-between gap-4">
									<Link href="/" aria-label={`${storeName}, home`} className="min-w-0">
										<Wordmark name={storeName} className="max-w-[60vw] lg:max-w-[16rem]" />
									</Link>
									<div className="-mr-2 flex items-center lg:hidden">
										<Link
											href="/search"
											aria-label="Search"
											className="flex h-10 w-10 items-center justify-center transition-opacity hover:opacity-70"
										>
											<Search aria-hidden className="h-5 w-5" strokeWidth={1.75} />
										</Link>
										<AccountLink language={storeConfig.language} />
										<CartButton />
									</div>
								</div>
								<Navbar links={links} />
							</div>
							<div className="hidden shrink-0 items-center gap-1 lg:flex">
								{/* Same box as the streamed search, so the nav never re-wraps when it lands. */}
								<Suspense fallback={<div aria-hidden className="h-10 w-10 xl:w-44" />}>
									<SearchInput />
								</Suspense>
								<AccountLink language={storeConfig.language} />
								<CartButton />
							</div>
						</div>
					</header>
					<main className="flex-1 pb-10">{children}</main>
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

// Plain <a>: /account is a proxied zone — soft navigation 500s (see AGENTS.md). Static on purpose:
// reading the session here would pull the header out of the prerendered shell.
function AccountLink({ language }: { language: string | null }) {
	return (
		<a
			href={language ? `/account?lang=${encodeURIComponent(language)}` : "/account"}
			className="flex h-10 w-10 items-center justify-center transition-opacity hover:opacity-70"
			aria-label="Account"
		>
			<UserRound aria-hidden className="h-5 w-5" strokeWidth={1.75} />
		</a>
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
			<body className={`${figtree.variable} ${geistMono.variable} antialiased`}>
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
