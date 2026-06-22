import "@/app/globals.css";

import { Heart, Menu, ShoppingBag, UserRound } from "lucide-react";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { DM_Sans, Inter } from "next/font/google";
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
import { ThemeToggle } from "@/components/theme-toggle";
import { Toaster } from "@/components/ui/sonner";
import { commerce, getCanonicalUrl, getStoreFaviconUrl, meGetCached } from "@/lib/commerce";
import { StoreJsonLd } from "@/lib/json-ld";
import { getStoreConfig } from "@/lib/store-config";

const inter = Inter({
	variable: "--font-inter",
	subsets: ["latin"],
	display: "swap",
});

const dmSans = DM_Sans({
	variable: "--font-cabinet",
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
	display: "swap",
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
	const [collections, me] = await Promise.all([
		commerce.collectionBrowse({ active: true, limit: 5 }),
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
	// Only cached reads here. Awaiting anything request-time (cookies, headers) would
	// take the header, nav and footer out of the prerendered shell and leave the page
	// blank until the server responds; CartProvider loads the cart in the browser. No
	// <Suspense> around this component either: the boundary itself is what streams the
	// chrome out of the shell, whether or not anything inside it is request-time.
	const [links, storeConfig] = await Promise.all([getNavLinks(), getStoreConfig()]);

	return (
		<StoreConfigProvider value={storeConfig}>
			<CartProvider>
				<div className="flex min-h-screen flex-col">
					{/* Top utility bar */}
					<div className="hidden sm:block w-full bg-foreground text-background/90 text-[11px] tracking-[0.22em] uppercase">
						<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between">
							<span>Complimentary shipping over $200</span>
							<span className="hidden md:inline">Handcrafted in small batches · Est. 2024</span>
							<span>Lifetime repairs included</span>
						</div>
					</div>

					<header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
						<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
							<div className="grid grid-cols-[1fr_auto_1fr] items-center h-20 gap-4">
								{/* Left: menu + about */}
								<div className="flex items-center gap-2">
									<button
										type="button"
										aria-label="Menu"
										className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background hover:bg-accent transition-colors"
									>
										<Menu className="h-4 w-4" />
									</button>
									<Link
										href="/faq"
										className="hidden md:inline text-sm text-muted-foreground hover:text-foreground transition-colors px-3"
									>
										About
									</Link>
								</div>

								{/* Center: brand wordmark in pill */}
								<Link
									href="/"
									className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-5 py-2.5 font-display text-base sm:text-lg font-medium tracking-tight"
								>
									<ShoppingBag className="h-4 w-4" />
									<span>Your Next Store</span>
								</Link>

								{/* Right: search, theme, account, wishlist, cart */}
								<div className="flex items-center justify-end gap-2">
									<Suspense>
										<SearchInput />
									</Suspense>
									<ThemeToggle />
									{/* Plain <a>: /account is a proxied zone — soft navigation 500s (see AGENTS.md).
									    Static on purpose: reading the session here would pull the header out of the
									    prerendered shell. Guests get the sign-in flow, shoppers land on the dashboard. */}
									<a
										href={
											storeConfig.language
												? `/account?lang=${encodeURIComponent(storeConfig.language)}`
												: "/account"
										}
										aria-label="Account"
										className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background hover:bg-accent transition-colors"
									>
										<UserRound className="h-4 w-4" />
									</a>
									<button
										type="button"
										aria-label="Wishlist"
										className="hidden sm:inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background hover:bg-accent transition-colors"
									>
										<Heart className="h-4 w-4" />
									</button>
									<CartButton />
								</div>
							</div>

							{/* Secondary pill nav */}
							<div className="pb-4">
								<Suspense>
									<Navbar links={links} />
								</Suspense>
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

// The shop's language, as the platform decides it: the default language once it is switched on, else the store's own.
async function getHtmlLang(): Promise<string> {
	const { locale } = await getStoreConfig();
	return locale.split("-")[0] || "en";
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
			<body className={`${inter.variable} ${dmSans.variable} antialiased`}>
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
