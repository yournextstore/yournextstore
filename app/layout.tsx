import "@/app/globals.css";

import { MapPin, UserRound } from "lucide-react";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { Nunito, Sniglet } from "next/font/google";
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

const sniglet = Sniglet({
	variable: "--font-sniglet",
	subsets: ["latin"],
	weight: ["400", "800"],
	display: "swap",
});

const nunito = Nunito({
	variable: "--font-nunito",
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

function AnnouncementBar() {
	return (
		<div className="bg-[#a8b5a0] text-[#3a2418]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-center gap-2 text-center text-xs sm:text-sm font-medium tracking-wide">
				<MapPin className="h-3.5 w-3.5" aria-hidden />
				<span>Now in more stores! Find us near you</span>
			</div>
		</div>
	);
}

function StoreBadge() {
	return (
		<Link href="/" aria-label="Your Next Store" className="group inline-flex">
			<span className="relative flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full bg-[#fbf4e8] border-2 border-[#c99a5e] shadow-[0_8px_24px_-12px_rgba(74,44,26,0.4)] transition-transform group-hover:rotate-3">
				<svg viewBox="0 0 96 96" className="h-full w-full" aria-hidden>
					<defs>
						<path id="circle-text" d="M 48,48 m -34,0 a 34,34 0 1,1 68,0 a 34,34 0 1,1 -68,0" />
					</defs>
					<text
						fontFamily="var(--font-sniglet)"
						fontSize="9"
						fontWeight="800"
						fill="#4a2c1a"
						letterSpacing="1.2"
					>
						<textPath href="#circle-text" startOffset="2%">
							YOUR NEXT STORE · WHOLESOME SMALL-BATCH ·
						</textPath>
					</text>
					<g transform="translate(48 50)">
						<circle r="14" fill="#f5e6d3" stroke="#c99a5e" strokeWidth="1.5" />
						<path d="M -8 4 Q -4 -6 0 -4 Q 4 -6 8 4 Z" fill="#c99a5e" />
						<circle cx="-3" cy="-1" r="1.4" fill="#4a2c1a" />
						<circle cx="3" cy="-1" r="1.4" fill="#4a2c1a" />
						<path d="M -3 5 Q 0 7 3 5" stroke="#4a2c1a" strokeWidth="1.2" fill="none" strokeLinecap="round" />
					</g>
				</svg>
			</span>
		</Link>
	);
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
	// other half of the rule: no <Suspense> around this component either — the boundary
	// itself is what streams the chrome out of the shell, whether or not anything inside
	// it is request-time.
	const [links, storeConfig] = await Promise.all([getNavLinks(), getStoreConfig()]);

	return (
		<StoreConfigProvider value={storeConfig}>
			<CartProvider>
				<div className="flex min-h-screen flex-col bg-background">
					<AnnouncementBar />
					<header className="sticky top-0 z-50 bg-[#f5e6d3]/95 backdrop-blur-md border-b border-[#d9c1a3]/60">
						<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
							<div className="relative flex items-center justify-between h-20 sm:h-24">
								<div className="flex items-center gap-6">
									<Suspense>
										<Navbar links={links} />
									</Suspense>
								</div>
								<div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
									<StoreBadge />
								</div>
								<div className="flex items-center gap-2">
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
										className="p-2 hover:bg-secondary rounded-full transition-colors"
										aria-label="Account"
									>
										<UserRound className="w-6 h-6" />
									</a>
									<Link
										href="/products"
										className="hidden md:inline-flex items-center justify-center h-10 px-5 rounded-full bg-[#c99a5e] text-[#4a2c1a] text-xs sm:text-sm font-bold tracking-[0.18em] uppercase border-2 border-[#8b5e3c] shadow-[0_4px_0_0_#8b5e3c] hover:translate-y-[2px] hover:shadow-[0_2px_0_0_#8b5e3c] transition-all"
									>
										Where to Buy
									</Link>
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
			<body className={`${sniglet.variable} ${nunito.variable} font-body antialiased`}>
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
