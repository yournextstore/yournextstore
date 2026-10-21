import "@/app/globals.css";

import { CircleUserRound, Search } from "lucide-react";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { Archivo, Figtree, Geist_Mono } from "next/font/google";
import { getImageProps } from "next/image";
import Link from "next/link";
import { ThemeProvider } from "next-themes";
import { Suspense } from "react";
import { CartProvider } from "@/app/cart/cart-context";
import { CartSidebar } from "@/app/cart/cart-sidebar";
import { CartButton } from "@/app/cart-button";
import { Footer } from "@/app/footer";
import { DesktopNav, Navbar, type NavLink } from "@/app/navbar";
import { TopBanner } from "@/app/top-banner";
import { CookieConsent } from "@/components/cookie-consent";
import { ErrorOverlayRemover, NavigationReporter } from "@/components/devtools";
import { NewsletterDialog } from "@/components/newsletter-dialog";
import { SearchInput } from "@/components/search/search-input";
import { StoreChatSection } from "@/components/store-chat/store-chat-section";
import { StoreConfigProvider } from "@/components/store-config-provider";
import { Toaster } from "@/components/ui/sonner";
import { getCatalogCategories, getStoreIdentity } from "@/lib/catalog";
import { commerce, getCanonicalUrl, getStoreFaviconUrl, meGetCached } from "@/lib/commerce";
import { StoreJsonLd } from "@/lib/json-ld";
import { getStoreConfig } from "@/lib/store-config";

// Satoshi (the original's body face, ITF licence) → Figtree, a close geometric grotesk on Google Fonts.
const figtree = Figtree({
	variable: "--font-figtree",
	subsets: ["latin", "latin-ext"],
});

// Integral CF (commercial) → Archivo at its widest, heaviest setting: the same squat, wide capitals.
const archivo = Archivo({
	variable: "--font-archivo",
	subsets: ["latin", "latin-ext"],
	axes: ["wdth"],
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

async function getHeaderData() {
	"use cache";
	cacheLife("hours");
	const [collections, identity, categories] = await Promise.all([
		commerce.collectionBrowse({ limit: 5 }).catch(() => ({ data: [] })),
		getStoreIdentity(),
		getCatalogCategories(),
	]);
	// The original's short row: a Shop menu of categories, then a few plain links.
	const links: NavLink[] = [
		{ href: "/products", label: "New Arrivals" },
		...collections.data
			.filter((collection) => collection.active)
			.slice(0, 2)
			.map((collection) => ({ href: `/collection/${collection.slug}`, label: collection.name })),
		...(identity.blogEnabled ? [{ href: "/blog", label: "Blog" }] : []),
		{ href: "/about", label: "About" },
	];
	return {
		storeName: identity.storeName,
		links,
		categories: categories.slice(0, 6).map((category) => ({
			href: `/category/${category.slug}`,
			label: category.name,
			description:
				category.description ?? `${category.count} ${category.count === 1 ? "product" : "products"}`,
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
	const [{ links, categories, storeName }, storeConfig] = await Promise.all([
		getHeaderData(),
		getStoreConfig(),
	]);
	// Plain <a>: /account is a proxied zone — soft navigation 500s (see AGENTS.md). Static on
	// purpose: reading the session here would pull the header out of the prerendered shell.
	const accountHref = storeConfig.language
		? `/account?lang=${encodeURIComponent(storeConfig.language)}`
		: "/account";

	return (
		<StoreConfigProvider value={storeConfig}>
			<CartProvider>
				<div className="flex min-h-screen flex-col">
					<TopBanner accountHref={accountHref} />
					<header className="sticky top-0 z-50 bg-background">
						<div className="frame relative flex items-center gap-x-4 py-5 md:py-6 lg:gap-x-10">
							<div className="flex min-w-0 items-center gap-x-4">
								<Navbar links={links} categories={categories} storeName={storeName} />
								<Link
									href="/"
									className="font-display min-w-0 truncate text-[1.25rem] leading-none xs:text-display-xs lg:text-display-sm"
								>
									{storeName}
								</Link>
							</div>
							<DesktopNav links={links} categories={categories} />
							{/* Same-size fallback: the bar must not push the icons sideways when it streams in. */}
							<Suspense fallback={<div className="hidden h-12 flex-1 rounded-full bg-pill xl:block" />}>
								<SearchInput />
							</Suspense>
							<div className="ml-auto flex shrink-0 items-center gap-x-2.5 xl:ml-0">
								<Link href="/search" aria-label="Search" className="p-1 xl:hidden">
									<Search className="size-[22px]" strokeWidth={2} />
								</Link>
								<CartButton />
								<a href={accountHref} className="p-1" aria-label="Account">
									<CircleUserRound className="size-[22px]" strokeWidth={2} />
								</a>
							</div>
						</div>
					</header>
					<main className="flex-1">{children}</main>
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
			<body className={`${figtree.variable} ${archivo.variable} ${geistMono.variable} font-sans antialiased`}>
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
