import "@/app/globals.css";

import { UserRoundIcon } from "lucide-react";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { Geist_Mono, Space_Grotesk } from "next/font/google";
import { getImageProps } from "next/image";
import Link from "next/link";
import { ThemeProvider } from "next-themes";
import { Suspense } from "react";
import { CartProvider } from "@/app/cart/cart-context";
import { CartSidebar } from "@/app/cart/cart-sidebar";
import { CartButton } from "@/app/cart-button";
import { Footer } from "@/app/footer";
import { DesktopNav, MobileMenu, type NavLink } from "@/app/navbar";
import { CookieConsent } from "@/components/cookie-consent";
import { ErrorOverlayRemover, NavigationReporter } from "@/components/devtools";
import { NewsletterDialog } from "@/components/newsletter-dialog";
import { SearchInput } from "@/components/search/search-input";
import { StoreChatSection } from "@/components/store-chat/store-chat-section";
import { StoreConfigProvider } from "@/components/store-config-provider";
import { Toaster } from "@/components/ui/sonner";
import { commerce, getCanonicalUrl, getStoreFaviconUrl, meGetCached } from "@/lib/commerce";
import { StoreJsonLd } from "@/lib/json-ld";
import { getStoreConfig } from "@/lib/store-config";
import { isOptimizableImage } from "@/lib/utils";

// The original's single face: Space Grotesk for everything, from body copy to the fitted hero word.
const spaceGrotesk = Space_Grotesk({
	variable: "--font-space-grotesk",
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
		isOptimizableImage(faviconUrl)
			? getImageProps({ src: faviconUrl, width: size, height: size, alt: "" }).props.src
			: faviconUrl;
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

async function getHeaderData(): Promise<{ storeName: string; links: NavLink[] }> {
	"use cache";
	cacheLife("hours");
	const [collections, categories, me] = await Promise.all([
		commerce.collectionBrowse({ limit: 8 }).catch(() => ({ data: [] })),
		commerce.categoriesBrowse({ active: true, limit: 50 }).catch(() => ({ data: [] })),
		meGetCached().catch(() => null),
	]);
	const blogEnabled = me?.store.settings?.enabledTools?.blog ?? false;
	const topCategories = categories.data.filter((category) => !category.parentId);
	return {
		storeName: me?.store.settings?.storeName || me?.store.name || "Your Next Store",
		links: [
			{ href: "/products", label: "Shop", primary: true },
			...collections.data
				.filter((collection) => collection.active)
				.slice(0, 4)
				.map((collection) => ({ href: `/collection/${collection.slug}`, label: collection.name })),
			...topCategories
				.slice(0, 8)
				.map((category) => ({ href: `/category/${category.slug}`, label: category.name })),
			...(blogEnabled ? [{ href: "/blog", label: "Journal", primary: true }] : []),
			{ href: "/about", label: "About", primary: true },
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

	return (
		<StoreConfigProvider value={storeConfig}>
			<CartProvider>
				<div className="relative flex min-h-screen flex-col">
					{/* Not sticky, as in the original: it scrolls away with the page. Over the home hero
					    it turns transparent and white (globals.css, `:has([data-hero])`). */}
					<header className="site-header z-40 border-b border-border bg-background text-foreground">
						<div className="flex h-[60px] items-center justify-between gap-4 px-4 md:px-12">
							<Link
								href="/"
								className="min-w-0 truncate text-[1.375rem] font-light leading-none tracking-[-0.02em]"
							>
								{storeName}
							</Link>
							<div className="flex shrink-0 items-center gap-1 lg:gap-2">
								<DesktopNav links={links} />
								<Suspense>
									<SearchInput />
								</Suspense>
								{/* Plain <a>: /account is a proxied zone — soft navigation 500s (see AGENTS.md).
								    Static on purpose: reading the session here would pull the header out of the
								    prerendered shell. Guests get the sign-in flow, shoppers land on the dashboard. */}
								<a
									href={
										storeConfig.language
											? `/account?lang=${encodeURIComponent(storeConfig.language)}`
											: "/account"
									}
									className="inline-flex size-10 items-center justify-center rounded-md transition-colors hover:bg-current/10"
									aria-label="Account"
								>
									<UserRoundIcon className="h-5 w-5" strokeWidth={1.75} />
								</a>
								<CartButton />
								<MobileMenu links={links} storeName={storeName} />
							</div>
						</div>
					</header>
					<main className="flex flex-1 flex-col pb-8 lg:pb-12">{children}</main>
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
			<body className={`${spaceGrotesk.variable} ${geistMono.variable} antialiased`}>
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
