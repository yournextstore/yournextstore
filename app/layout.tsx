import "@/app/globals.css";

import { UserRound } from "lucide-react";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { Geist_Mono, Inter, Playfair_Display, Sora } from "next/font/google";
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

const body = Inter({
	variable: "--font-sans",
	subsets: ["latin"],
});

const display = Sora({
	variable: "--font-display",
	subsets: ["latin"],
	weight: ["700", "800"],
});

const italic = Playfair_Display({
	variable: "--font-italic",
	subsets: ["latin"],
	style: ["italic"],
	weight: ["500", "600"],
});

const mono = Geist_Mono({
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

function AnnouncementBar() {
	const items = [
		"Free shipping on orders over $40",
		"New flavor drop — Smoky Sesame is live",
		"12g protein • 0g added sugar • All plants",
		"Enter the giveaway — win a year of snacks",
	];
	const stream = [...items, ...items, ...items, ...items];
	return (
		<div className="border-b border-charcoal/15 bg-chili text-cream text-xs tracking-[0.18em] uppercase font-medium">
			<div className="flex overflow-hidden py-2.5">
				<div className="yns-marquee flex shrink-0 gap-12 whitespace-nowrap pr-12">
					{stream.map((item, i) => (
						<span key={`a-${i}`} className="inline-flex items-center gap-12">
							<span>{item}</span>
							<span aria-hidden className="text-cream/60">
								✦
							</span>
						</span>
					))}
				</div>
				<div className="yns-marquee flex shrink-0 gap-12 whitespace-nowrap pr-12" aria-hidden>
					{stream.map((item, i) => (
						<span key={`b-${i}`} className="inline-flex items-center gap-12">
							<span>{item}</span>
							<span className="text-cream/60">✦</span>
						</span>
					))}
				</div>
			</div>
		</div>
	);
}

function GiveawayTab() {
	return (
		<a
			href="#newsletter"
			className="fixed left-0 top-1/2 z-40 hidden -translate-y-1/2 items-center justify-center bg-chili px-2 py-6 text-cream shadow-[0_8px_24px_rgba(58,26,18,0.25)] transition-transform hover:translate-x-1 sm:flex"
		>
			<span className="giveaway-tab text-[11px] font-bold uppercase tracking-[0.28em]">
				Enter the Giveaway →
			</span>
		</a>
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
	// other half of the rule: no
	// <Suspense> around this component either — the boundary itself is what streams the
	// chrome out of the shell, whether or not anything inside it is request-time.
	const [links, storeConfig] = await Promise.all([getNavLinks(), getStoreConfig()]);

	return (
		<StoreConfigProvider value={storeConfig}>
			<CartProvider>
				<div className="flex min-h-screen flex-col bg-cream">
					<AnnouncementBar />
					<header className="sticky top-0 z-40 border-b border-charcoal/10 bg-cream/90 backdrop-blur-md">
						<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
							<div className="grid grid-cols-[1fr_auto_1fr] items-center h-16 sm:h-20 gap-4">
								<div className="flex items-center">
									<Link
										href="/"
										className="font-display text-2xl sm:text-3xl font-extrabold text-chili tracking-tight"
									>
										YOUR NEXT STORE
									</Link>
								</div>
								<div className="hidden md:flex justify-center">
									<Navbar links={links} />
								</div>
								<div className="flex items-center justify-end gap-1 sm:gap-2">
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
										className="p-2 text-charcoal hover:text-chili transition-colors"
										aria-label="Account"
									>
										<UserRound className="w-5 h-5" />
									</a>
									<div className="hidden sm:flex items-center gap-1 text-xs font-medium text-mahogany/80 px-3 py-1.5 rounded-full border border-charcoal/10">
										<span aria-hidden>🇨🇦</span>
										<span>USD&nbsp;$</span>
									</div>
									<CartButton />
								</div>
							</div>
							<div className="md:hidden pb-2">
								<Navbar links={links} />
							</div>
						</div>
					</header>
					<GiveawayTab />
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
				className={`${body.variable} ${display.variable} ${italic.variable} ${mono.variable} font-sans antialiased bg-cream text-charcoal`}
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
