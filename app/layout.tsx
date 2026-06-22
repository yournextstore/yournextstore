import "@/app/globals.css";

import { UserRound } from "lucide-react";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { Bodoni_Moda, Work_Sans } from "next/font/google";
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

const workSans = Work_Sans({
	variable: "--font-work-sans",
	subsets: ["latin"],
	display: "swap",
});

const bodoniModa = Bodoni_Moda({
	variable: "--font-bodoni-moda",
	subsets: ["latin"],
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

function AnnouncementBar() {
	return (
		<div className="bg-[var(--color-secondary-container)] text-[var(--color-on-secondary-container)] label-caps border-b border-foreground">
			<div className="max-w-[1280px] mx-auto px-5 md:px-20 py-2 flex justify-between items-center gap-4">
				<div className="flex items-center gap-2">
					<span className="hidden sm:inline">Customer service</span>
					<span className="sm:hidden">Help</span>
				</div>
				<div className="text-center hidden md:block">Free US shipping on orders over $40</div>
				<div className="flex items-center gap-2">
					<span>$ USD</span>
				</div>
			</div>
		</div>
	);
}

// Plain <a>: /account is a proxied zone, and a soft navigation into it 500s (AGENTS.md).
// Shoppers sign in on the platform, so the link is static and never reads the session here.
function AccountLink({ language }: { language: string | null }) {
	return (
		<a
			href={language ? `/account?lang=${encodeURIComponent(language)}` : "/account"}
			className="p-2 hover:bg-secondary transition-colors"
			aria-label="Account"
		>
			<UserRound className="w-5 h-5" />
		</a>
	);
}

async function CartProviderWrapper({ children }: { children: React.ReactNode }) {
	// Only cached reads here. Awaiting anything request-time (cookies, headers) would take the
	// header, nav and footer out of the prerendered shell; CartProvider loads the cart in the
	// browser. No <Suspense> around this component either: the boundary itself streams the
	// chrome out of the shell, whether or not anything inside it is request-time.
	const [links, me, storeConfig] = await Promise.all([getNavLinks(), meGetCached(), getStoreConfig()]);
	const storeName = (me.store.name || "Your Next Store").toLowerCase();

	return (
		<StoreConfigProvider value={storeConfig}>
			<CartProvider>
				<div className="flex min-h-screen flex-col">
					<header className="sticky top-0 z-50 bg-[var(--color-surface-container-lowest)] border-b border-foreground">
						<AnnouncementBar />
						{/* Desktop nav */}
						<nav className="hidden md:flex max-w-[1280px] mx-auto px-20 py-4 items-center justify-between gap-8">
							<div className="flex items-center gap-8">
								<Navbar links={links} />
							</div>
							<Link
								href="/"
								className="font-serif text-3xl lg:text-[40px] uppercase tracking-tight leading-none font-semibold"
							>
								{storeName}
							</Link>
							<div className="flex items-center gap-6">
								<Suspense>
									<SearchInput />
								</Suspense>
								<ThemeToggle />
								<AccountLink language={storeConfig.language} />
								<CartButton />
							</div>
						</nav>
						{/* Mobile nav */}
						<nav className="flex md:hidden max-w-[1280px] mx-auto px-5 py-4 items-center justify-between">
							<Suspense>
								<SearchInput />
							</Suspense>
							<Link
								href="/"
								className="font-serif text-2xl uppercase tracking-tight leading-none font-semibold"
							>
								{storeName}
							</Link>
							<ThemeToggle />
							<AccountLink language={storeConfig.language} />
							<CartButton />
						</nav>
					</header>
					<div className="flex-1">{children}</div>
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

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	// VERCEL_ENV is unset off Vercel, so fall back to NODE_ENV: a self-hosted production
	// build must not ship the builder devtools.
	const env = process.env.VERCEL_ENV || process.env.NODE_ENV;
	const lang = await getHtmlLang();

	return (
		// suppressHydrationWarning: next-themes sets the theme class on <html> before hydration.
		<html lang={lang} suppressHydrationWarning>
			<body className={`${workSans.variable} ${bodoniModa.variable} antialiased`}>
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
