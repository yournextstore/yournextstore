import "@/app/globals.css";

import { UserRound } from "lucide-react";
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
import { Footer } from "@/app/footer";
import { MobileMenu, type NavLink } from "@/app/navbar";
import { HeaderSearch, HeaderSearchSkeleton } from "@/components/bento/header-search";
import { LogoMark } from "@/components/bento/logo-mark";
import { squareButton } from "@/components/bento/styles";
import { CookieConsent } from "@/components/cookie-consent";
import { ErrorOverlayRemover, NavigationReporter } from "@/components/devtools";
import { NewsletterDialog } from "@/components/newsletter-dialog";
import { StoreChatSection } from "@/components/store-chat/store-chat-section";
import { StoreConfigProvider } from "@/components/store-config-provider";
import { Toaster } from "@/components/ui/sonner";
import { getStoreBasics } from "@/lib/aqua";
import { getCartSuggestions } from "@/lib/cart-suggestions";
import { commerce, getCanonicalUrl, getStoreFaviconUrl, meGetCached } from "@/lib/commerce";
import { StoreJsonLd } from "@/lib/json-ld";
import { getStoreConfig } from "@/lib/store-config";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
	// Prices and counts are set in mono (the reference's spec figures), so it paints above the fold.
	display: "swap",
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

async function getNavLinks(): Promise<NavLink[]> {
	"use cache";
	cacheLife("hours");
	const [categories, me] = await Promise.all([
		commerce.categoriesBrowse({ active: true, limit: 50 }).catch(() => ({ data: [] })),
		meGetCached().catch(() => null),
	]);
	const blogEnabled = me?.store.settings?.enabledTools?.blog ?? false;
	return [
		...categories.data
			.filter((category) => !category.parentId)
			.map((category) => ({ href: `/category/${category.slug}`, label: category.name })),
		...(blogEnabled ? [{ href: "/blog", label: "Blog" }] : []),
	];
}

async function CartProviderWrapper({ children }: { children: React.ReactNode }) {
	// Only cached reads here. Awaiting anything request-time (cookies, headers) would
	// take the header, nav and footer out of the prerendered shell and leave the page
	// blank until the server responds; CartProvider loads the cart in the browser. The
	// other half of the rule: no <Suspense> around this component either — the boundary
	// itself is what streams the chrome out of the shell.
	const [links, storeConfig, basics, suggestions] = await Promise.all([
		getNavLinks(),
		getStoreConfig(),
		getStoreBasics(),
		getCartSuggestions(),
	]);
	const announcements = [
		basics.freeShipping ? `Free shipping over ${basics.freeShipping}` : "Secure, encrypted checkout",
		"Curated, not mass-listed",
		"Secure checkout, cards & wallets",
		"Questions? See the FAQ",
	];
	const accountHref = storeConfig.language
		? `/account?lang=${encodeURIComponent(storeConfig.language)}`
		: "/account";

	return (
		<StoreConfigProvider value={storeConfig}>
			<CartProvider>
				<div className="flex min-h-screen flex-col">
					<header className="sticky top-0 z-50">
						<div className="hidden bg-amber text-black sm:block">
							<ul className="mx-auto flex max-w-7xl items-center justify-center gap-8 overflow-hidden px-6 py-1.5 text-[12px] font-semibold tracking-wide whitespace-nowrap">
								{announcements.map((item, index) => (
									<li
										key={item}
										className={index > 1 ? "hidden items-center gap-8 lg:flex" : "flex items-center gap-8"}
									>
										{item}
										<span aria-hidden="true" className="text-black/40">
											◆
										</span>
									</li>
								))}
							</ul>
						</div>
						<nav
							aria-label="Main"
							className="flex items-center gap-3 border-b border-white/10 bg-deep/85 px-4 py-3 backdrop-blur-md sm:gap-4 lg:px-6"
						>
							<div className="flex-none lg:hidden">
								<MobileMenu links={links} storeName={basics.storeName} />
							</div>
							<Link href="/" aria-label={`${basics.storeName} home`} className="flex min-w-0 items-center">
								<LogoMark name={basics.storeName} />
							</Link>
							<ul className="hidden flex-1 items-center gap-6 pl-4 lg:flex">
								{links.map((link) => (
									<li key={link.href}>
										<Link
											href={link.href}
											className="text-sm font-medium whitespace-nowrap text-[#d4d4d4] transition-colors hover:text-amber"
										>
											{link.label}
										</Link>
									</li>
								))}
							</ul>
							<div className="ml-auto flex flex-none items-center gap-3">
								<div className="hidden w-52 lg:block xl:w-64">
									<Suspense fallback={<HeaderSearchSkeleton />}>
										<HeaderSearch />
									</Suspense>
								</div>
								{/* Plain <a>: /account is a proxied zone — soft navigation 500s (see AGENTS.md).
								    Static on purpose: reading the session here would pull the header out of the
								    prerendered shell. Guests get the sign-in flow, shoppers land on the dashboard. */}
								<a href={accountHref} className={`${squareButton} hidden sm:flex`} aria-label="Account">
									<UserRound className="h-4 w-4" aria-hidden="true" />
								</a>
								<CartButton />
							</div>
						</nav>
					</header>
					<main className="flex-1">{children}</main>
					<Footer />
				</div>
				<CartSidebar freeShippingMinor={basics.freeShippingMinor} suggestions={suggestions} />
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
				className={`${geistSans.variable} ${geistMono.variable} bg-deep text-bone antialiased selection:bg-amber selection:text-black`}
			>
				{/* DO NOT REMOVE / REORDER: required for GDPR + GTM Consent Mode v2. Must stay at top of <body>. */}
				<Suspense>
					<CookieConsent />
				</Suspense>
				<Suspense>
					<StoreJsonLd />
				</Suspense>
				<ThemeProvider
					attribute="class"
					forcedTheme="dark"
					defaultTheme="dark"
					enableSystem={false}
					disableTransitionOnChange
				>
					<CartProviderWrapper>{children}</CartProviderWrapper>
					<Suspense>
						<NewsletterPopupSection />
					</Suspense>
					<Toaster richColors closeButton position="bottom-right" />
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
