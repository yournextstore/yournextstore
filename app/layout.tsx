import "@/app/globals.css";

import { UserRound } from "lucide-react";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { Geist_Mono, Playfair_Display, Source_Sans_3 } from "next/font/google";
import { getImageProps } from "next/image";
import { ThemeProvider } from "next-themes";
import { Suspense } from "react";
import { CartProvider } from "@/app/cart/cart-context";
import { CartSidebar } from "@/app/cart/cart-sidebar";
import { CartButton } from "@/app/cart-button";
import { Footer } from "@/app/footer";
import { DesktopNav, MobileNav, type NavLink } from "@/app/navbar";
import { BrandMark } from "@/components/brand-mark";
import { CookieConsent } from "@/components/cookie-consent";
import { ErrorOverlayRemover, NavigationReporter } from "@/components/devtools";
import { NewsletterDialog } from "@/components/newsletter-dialog";
import { SearchInput } from "@/components/search/search-input";
import { StoreChatSection } from "@/components/store-chat/store-chat-section";
import { StoreConfigProvider } from "@/components/store-config-provider";
import { Toaster } from "@/components/ui/sonner";
import { getCategoryTiles, getStoreBrand } from "@/lib/catalog";
import { getCanonicalUrl, getStoreFaviconUrl, meGetCached } from "@/lib/commerce";
import { StoreJsonLd } from "@/lib/json-ld";
import { getStoreConfig } from "@/lib/store-config";

// The original's two faces: Playfair Display (headings, its italic the brass "Est." line) and
// Source Sans 3 (body and the letter-spaced caps).
const playfair = Playfair_Display({
	variable: "--font-playfair",
	subsets: ["latin", "latin-ext"],
	weight: ["400", "700"],
	style: ["normal", "italic"],
});

const sourceSans = Source_Sans_3({
	variable: "--font-source-sans",
	subsets: ["latin", "latin-ext"],
	weight: ["400", "600", "700"],
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
	const categories = await getCategoryTiles(6);
	return [
		{ href: "/products", label: "Shop" },
		...categories.slice(0, 3).map((category) => ({ href: category.href, label: category.name })),
		{ href: "/#shelf", label: "Shelf" },
		{ href: "/about", label: "About" },
	];
}

async function CartProviderWrapper({ children }: { children: React.ReactNode }) {
	// Only cached reads here. Awaiting anything request-time (cookies, headers) would
	// take the header, nav and footer out of the prerendered shell and leave the page
	// blank until the server responds; CartProvider loads the cart in the browser. The
	// other half of the rule: no
	// <Suspense> around this component either — the boundary itself is what streams the
	// chrome out of the shell, whether or not anything inside it is request-time.
	const [links, storeConfig, brand] = await Promise.all([getNavLinks(), getStoreConfig(), getStoreBrand()]);

	return (
		<StoreConfigProvider value={storeConfig}>
			<CartProvider>
				<div className="flex min-h-screen flex-col">
					<a
						href="#main"
						className="fixed -top-16 left-4 z-[100] rounded-[2px] bg-gold px-4 py-2 font-semibold text-on-gold transition-[top] duration-150 focus-visible:top-3"
					>
						Skip to main content
					</a>
					{/* The original's sticky navbar: 60px, near-black glass, a brass hairline beneath. */}
					<header
						data-site-header
						className="sticky top-0 z-40 border-b border-line bg-page/95 backdrop-blur-[10px]"
					>
						<div className="mx-auto flex h-[var(--header-h)] max-w-[1200px] items-center gap-2 px-4 sm:gap-3 lg:px-8">
							<BrandMark name={brand.name} className="mr-auto" />
							<DesktopNav links={links} />
							<div className="flex items-center gap-0.5 sm:gap-1">
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
									className="hidden size-10 items-center justify-center text-ink transition-colors hover:text-gold sm:inline-flex"
									aria-label="Account"
								>
									<UserRound className="size-[18px]" strokeWidth={1.75} />
								</a>
								<CartButton />
								<MobileNav links={links} />
							</div>
						</div>
					</header>
					<main id="main" className="flex-1">
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
			<body className={`${playfair.variable} ${sourceSans.variable} ${geistMono.variable} antialiased`}>
				{/* DO NOT REMOVE / REORDER: required for GDPR + GTM Consent Mode v2. Must stay at top of <body>. */}
				<Suspense>
					<CookieConsent />
				</Suspense>
				<Suspense>
					<StoreJsonLd />
				</Suspense>
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
