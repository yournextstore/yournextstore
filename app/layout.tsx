import "@/app/globals.css";

import { UserRound } from "lucide-react";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { Fraunces, Inter } from "next/font/google";
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

const fraunces = Fraunces({
	variable: "--font-fraunces",
	subsets: ["latin"],
	axes: ["SOFT", "opsz"],
});

const inter = Inter({
	variable: "--font-inter",
	subsets: ["latin"],
});

async function getStoreMetadata(): Promise<Metadata> {
	"use cache";
	cacheLife("hours");
	const me = await meGetCached();
	const storeName = me.store.name || "Your Next Store";
	const storeDescription =
		me.store.settings?.storeDescription || "Cuddly characters & playful gifts to love forever.";
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

function YnsWordmark() {
	return (
		<Link href="/" className="group inline-flex flex-col items-center text-foreground">
			<span className="flex items-center gap-2">
				<svg
					aria-hidden="true"
					width="34"
					height="34"
					viewBox="0 0 64 64"
					className="text-[var(--color-mint-deep)] wiggle-on-hover"
				>
					<title>Your Next Store mascot</title>
					<ellipse cx="32" cy="40" rx="20" ry="18" fill="currentColor" opacity="0.18" />
					<circle cx="32" cy="34" r="16" fill="#fff" stroke="currentColor" strokeWidth="2.2" />
					<ellipse cx="22" cy="15" rx="4.2" ry="9" fill="#fff" stroke="currentColor" strokeWidth="2.2" />
					<ellipse cx="42" cy="15" rx="4.2" ry="9" fill="#fff" stroke="currentColor" strokeWidth="2.2" />
					<ellipse cx="22" cy="16" rx="1.4" ry="3.6" fill="#f4c9c0" />
					<ellipse cx="42" cy="16" rx="1.4" ry="3.6" fill="#f4c9c0" />
					<circle cx="26" cy="32" r="2" fill="#1f2a30" />
					<circle cx="38" cy="32" r="2" fill="#1f2a30" />
					<path
						d="M28 38c1.5 1.5 6.5 1.5 8 0"
						stroke="#1f2a30"
						strokeWidth="1.6"
						strokeLinecap="round"
						fill="none"
					/>
					<ellipse cx="32" cy="36" rx="1.6" ry="1" fill="#f4c9c0" />
				</svg>
				<span
					className="font-heading text-2xl font-semibold leading-none tracking-tight"
					style={{ fontVariationSettings: "'SOFT' 100" }}
				>
					Your Next Store
				</span>
			</span>
			<span className="mt-0.5 text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
				London · Est. 2024
			</span>
		</Link>
	);
}

function AnnouncementBar() {
	return (
		<div
			className="bg-ink text-cream text-center text-xs sm:text-sm py-2 px-4"
			style={{ background: "#1f2a30", color: "#fdf7f1" }}
		>
			<span className="inline-flex items-center gap-3">
				<span aria-hidden="true">✦</span>
				<span>Spring Jellies have landed — free shipping on orders over $60</span>
				<Link href="/newsletter" className="underline underline-offset-4 hover:text-[var(--color-blush)]">
					sign up today
				</Link>
				<span aria-hidden="true">✦</span>
			</span>
		</div>
	);
}

async function CartProviderWrapper({ children }: { children: React.ReactNode }) {
	// Only cached reads here. Awaiting anything request-time (cookies, headers) would take the
	// header, nav and footer out of the prerendered shell; CartProvider loads the cart in the
	// browser. No <Suspense> around this component either: the boundary itself streams the
	// chrome out of the shell, whether or not anything inside it is request-time.
	const [links, storeConfig] = await Promise.all([getNavLinks(), getStoreConfig()]);

	return (
		<StoreConfigProvider value={storeConfig}>
			<CartProvider>
				<div className="flex min-h-screen flex-col">
					<header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
						<AnnouncementBar />
						<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
							<div className="grid grid-cols-3 items-center h-20">
								<div className="flex items-center">
									<div className="hidden sm:flex items-center w-full max-w-xs">
										<Suspense>
											<SearchInput />
										</Suspense>
									</div>
								</div>
								<div className="flex justify-center">
									<YnsWordmark />
								</div>
								<div className="flex items-center justify-end gap-1 sm:gap-2">
									<Link
										href="/products"
										aria-label="Wishlist"
										className="hidden sm:inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground hover:bg-[var(--color-mint-soft)] transition-colors"
									>
										<svg
											width="20"
											height="20"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="1.8"
											strokeLinecap="round"
											strokeLinejoin="round"
											aria-hidden="true"
										>
											<title>Wishlist</title>
											<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
										</svg>
									</Link>
									<ThemeToggle />
									{/* Plain <a>: /account is a proxied zone, and soft navigation into it 500s (see AGENTS.md).
									    Static on purpose: reading the session here would pull the header out of the prerendered shell. */}
									<a
										href={
											storeConfig.language
												? `/account?lang=${encodeURIComponent(storeConfig.language)}`
												: "/account"
										}
										aria-label="Account"
										className="inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground hover:bg-[var(--color-blush-soft)] transition-colors"
									>
										<UserRound className="h-5 w-5" aria-hidden="true" />
									</a>
									<CartButton />
								</div>
							</div>
							<div className="h-12 hidden md:flex items-center justify-center">
								<Suspense>
									<Navbar links={links} />
								</Suspense>
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
			<body className={`${fraunces.variable} ${inter.variable} antialiased`}>
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
