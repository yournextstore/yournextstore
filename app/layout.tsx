import "@/app/globals.css";

import {
	ChevronDown as ChevronDownIcon,
	Gift as GiftIcon,
	Heart as HeartIcon,
	Search as SearchIcon,
	User as UserIcon,
} from "lucide-react";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { Archivo, Geist_Mono, Inter } from "next/font/google";
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
	variable: "--font-inter",
	subsets: ["latin"],
	display: "swap",
});

const display = Archivo({
	variable: "--font-display",
	subsets: ["latin"],
	weight: ["500", "600", "700", "800", "900"],
	display: "swap",
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
	const storeDescription =
		me.store.settings?.storeDescription ||
		"Premium performance apparel engineered for movement, designed for life beyond the gym.";
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
		<div className="bg-[--ink] text-[--bone] text-[11px] tracking-[0.18em] uppercase">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-9 flex items-center justify-between">
				<div className="hidden md:flex items-center gap-6 text-[--bone]/70">
					<span>Free shipping on US orders $75+</span>
					<span>·</span>
					<span>Easy 60-day returns</span>
				</div>
				<div className="flex-1 md:flex-none text-center md:text-left text-[--bone]">
					Every Move. Every Form. Shop Your Next Store™ Form
				</div>
				<div className="hidden md:flex items-center gap-4 text-[--bone]/80">
					<button type="button" className="inline-flex items-center gap-1 hover:text-[--bone]">
						<GiftIcon className="h-3 w-3" /> Gift Cards
					</button>
					<button type="button" className="inline-flex items-center gap-1 hover:text-[--bone]">
						<span className="inline-block h-2 w-2 rounded-full bg-[--bone]" /> US
						<ChevronDownIcon className="h-3 w-3" />
					</button>
				</div>
			</div>
		</div>
	);
}

function YNSLogo() {
	return (
		<Link href="/" className="flex items-center gap-2 group" aria-label="Your Next Store">
			<svg
				viewBox="0 0 40 24"
				className="h-5 w-auto"
				aria-hidden="true"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path d="M2 22 L12 4 L22 22" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
				<path d="M16 22 L26 4 L36 22" stroke="var(--oxblood)" strokeWidth="3" strokeLinecap="round" />
				<circle cx="32" cy="4" r="2" fill="#e3b766" />
			</svg>
			<span className="display-section text-[17px] font-bold tracking-[-0.02em] uppercase">
				Your Next Store
			</span>
		</Link>
	);
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
				<div className="flex min-h-screen flex-col bg-background">
					<AnnouncementBar />
					<header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md">
						<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
							<div className="flex items-center justify-between h-14">
								<div className="hidden lg:flex flex-1 items-center gap-7">
									<Navbar links={links} />
								</div>
								<div className="flex lg:flex-1 lg:justify-center">
									<YNSLogo />
								</div>
								<div className="flex flex-1 items-center justify-end gap-3 text-foreground/80">
									<div className="hidden md:flex items-center text-xs uppercase tracking-[0.14em] gap-4 mr-1">
										<Link href="/legal/sign-up" className="hover:text-foreground">
											Sign Up
										</Link>
										<Link href="/products" className="hover:text-foreground">
											Find a Store
										</Link>
									</div>
									<div className="hidden sm:block">
										<Suspense>
											<SearchInput />
										</Suspense>
									</div>
									<button
										type="button"
										aria-label="Search"
										className="sm:hidden p-2 hover:text-foreground transition-colors"
									>
										<SearchIcon className="h-5 w-5" />
									</button>
									{/* Plain <a>: /account is a proxied zone — soft navigation 500s (see AGENTS.md).
									    Static on purpose: reading the session here would pull the header out of the
									    prerendered shell. Guests get the sign-in flow, shoppers land on the dashboard. */}
									<a
										href={
											storeConfig.language
												? `/account?lang=${encodeURIComponent(storeConfig.language)}`
												: "/account"
										}
										aria-label="Account"
										className="p-2 hover:text-foreground transition-colors"
									>
										<UserIcon className="h-5 w-5" />
									</a>
									<button
										type="button"
										aria-label="Wishlist"
										className="hidden md:inline-flex p-2 hover:text-foreground transition-colors"
									>
										<HeartIcon className="h-5 w-5" />
									</button>
									<ThemeToggle />
									<CartButton />
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

	return (
		// suppressHydrationWarning: next-themes sets the theme class on <html> before hydration.
		<html lang={lang} suppressHydrationWarning>
			<body
				className={`${inter.variable} ${display.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
			>
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
