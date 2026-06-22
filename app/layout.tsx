import "@/app/globals.css";

import { MapPinIcon, MenuIcon, TagIcon, UserRoundIcon } from "lucide-react";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
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
import { MobileSearchInput } from "@/components/search/mobile-search-input";
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
});

const jakarta = Plus_Jakarta_Sans({
	variable: "--font-jakarta",
	subsets: ["latin"],
	weight: ["500", "600", "700", "800"],
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

function YnsLogo() {
	return (
		<Link href="/" className="flex items-center gap-2">
			<span className="flex h-9 w-9 items-center justify-center rounded-full bg-mint-gradient ring-1 ring-mint-deep/10">
				<svg
					viewBox="0 0 24 24"
					fill="none"
					aria-hidden="true"
					className="h-5 w-5 text-[color:var(--mint-deep)]"
				>
					<path
						d="M7 4h10a3 3 0 0 1 3 3v3l-4 4-3-3-4 4-2-2-3 3V7a3 3 0 0 1 3-3Z"
						stroke="currentColor"
						strokeWidth="1.8"
						strokeLinejoin="round"
					/>
					<path d="M5 13l3-3 2 2 4-4 3 3 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
				</svg>
			</span>
			<span className="font-display text-lg font-bold tracking-tight text-foreground">Your Next Store</span>
		</Link>
	);
}

function AnnouncementBar() {
	return (
		<div className="hidden bg-[color:var(--mint-deep)] text-[color:var(--mint-soft)] sm:block">
			<div className="mx-auto flex h-9 max-w-7xl items-center justify-between px-4 text-xs sm:px-6 lg:px-8">
				<div className="flex items-center gap-6">
					<span className="flex items-center gap-1.5">
						<span className="inline-block h-1.5 w-1.5 rounded-full bg-[color:var(--mint)]" />
						Free same-day delivery on orders over $35
					</span>
					<span className="hidden text-mint-soft/70 md:inline">Licensed pharmacy · 100% genuine</span>
				</div>
				<div className="flex items-center gap-5 text-mint-soft/80">
					<Link href="/faq" className="hover:text-white transition-colors">
						Help center
					</Link>
					<span className="hidden md:inline">EN · USD</span>
				</div>
			</div>
		</div>
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
					<header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-xl">
						<AnnouncementBar />
						<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
							<div className="flex h-16 items-center gap-4 sm:gap-6">
								<YnsLogo />
								<button
									type="button"
									className="hidden h-10 items-center gap-2 rounded-full border border-border/70 bg-secondary/40 pl-3 pr-4 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary md:inline-flex"
								>
									<MapPinIcon className="h-3.5 w-3.5 text-[color:var(--mint-deep)]" />
									<span className="leading-tight text-left">
										<span className="block text-[10px] uppercase tracking-wide text-muted-foreground/70">
											Deliver to
										</span>
										<span className="block text-[12px] font-semibold text-foreground">New York</span>
									</span>
								</button>
								<div className="hidden flex-1 md:block">
									<Suspense>
										<SearchInput />
									</Suspense>
								</div>
								<Suspense>
									<Navbar links={links} />
								</Suspense>
								<div className="ml-auto flex items-center gap-1.5 md:ml-0">
									<Link
										href="/products"
										className="hidden h-9 items-center gap-1.5 rounded-full bg-[color:var(--peach)]/60 px-3 text-xs font-semibold text-foreground transition-colors hover:bg-[color:var(--peach)]/80 lg:inline-flex"
									>
										<TagIcon className="h-3.5 w-3.5" />
										Offers
									</Link>
									<CartButton />
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
										aria-label="Account"
										className="hidden h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground md:inline-flex"
									>
										<UserRoundIcon className="h-4 w-4" />
									</a>
									<button
										type="button"
										aria-label="Menu"
										className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground md:hidden"
									>
										<MenuIcon className="h-4 w-4" />
									</button>
								</div>
							</div>
							<div className="pb-3 md:hidden">
								<MobileSearchInput />
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

	// suppressHydrationWarning: next-themes sets the theme class on <html> before hydration.
	return (
		<html lang={lang} suppressHydrationWarning>
			<body className={`${inter.variable} ${jakarta.variable} antialiased`}>
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
