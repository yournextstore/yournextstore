import "@/app/globals.css";

import { SparklesIcon, TruckIcon, UserRoundIcon } from "lucide-react";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { DM_Sans, Forum, Geist_Mono } from "next/font/google";
import { getImageProps } from "next/image";
import Link from "next/link";
import { ThemeProvider } from "next-themes";
import { Suspense } from "react";
import { CartProvider } from "@/app/cart/cart-context";
import { CartSidebar } from "@/app/cart/cart-sidebar";
import { CartButton } from "@/app/cart-button";
import { Footer } from "@/app/footer";
import { HeaderScroll } from "@/app/header-scroll";
import { DesktopNav, MobileMenu, NavActive, type NavLink } from "@/app/navbar";
import { CookieConsent } from "@/components/cookie-consent";
import { ErrorOverlayRemover, NavigationReporter } from "@/components/devtools";
import { Logo } from "@/components/grilli/logo";
import { NewsletterDialog } from "@/components/newsletter-dialog";
import { SearchInput } from "@/components/search/search-input";
import { StoreChatSection } from "@/components/store-chat/store-chat-section";
import { StoreConfigProvider } from "@/components/store-config-provider";
import { Toaster } from "@/components/ui/sonner";
import { getCollectionTiles, getStoreBasics } from "@/lib/catalog";
import { getCanonicalUrl, getStoreFaviconUrl, meGetCached } from "@/lib/commerce";
import { StoreJsonLd } from "@/lib/json-ld";
import { getStoreConfig } from "@/lib/store-config";

// The original's pair: Forum for every headline, DM Sans for the rest.
const forum = Forum({ variable: "--font-forum", subsets: ["latin", "latin-ext"], weight: "400" });
const dmSans = DM_Sans({ variable: "--font-dm-sans", subsets: ["latin", "latin-ext"] });

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
	// Only collections that hold products: an empty one would lead to a "nothing here" page.
	const collections = await getCollectionTiles(3);
	return [
		{ href: "/", label: "Home" },
		{ href: "/products", label: "Shop" },
		...collections.map((collection) => ({
			href: collection.href,
			label: collection.name,
		})),
		{ href: "/about", label: "About Us" },
	];
}

async function CartProviderWrapper({ children }: { children: React.ReactNode }) {
	// Only cached reads here. Awaiting anything request-time (cookies, headers) would
	// take the header, nav and footer out of the prerendered shell and leave the page
	// blank until the server responds; CartProvider loads the cart in the browser. The
	// other half of the rule: no
	// <Suspense> around this component either — the boundary itself is what streams the
	// chrome out of the shell, whether or not anything inside it is request-time.
	const [links, storeConfig, basics] = await Promise.all([getNavLinks(), getStoreConfig(), getStoreBasics()]);
	// Plain <a> everywhere for /account: it is a proxied zone and a soft navigation 500s (AGENTS.md).
	// Static on purpose: reading the session here would pull the header out of the prerendered shell.
	const accountHref = storeConfig.language
		? `/account?lang=${encodeURIComponent(storeConfig.language)}`
		: "/account";

	return (
		<StoreConfigProvider value={storeConfig}>
			<CartProvider>
				<div className="flex min-h-screen flex-col">
					<div className="topbar">
						<div className="flex h-full items-center justify-center gap-[30px] px-5 text-label-1 lg:justify-start">
							{basics.freeShipping && (
								<p className="hidden items-center gap-1.5 lg:flex">
									<TruckIcon className="size-4" strokeWidth={1.5} aria-hidden="true" />
									Free delivery on orders over {basics.freeShipping}
								</p>
							)}
							<span className="diamond hidden xl:block" />
							<p className="mr-auto hidden items-center gap-1.5 lg:flex">
								<SparklesIcon className="size-4" strokeWidth={1.5} aria-hidden="true" />
								From our kitchen to your table
							</p>
							<a href={accountHref} className="flex items-center gap-1.5 transition-colors hover:text-gold">
								<UserRoundIcon className="size-4" strokeWidth={1.5} aria-hidden="true" />
								My account
							</a>
							<span className="diamond hidden xl:block" />
							<Link href="/about" className="transition-colors hover:text-gold">
								Our story
							</Link>
						</div>
					</div>
					<header id="site-header" className="site-header" data-sticky="false">
						<div className="flex items-center justify-between gap-2 px-5 xl:grid xl:grid-cols-[1fr_auto_1fr] xl:gap-8">
							<Link href="/" className="min-w-0 justify-self-start">
								<Logo name={basics.storeName} />
							</Link>
							<DesktopNav links={links} />
							<Suspense>
								<NavActive />
							</Suspense>
							<div className="flex items-center gap-1 justify-self-end xs:gap-3">
								<Suspense>
									<SearchInput />
								</Suspense>
								<a
									href={accountHref}
									aria-label="Account"
									className="hidden size-11 items-center justify-center text-white transition-colors hover:text-gold xl:inline-flex"
								>
									<UserRoundIcon className="size-5" strokeWidth={1.5} aria-hidden="true" />
								</a>
								<CartButton />
								<MobileMenu
									links={links}
									storeName={basics.storeName}
									description={basics.description}
									freeShipping={basics.freeShipping}
									accountHref={accountHref}
								/>
							</div>
						</div>
					</header>
					<HeaderScroll />
					<main id="main" className="site-main flex-1">
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
			<body className={`${forum.variable} ${dmSans.variable} ${geistMono.variable} antialiased`}>
				{/* DO NOT REMOVE / REORDER: required for GDPR + GTM Consent Mode v2. Must stay at top of <body>. */}
				<Suspense>
					<CookieConsent />
				</Suspense>
				<Suspense>
					<StoreJsonLd />
				</Suspense>
				{/* Dark only, like the original: the forced theme keeps the toaster and chat on the smoky palette. */}
				<ThemeProvider attribute="class" forcedTheme="dark" disableTransitionOnChange>
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
