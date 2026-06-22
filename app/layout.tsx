import "@/app/globals.css";

import { ChevronDown as ChevronDownIcon, Globe, User } from "lucide-react";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { DM_Serif_Display, Inter } from "next/font/google";
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
	variable: "--font-sans",
	subsets: ["latin"],
	display: "swap",
});

const display = DM_Serif_Display({
	variable: "--font-display",
	subsets: ["latin"],
	weight: ["400"],
	display: "swap",
});

async function getStoreMetadata(): Promise<Metadata> {
	"use cache";
	cacheLife("hours");
	const me = await meGetCached();
	const storeName = me.store.name || "Your Next Store";
	const storeDescription = me.store.settings?.storeDescription || "A new era of nurturing.";
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

function AnnouncementBar() {
	return (
		<div className="bg-[var(--olive-dark)] text-[var(--cream)] text-[11px] tracking-[0.18em] uppercase">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-center gap-3">
				<span className="hidden sm:inline opacity-70">Free shipping over $80</span>
				<span className="hidden sm:inline opacity-30">·</span>
				<span>Subscribe to our newsletter and get 10% off</span>
				<span className="hidden sm:inline opacity-30">·</span>
				<span className="hidden sm:inline opacity-70">Designed in Denmark</span>
			</div>
		</div>
	);
}

function RegionSwitcher() {
	return (
		<div className="hidden lg:flex items-center gap-4 text-[11px] tracking-[0.16em] uppercase text-foreground/70">
			<button type="button" className="flex items-center gap-1 hover:text-foreground transition-colors">
				<Globe className="w-3.5 h-3.5" />
				English
				<ChevronDownIcon className="w-3 h-3" />
			</button>
			<button type="button" className="flex items-center gap-1 hover:text-foreground transition-colors">
				United States (USD)
				<ChevronDownIcon className="w-3 h-3" />
			</button>
		</div>
	);
}

async function CartProviderWrapper({ children }: { children: React.ReactNode }) {
	// Only cached reads here. Awaiting anything request-time (cookies, headers) would take the
	// header, nav and footer out of the prerendered shell and leave the page blank until the
	// server responds; CartProvider loads the cart in the browser. No <Suspense> around this
	// component either: the boundary itself is what streams the chrome out of the shell.
	const [links, storeConfig] = await Promise.all([getNavLinks(), getStoreConfig()]);

	return (
		<StoreConfigProvider value={storeConfig}>
			<CartProvider>
				<div className="flex min-h-screen flex-col">
					<AnnouncementBar />
					<header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
						<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
							<div className="grid grid-cols-[1fr_auto_1fr] items-center h-16 lg:h-20 gap-6">
								{/* Left: wordmark */}
								<div className="flex items-center">
									<Link
										href="/"
										className="font-display text-2xl lg:text-[28px] tracking-tight text-[var(--olive-dark)] leading-none"
									>
										Your Next Store
									</Link>
								</div>
								{/* Center: nav */}
								<Navbar links={links} />
								{/* Right: region + actions */}
								<div className="flex items-center justify-end gap-4 lg:gap-6">
									<RegionSwitcher />
									<div className="flex items-center gap-1">
										<Suspense>
											<SearchInput />
										</Suspense>
										<ThemeToggle />
										{/* Plain <a>: /account is a proxied zone, and soft navigation into it 500s (see AGENTS.md).
										    Static on purpose: reading the session here would pull the header out of the
										    prerendered shell. Guests get the sign-in flow, shoppers land on the dashboard. */}
										<a
											href={
												storeConfig.language
													? `/account?lang=${encodeURIComponent(storeConfig.language)}`
													: "/account"
											}
											className="p-2 hover:opacity-60 transition-opacity hidden sm:inline-flex"
											aria-label="Account"
										>
											<User className="w-[18px] h-[18px]" />
										</a>
										<CartButton />
									</div>
								</div>
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

	// suppressHydrationWarning: next-themes sets the theme class on <html> before hydration.
	return (
		<html lang={lang} suppressHydrationWarning>
			<body className={`${inter.variable} ${display.variable} antialiased`}>
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
