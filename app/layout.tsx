import "@/app/globals.css";

import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { Cormorant_Garamond, Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { getImageProps } from "next/image";
import Link from "next/link";
import { ThemeProvider } from "next-themes";
import { Suspense } from "react";
import { CartProvider } from "@/app/cart/cart-context";
import { CartSidebar } from "@/app/cart/cart-sidebar";
import { CartButton } from "@/app/cart-button";
import { Footer } from "@/app/footer";
import { HeaderShell, MobileMenu, Navbar, type NavLink } from "@/app/navbar";
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
import { getFeaturedCategories, getStoreIdentity } from "@/lib/theme";

// The original's pairing: Plus Jakarta Sans for text, Cormorant Garamond for display.
// latin-ext for catalogue names with accented letters.
const jakarta = Plus_Jakarta_Sans({
	variable: "--font-jakarta",
	subsets: ["latin", "latin-ext"],
});

const cormorant = Cormorant_Garamond({
	variable: "--font-cormorant",
	subsets: ["latin", "latin-ext"],
	weight: ["400", "500"],
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
	const [categories, identity] = await Promise.all([getFeaturedCategories(), getStoreIdentity()]);
	const shop: NavLink[] = categories.map((c) => ({ href: `/category/${c.slug}`, label: c.name }));
	const links: NavLink[] = [
		{ href: "/products", label: "New In" },
		{ href: "/products", label: "Shop", children: shop },
		...(identity.blogEnabled ? [{ href: "/blog", label: "Journal" }] : []),
		{ href: "/about", label: "About" },
	];
	return links;
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
			? `Complimentary shipping on orders over ${identity.freeShipping}`
			: "Complimentary gift wrapping on every order",
		"New arrivals added weekly",
		"Secure checkout",
	];

	return (
		<StoreConfigProvider value={storeConfig}>
			<CartProvider>
				<div className="flex min-h-screen flex-col">
					{/* Announcement bar: the original's three messages, dot-separated, fewer on small screens. */}
					<section
						aria-label="Announcements"
						className="bg-primary px-4 py-2.5 text-center text-xs tracking-wide text-primary-foreground"
					>
						<p className="flex items-center justify-center gap-2.5">
							<span className="truncate">{announcements[0]}</span>
							<span aria-hidden="true" className="hidden opacity-50 sm:inline">
								•
							</span>
							<span className="hidden sm:inline">{announcements[1]}</span>
							<span aria-hidden="true" className="hidden opacity-50 md:inline">
								•
							</span>
							<span className="hidden md:inline">{announcements[2]}</span>
						</p>
					</section>
					<HeaderShell>
						<div className="shell relative flex h-[72px] items-center justify-between">
							<div className="flex flex-1 items-center">
								<MobileMenu links={links} accountHref={accountHref} />
								<Navbar links={links} />
							</div>
							<Link
								href="/"
								className="absolute left-1/2 max-w-[52vw] -translate-x-1/2 truncate font-serif text-2xl font-medium tracking-wide text-foreground md:text-[1.75rem]"
							>
								{identity.name}
							</Link>
							<div className="flex flex-1 items-center justify-end gap-0.5 md:gap-1.5">
								<Suspense>
									<SearchInput />
								</Suspense>
								<a
									href={accountHref}
									className="hidden h-10 w-10 items-center justify-center rounded-md transition-colors hover:bg-secondary sm:inline-flex"
								>
									<span className="sr-only">Account</span>
									<svg
										aria-hidden="true"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="1.5"
										className="h-5 w-5"
									>
										<circle cx="12" cy="8" r="4" />
										<path d="M4.5 20.5c1.2-3.6 4-5.5 7.5-5.5s6.3 1.9 7.5 5.5" strokeLinecap="round" />
									</svg>
								</a>
								<CartButton />
							</div>
						</div>
					</HeaderShell>
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
			<body
				className={`${jakarta.variable} ${cormorant.variable} ${geistMono.variable} font-sans antialiased`}
			>
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
