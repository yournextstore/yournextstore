import "@/app/globals.css";

import { ArrowRight, UserRound } from "lucide-react";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { Geist, Geist_Mono } from "next/font/google";
import { getImageProps } from "next/image";
import Link from "next/link";
import { ThemeProvider } from "next-themes";
import { Suspense } from "react";
import { CartProvider } from "@/app/cart/cart-context";
import { CartSidebar } from "@/app/cart/cart-sidebar";
import { CartButton } from "@/app/cart-button";
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

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

// Preloaded on purpose: this theme sets the header's labels (STATUS, Location, MENU) in mono, above the fold.
const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
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
	// blank until the server responds; CartProvider loads the cart in the browser. The
	// other half of the rule: no
	// <Suspense> around this component either — the boundary itself is what streams the
	// chrome out of the shell, whether or not anything inside it is request-time.
	const [links, storeConfig] = await Promise.all([getNavLinks(), getStoreConfig()]);

	return (
		<StoreConfigProvider value={storeConfig}>
			<CartProvider>
				{/* Grain Overlay */}
				<div className="grain-overlay" />

				<div className="min-h-screen flex flex-col border-x border-foreground/10 max-w-[1600px] mx-auto relative z-10">
					{/* Brutalist Navigation */}
					<header className="grid grid-cols-2 md:grid-cols-12 border-b border-foreground/10 h-20 items-center">
						{/* Status Indicator */}
						<Link
							href="/"
							aria-label="Home"
							className="col-span-1 md:col-span-3 h-full flex items-center px-6 border-r border-foreground/10 group cursor-pointer hover:bg-secondary/50 transition-colors"
						>
							<span className="font-mono text-primary text-xs mr-4 tracking-widest">STATUS</span>
							<div className="relative w-8 h-8 border border-primary flex items-center justify-center animate-spin-slow">
								<div className="w-2 h-2 bg-primary" />
							</div>
							<span className="ml-3 font-bold text-sm tracking-widest group-hover:text-primary transition-colors">
								LIVE
							</span>
						</Link>

						{/* Location & Date */}
						<div className="hidden md:flex col-span-4 h-full items-center px-6 border-r border-foreground/10 justify-between">
							<div className="flex flex-col">
								<span className="font-mono text-[10px] uppercase opacity-60">Location</span>
								<span className="text-sm font-bold">SAN FRANCISCO, CA</span>
							</div>
							<div className="flex flex-col text-right">
								<span className="font-mono text-[10px] uppercase opacity-60">Date</span>
								<span className="text-sm font-bold text-primary">OCT 24-26, 2024</span>
							</div>
						</div>

						{/* Next Event */}
						<Link
							href="#tickets"
							className="hidden md:flex col-span-2 h-full items-center justify-center border-r border-foreground/10 hover:bg-primary hover:text-white transition-colors cursor-pointer group"
						>
							<span className="font-mono text-xs uppercase tracking-widest">TICKETS</span>
							<ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
						</Link>

						{/* Search + Theme + Account + Cart */}
						<div className="hidden md:flex col-span-2 h-full items-center justify-center border-r border-foreground/10 gap-1 px-2">
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
								className="p-2 hover:bg-secondary/50 hover:text-primary transition-colors"
								aria-label="Account"
							>
								<UserRound className="w-5 h-5" />
							</a>
							<CartButton />
						</div>

						{/* Menu Button */}
						<Navbar links={links} />
					</header>

					{/* Main Content */}
					<main className="flex-1">{children}</main>

					{/* Brutalist Footer */}
					<footer className="grid grid-cols-1 md:grid-cols-12 border-t border-foreground/10 py-8">
						<div className="col-span-1 md:col-span-4 px-6 md:px-12 flex items-center">
							<span className="font-bold text-lg tracking-tight">TECH SUMMIT 24</span>
						</div>
						<div className="col-span-1 md:col-span-8 px-6 md:px-12 flex flex-col md:flex-row justify-between items-center text-sm font-mono opacity-60 mt-4 md:mt-0">
							<div className="flex space-x-6">
								<span className="hover:text-primary transition-colors cursor-pointer">Instagram</span>
								<span className="hover:text-primary transition-colors cursor-pointer">Twitter</span>
								<span className="hover:text-primary transition-colors cursor-pointer">LinkedIn</span>
							</div>
							<div className="mt-4 md:mt-0">&copy; 2024 Tech Summit Series. All rights reserved.</div>
						</div>
					</footer>
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
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden`}>
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
