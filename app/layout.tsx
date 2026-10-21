import "@/app/globals.css";

import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { DM_Sans, Geist_Mono, Tenor_Sans } from "next/font/google";
import { getImageProps } from "next/image";
import Link from "next/link";
import { ThemeProvider } from "next-themes";
import { Suspense } from "react";
import { CartProvider } from "@/app/cart/cart-context";
import { CartSidebar } from "@/app/cart/cart-sidebar";
import { CartButton } from "@/app/cart-button";
import { Footer } from "@/app/footer";
import { Announcements, HeaderShell, MobileMenu, Navbar, type NavLink } from "@/app/navbar";
import { CookieConsent } from "@/components/cookie-consent";
import { ErrorOverlayRemover, NavigationReporter } from "@/components/devtools";
import { NewsletterDialog } from "@/components/newsletter-dialog";
import { SearchInput } from "@/components/search/search-input";
import { StoreChatSection } from "@/components/store-chat/store-chat-section";
import { StoreConfigProvider } from "@/components/store-config-provider";
import { Toaster } from "@/components/ui/sonner";
import { getCanonicalUrl, getStoreFaviconUrl, meGetCached } from "@/lib/commerce";
import { StoreJsonLd } from "@/lib/json-ld";
import { getStoreConfig } from "@/lib/store-config";
import { getCatalogueTiles, getStoreIdentity } from "@/lib/theme";

// The original's pairing: Tenor Sans for the uppercase display type, DM Sans for text.
// latin-ext for Polish catalogue names.
const tenor = Tenor_Sans({
	variable: "--font-tenor",
	subsets: ["latin", "latin-ext"],
	weight: "400",
});

const dmSans = DM_Sans({
	variable: "--font-dm-sans",
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

async function getNavLinks() {
	"use cache";
	cacheLife("hours");
	const [{ categories, collections }, identity] = await Promise.all([
		getCatalogueTiles(),
		getStoreIdentity(),
	]);
	const groups = [
		...(categories.length > 0
			? [{ title: "Categories", links: categories.map((c) => ({ href: c.href, label: c.title })) }]
			: []),
		...(collections.length > 0
			? [{ title: "Collections", links: collections.map((c) => ({ href: c.href, label: c.title })) }]
			: []),
	];
	const links: NavLink[] = [
		{ href: "/", label: "Home" },
		{ href: "/products", label: "Collections", groups },
		{ href: "/products", label: "Shop all" },
		...(identity.blogEnabled ? [{ href: "/blog", label: "Blogs" }] : []),
		{ href: "/about", label: "About" },
	];
	return links;
}

function AccountIcon() {
	return (
		<svg
			aria-hidden="true"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.25"
			className="h-5 w-5"
		>
			<circle cx="12" cy="8" r="4.25" />
			<path d="M4.5 20.5c1.3-3.7 4.1-5.6 7.5-5.6s6.2 1.9 7.5 5.6" strokeLinecap="round" />
		</svg>
	);
}

async function CartProviderWrapper({ children }: { children: React.ReactNode }) {
	// Only cached reads here. Awaiting anything request-time (cookies, headers) would
	// take the header, nav and footer out of the prerendered shell and leave the page
	// blank until the server responds; CartProvider loads the cart in the browser. The
	// other half of the rule: no
	// <Suspense> around this component either — the boundary itself is what streams the
	// chrome out of the shell, whether or not anything inside it is request-time.
	const [links, storeConfig, identity] = await Promise.all([
		getNavLinks(),
		getStoreConfig(),
		getStoreIdentity(),
	]);
	// Plain <a>: /account is a proxied zone — soft navigation 500s (see AGENTS.md). Static on
	// purpose: reading the session here would pull the header out of the prerendered shell.
	const accountHref = storeConfig.language
		? `/account?lang=${encodeURIComponent(storeConfig.language)}`
		: "/account";
	const announcements = [
		identity.freeShipping
			? `Free delivery on orders over ${identity.freeShipping}`
			: "Solid wood, natural fabrics, calm rooms",
		"Made to be lived with",
		"Secure checkout, every order",
	];
	const iconClass =
		"inline-flex h-10 w-10 items-center justify-center rounded-xs transition-opacity hover:opacity-70";

	return (
		<StoreConfigProvider value={storeConfig}>
			<CartProvider>
				<div className="flex min-h-screen flex-col">
					<Announcements messages={announcements} />
					<HeaderShell>
						<div className="shell relative flex h-12 items-center justify-between lg:h-20">
							{/* Phones: menu + search left, wordmark centred, account + cart right. */}
							<div className="flex min-w-0 flex-1 items-center">
								<MobileMenu links={links} accountHref={accountHref} />
								<div className="lg:hidden">
									<Suspense>
										<SearchInput />
									</Suspense>
								</div>
								<Link
									href="/"
									className="hidden min-w-0 truncate pr-6 font-serif text-[1.625rem] xl:text-[2.125rem] leading-none tracking-[-0.01em] text-foreground uppercase lg:block"
								>
									{identity.name}
								</Link>
							</div>
							<Link
								href="/"
								className="absolute left-1/2 max-w-[calc(100%-12rem)] -translate-x-1/2 truncate font-serif text-[1.375rem] leading-none tracking-[-0.01em] text-foreground uppercase sm:text-[1.75rem] lg:hidden"
							>
								{identity.name}
							</Link>
							<div className="hidden h-full lg:block">
								<Navbar links={links} />
							</div>
							<div className="flex flex-1 items-center justify-end gap-0.5">
								<div className="hidden lg:block">
									<Suspense>
										<SearchInput />
									</Suspense>
								</div>
								<a href={accountHref} className={iconClass}>
									<span className="sr-only">Account</span>
									<AccountIcon />
								</a>
								<CartButton />
							</div>
						</div>
					</HeaderShell>
					<main className="flex-1">{children}</main>
					<Footer />
				</div>
				<CartSidebar freeShippingThreshold={identity.freeShippingThreshold} />
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
			<body className={`${tenor.variable} ${dmSans.variable} ${geistMono.variable} antialiased`}>
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
