import "@/app/globals.css";

import { UserRound } from "lucide-react";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { Archivo, Geist, Geist_Mono } from "next/font/google";
import { getImageProps } from "next/image";
import Link from "next/link";
import { ThemeProvider } from "next-themes";
import { Suspense } from "react";
import { CartProvider } from "@/app/cart/cart-context";
import { CartSidebar } from "@/app/cart/cart-sidebar";
import { CartButton } from "@/app/cart-button";
import { Footer } from "@/app/footer";
import { ActiveNavLinks, type NavLink, NavLinkList } from "@/app/nav-links";
import { MobileMenu } from "@/app/navbar";
import { CookieConsent } from "@/components/cookie-consent";
import { ErrorOverlayRemover, NavigationReporter } from "@/components/devtools";
import { NewsletterDialog } from "@/components/newsletter-dialog";
import { SearchInput } from "@/components/search/search-input";
import { StoreChatSection } from "@/components/store-chat/store-chat-section";
import { StoreConfigProvider } from "@/components/store-config-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { Toaster } from "@/components/ui/sonner";
import { getCatalogCount, getShopSections, getStoreIdentity } from "@/lib/catalog";
import { getCanonicalUrl, getStoreFaviconUrl, meGetCached } from "@/lib/commerce";
import { fitDisplaySize, fitDisplaySizeAll } from "@/lib/display-type";
import { StoreJsonLd } from "@/lib/json-ld";
import { getStoreConfig } from "@/lib/store-config";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin", "latin-ext"],
});

// Condensed display voice: the width axis is driven by font-stretch 62%.
const archivo = Archivo({
	variable: "--font-archivo",
	subsets: ["latin", "latin-ext"],
	axes: ["wdth"],
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

async function getNavData() {
	"use cache";
	cacheLife("hours");
	const [sections, count, identity] = await Promise.all([
		getShopSections(),
		getCatalogCount(),
		getStoreIdentity(),
	]);
	const links: NavLink[] = [
		{ href: "/products", label: "New arrivals" },
		...sections.slice(0, 3).map((section, index) => ({
			href: section.href,
			label: section.name,
			wide: index === 2,
		})),
	];
	const menuSections = [
		{ name: "New arrivals", href: "/products", count, image: sections[0]?.image ?? null },
		...sections,
	];
	const helpLinks = [
		{ href: "/about", label: "About" },
		{ href: "/faq", label: "FAQ" },
		...(identity.contactFormEnabled ? [{ href: "/contact", label: "Contact" }] : []),
		...(identity.blogEnabled ? [{ href: "/blog", label: "Journal" }] : []),
	];
	// Phones: the wordmark shares the bar with four controls, so a long name steps down.
	const mobileWordmark = fitDisplaySize(identity.storeName, { maxPx: 26, budgetPx: 150, vwBudget: 40 });
	const menuSize = fitDisplaySizeAll(
		menuSections.map((section) => section.name),
		{ maxPx: 50, budgetPx: 240, vwBudget: 64 },
	);
	return { links, menuSections, helpLinks, storeName: identity.storeName, mobileWordmark, menuSize };
}

async function CartProviderWrapper({ children }: { children: React.ReactNode }) {
	// Only cached reads here. Awaiting anything request-time (cookies, headers) would
	// take the header, nav and footer out of the prerendered shell and leave the page
	// blank until the server responds; CartProvider loads the cart in the browser. The
	// other half of the rule: no
	// <Suspense> around this component either — the boundary itself is what streams the
	// chrome out of the shell, whether or not anything inside it is request-time.
	const [nav, storeConfig] = await Promise.all([getNavData(), getStoreConfig()]);
	// Plain <a>: /account is a proxied zone — soft navigation 500s (see AGENTS.md). Static on
	// purpose: reading the session here would pull the header out of the prerendered shell.
	const accountHref = storeConfig.language
		? `/account?lang=${encodeURIComponent(storeConfig.language)}`
		: "/account";

	return (
		<StoreConfigProvider value={storeConfig}>
			<CartProvider>
				<div className="flex min-h-screen flex-col">
					{/* Desktop: a floating glass pill. The header around it has no surface and lets
					    clicks through, so the page scrolls behind and beside the pill. */}
					<header className="pointer-events-none sticky top-0 z-40 hidden justify-center px-8 pt-5 lg:flex">
						<nav
							aria-label="Main"
							className="pointer-events-auto flex items-center gap-1 rounded-full bg-glass p-1.5 shadow-float backdrop-blur-[20px] backdrop-saturate-150 xl:gap-2"
						>
							<Link
								href="/"
								className="max-w-[16rem] truncate px-[18px] font-display text-[26px] leading-[44px]"
							>
								{nav.storeName}
							</Link>
							<Suspense fallback={<NavLinkList links={nav.links} />}>
								<ActiveNavLinks links={nav.links} />
							</Suspense>
							<Suspense>
								<SearchInput />
							</Suspense>
							<a
								href={accountHref}
								aria-label="Account"
								className="press grid size-11 place-items-center rounded-full hover:bg-wash"
							>
								<UserRound className="size-[18px]" strokeWidth={1.8} aria-hidden="true" />
							</a>
							<ThemeToggle />
							<CartButton className="h-11 px-[18px] text-sm" />
						</nav>
					</header>

					{/* Phones and tablets: a plain sticky bar and a full-screen menu sheet. */}
					<header className="sticky top-0 z-40 flex h-14 items-center justify-between gap-2 bg-background pl-4 pr-2 lg:hidden">
						<Link
							href="/"
							style={{ fontSize: nav.mobileWordmark }}
							className="min-w-0 truncate font-display leading-none"
						>
							{nav.storeName}
						</Link>
						<div className="flex shrink-0 items-center gap-0.5">
							<ThemeToggle />
							<Suspense>
								<SearchInput />
							</Suspense>
							<CartButton className="mx-1 h-10 px-3.5 text-[13px]" />
							<MobileMenu
								storeName={nav.storeName}
								sections={nav.menuSections}
								sectionSize={nav.menuSize}
								accountHref={accountHref}
								helpLinks={nav.helpLinks}
							/>
						</div>
					</header>
					<main className="mx-auto w-full max-w-[1920px] flex-1 px-4 pb-24 lg:px-8">{children}</main>
					<Footer accountHref={accountHref} />
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
			<body className={`${geistSans.variable} ${geistMono.variable} ${archivo.variable} antialiased`}>
				{/* DO NOT REMOVE / REORDER: required for GDPR + GTM Consent Mode v2. Must stay at top of <body>. */}
				<Suspense>
					<CookieConsent />
				</Suspense>
				<Suspense>
					<StoreJsonLd />
				</Suspense>
				<ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
					<CartProviderWrapper>{children}</CartProviderWrapper>
					<Suspense>
						<NewsletterPopupSection />
					</Suspense>
					<Toaster position="bottom-center" />
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
