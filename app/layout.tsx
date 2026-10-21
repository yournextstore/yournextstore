import "@/app/globals.css";

import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { Belleza, Geist_Mono, Montserrat } from "next/font/google";
import { getImageProps } from "next/image";
import Link from "next/link";
import { ThemeProvider } from "next-themes";
import { Suspense } from "react";
import { AnnouncementBar } from "@/app/announcement-bar";
import { CartProvider } from "@/app/cart/cart-context";
import { CartSidebar } from "@/app/cart/cart-sidebar";
import { CartButton } from "@/app/cart-button";
import { Footer } from "@/app/footer";
import { Navbar, type NavLink } from "@/app/navbar";
import { CookieConsent } from "@/components/cookie-consent";
import { ErrorOverlayRemover, NavigationReporter } from "@/components/devtools";
import { SprigIcon, UserIcon } from "@/components/icons";
import { NewsletterDialog } from "@/components/newsletter-dialog";
import { SearchInput } from "@/components/search/search-input";
import { StoreChatSection } from "@/components/store-chat/store-chat-section";
import { StoreConfigProvider } from "@/components/store-config-provider";
import { Toaster } from "@/components/ui/sonner";
import { isListedCollection } from "@/lib/catalog";
import { commerce, getCanonicalUrl, getStoreFaviconUrl, meGetCached } from "@/lib/commerce";
import { StoreJsonLd } from "@/lib/json-ld";
import { getStoreConfig } from "@/lib/store-config";

// The original pairs Montserrat (body, UI) with Belleza (display serif for headings).
const montserrat = Montserrat({
	variable: "--font-montserrat",
	subsets: ["latin"],
});

const belleza = Belleza({
	variable: "--font-belleza",
	subsets: ["latin"],
	weight: "400",
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
	const [collections, me] = await Promise.all([
		commerce.collectionBrowse({ limit: 5 }),
		meGetCached().catch(() => null),
	]);
	const blogEnabled = me?.store.settings?.enabledTools?.blog ?? false;
	return [
		{ href: "/", label: "Home" },
		{ href: "/products", label: "Shop" },
		...collections.data
			.filter(isListedCollection)
			.slice(0, 4)
			.map((collection) => ({
				href: `/collection/${collection.slug}`,
				label: collection.name,
			})),
		...(blogEnabled ? [{ href: "/blog", label: "Journal" }] : []),
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
	const [links, storeConfig, storeName] = await Promise.all([
		getNavLinks(),
		getStoreConfig(),
		getStoreName(),
	]);
	const accountHref = storeConfig.language
		? `/account?lang=${encodeURIComponent(storeConfig.language)}`
		: "/account";

	return (
		<StoreConfigProvider value={storeConfig}>
			<CartProvider>
				<div className="flex min-h-screen flex-col">
					<AnnouncementBar storeName={storeName} />
					<header className="sticky top-0 z-40 bg-card text-secondary-foreground">
						{/* Top row: utility links, centred wordmark, actions (the original's 2-row header). */}
						<div className="border-b border-border/70 lg:bg-subtle">
							<div className="container-page grid h-14 grid-cols-[1fr_auto_1fr] items-center lg:h-[78px]">
								<div className="flex items-center gap-1 lg:gap-5">
									<Navbar links={links} storeName={storeName} />
									<div className="lg:hidden">
										<Suspense>
											<SearchInput />
										</Suspense>
									</div>
									<Link href="/about" className="hidden text-[13px] font-medium hover:underline lg:inline">
										Our story
									</Link>
									<Link href="/faq" className="hidden text-[13px] font-medium hover:underline lg:inline">
										Help &amp; FAQ
									</Link>
								</div>
								<Link
									href="/"
									className="flex flex-col items-center px-2 text-center leading-none"
									aria-label={`${storeName} home`}
								>
									<SprigIcon className="h-4 w-7 text-sage lg:h-5 lg:w-9" />
									<span className="mt-0.5 font-heading text-base uppercase tracking-[0.08em] text-secondary-foreground lg:text-lg">
										{storeName}
									</span>
								</Link>
								<div className="flex items-center justify-end gap-1 lg:gap-3">
									<div className="hidden lg:block">
										<Suspense>
											<SearchInput />
										</Suspense>
									</div>
									{/* Plain <a>: /account is a proxied zone — soft navigation 500s (see AGENTS.md).
									    Static on purpose: reading the session here would pull the header out of the
									    prerendered shell. Guests get the sign-in flow, shoppers land on the dashboard. */}
									<a
										href={accountHref}
										className="inline-flex items-center gap-2 rounded-full p-2 text-[13px] font-medium transition-colors hover:bg-secondary"
										aria-label="Account"
									>
										<UserIcon className="size-6 lg:size-5" />
										<span className="hidden xl:inline" aria-hidden="true">
											Sign in / Account
										</span>
									</a>
									<CartButton />
								</div>
							</div>
						</div>
						{/* Second row: the main menu, centred (desktop only). */}
						<nav aria-label="Main" className="hidden border-b border-border/70 lg:block">
							<ul className="container-page flex h-[60px] items-center justify-center gap-9">
								{links.map((link) => (
									<li key={link.href}>
										<Link
											href={link.href}
											className="whitespace-nowrap text-[15px] font-medium text-secondary-foreground underline-offset-8 transition-colors hover:underline"
										>
											{link.label}
										</Link>
									</li>
								))}
							</ul>
						</nav>
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

async function getStoreName() {
	"use cache";
	cacheLife("hours");
	const me = await meGetCached().catch(() => null);
	return me?.store.name || "Your Next Store";
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
			<body className={`${montserrat.variable} ${belleza.variable} ${geistMono.variable} antialiased`}>
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
