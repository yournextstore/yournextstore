import "@/app/globals.css";

import { ArrowUpRight, UserRound } from "lucide-react";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { Geist, Geist_Mono, Gelasio } from "next/font/google";
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
import { SearchDialog } from "@/components/search/search-dialog";
import { StoreChatSection } from "@/components/store-chat/store-chat-section";
import { StoreConfigProvider } from "@/components/store-config-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { Toaster } from "@/components/ui/sonner";
import { getShopCategories, getShopCollections } from "@/lib/catalog";
import { getCanonicalUrl, getStoreFaviconUrl, meGetCached } from "@/lib/commerce";
import { StoreJsonLd } from "@/lib/json-ld";
import { getStoreConfig } from "@/lib/store-config";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin", "latin-ext"],
});

// Georgia-metric serif: the original sets its display type in Georgia, which Android and
// Linux lack. Gelasio keeps those proportions on every platform.
const gelasio = Gelasio({
	variable: "--font-gelasio",
	subsets: ["latin", "latin-ext"],
	style: ["normal", "italic"],
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

async function getNavLinks(): Promise<NavLink[]> {
	"use cache";
	cacheLife("hours");
	const [collections, categories, me] = await Promise.all([
		getShopCollections(),
		getShopCategories(),
		meGetCached().catch(() => null),
	]);
	const blogEnabled = me?.store.settings?.enabledTools?.blog ?? false;
	const collectionLinks = collections.slice(0, 2).map((collection) => ({
		href: `/collection/${collection.slug}`,
		label: collection.name,
	}));
	// Three to four short links, as on the original: collections first, categories fill in.
	const featured = [
		...collectionLinks,
		...categories.map((category) => ({ href: `/category/${category.slug}`, label: category.name })),
	].slice(0, 2);
	return [
		{ href: "/products", label: "The collection" },
		...featured,
		...(blogEnabled ? [{ href: "/blog", label: "Journal" }] : []),
		{ href: "/about", label: "Our story" },
	];
}

async function getHeaderData() {
	"use cache";
	cacheLife("hours");
	const [categories, me] = await Promise.all([getShopCategories(), meGetCached().catch(() => null)]);
	return {
		storeName: me?.store.name || "Your Next Store",
		categories: categories.map((category) => ({ href: `/category/${category.slug}`, label: category.name })),
	};
}

async function CartProviderWrapper({ children }: { children: React.ReactNode }) {
	// Only cached reads here. Awaiting anything request-time (cookies, headers) would
	// take the header, nav and footer out of the prerendered shell and leave the page
	// blank until the server responds; CartProvider loads the cart in the browser. The
	// other half of the rule: no
	// <Suspense> around this component either — the boundary itself is what streams the
	// chrome out of the shell, whether or not anything inside it is request-time.
	const [links, storeConfig, header] = await Promise.all([getNavLinks(), getStoreConfig(), getHeaderData()]);
	// Plain <a>: /account is a proxied zone — soft navigation 500s (see AGENTS.md).
	const accountHref = storeConfig.language
		? `/account?lang=${encodeURIComponent(storeConfig.language)}`
		: "/account";
	const chips = header.categories.slice(0, 5);

	return (
		<StoreConfigProvider value={storeConfig}>
			<CartProvider>
				<div className="flex min-h-screen flex-col">
					<a
						href="#main-content"
						className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-background focus:px-5 focus:py-3 focus:shadow-lg"
					>
						Skip to content
					</a>
					<div className="bg-band px-4 py-2.5 text-center text-[10px] tracking-[0.08em] text-band-foreground sm:text-[11px]">
						<Link
							href="/products"
							className="inline-flex items-center justify-center gap-2 underline-offset-4 hover:underline"
						>
							Small things, chosen well.
							<span className="hidden sm:inline">Explore the collection.</span>
							<ArrowUpRight size={12} aria-hidden="true" />
						</Link>
					</div>
					<header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur-md">
						<div className="frame relative flex h-[72px] items-center justify-between gap-4 sm:h-20">
							<Link
								href="/"
								className="min-w-0 truncate text-[17px] font-medium tracking-[0.14em] uppercase sm:text-[22px] sm:tracking-[0.16em] xl:text-[26px]"
							>
								{header.storeName}
							</Link>
							<div className="flex shrink-0 items-center gap-1 sm:gap-2.5">
								<ThemeToggle className="hidden sm:flex" />
								<SearchDialog chips={chips} />
								<CartButton />
								<a
									href={accountHref}
									className="hidden h-9 w-9 items-center justify-center text-foreground transition-colors hover:text-muted-foreground sm:flex"
									aria-label="Account"
								>
									<UserRound className="h-[18px] w-[18px]" strokeWidth={1.5} aria-hidden="true" />
								</a>
								<Navbar
									links={links}
									categories={header.categories}
									storeName={header.storeName}
									accountHref={accountHref}
								/>
							</div>
						</div>
					</header>
					<main id="main-content" className="flex-1">
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
			<body className={`${geistSans.variable} ${geistMono.variable} ${gelasio.variable} antialiased`}>
				{/* DO NOT REMOVE / REORDER: required for GDPR + GTM Consent Mode v2. Must stay at top of <body>. */}
				<Suspense>
					<CookieConsent />
				</Suspense>
				<Suspense>
					<StoreJsonLd />
				</Suspense>
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
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
