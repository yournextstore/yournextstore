import "@/app/globals.css";

import { UserRound } from "lucide-react";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { Geist_Mono, Inter } from "next/font/google";
import { getImageProps } from "next/image";
import Link from "next/link";
import { ThemeProvider } from "next-themes";
import { Suspense } from "react";
import { CartProvider } from "@/app/cart/cart-context";
import { CartSidebar } from "@/app/cart/cart-sidebar";
import { CartButton } from "@/app/cart-button";
import { Footer } from "@/app/footer";
import { DesktopNav, MobileNav, type NavMenu } from "@/app/navbar";
import { CookieConsent } from "@/components/cookie-consent";
import { ErrorOverlayRemover, NavigationReporter } from "@/components/devtools";
import { NewsletterDialog } from "@/components/newsletter-dialog";
import { SearchInput } from "@/components/search/search-input";
import { StoreChatSection } from "@/components/store-chat/store-chat-section";
import { StoreConfigProvider } from "@/components/store-config-provider";
import { Toaster } from "@/components/ui/sonner";
import { capitalize, getCatalogCategories, getStoreIdentity } from "@/lib/catalog";
import { commerce, getCanonicalUrl, getStoreFaviconUrl, meGetCached } from "@/lib/commerce";
import { StoreJsonLd } from "@/lib/json-ld";
import { getStoreConfig } from "@/lib/store-config";

const inter = Inter({
	variable: "--font-inter",
	subsets: ["latin", "latin-ext"],
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

async function getNavMenu(accountHref: string): Promise<NavMenu & { storeName: string; message: string }> {
	"use cache";
	cacheLife("hours");
	const [categories, collections, identity] = await Promise.all([
		getCatalogCategories(),
		commerce.collectionBrowse({ limit: 8 }).catch(() => ({ data: [] })),
		getStoreIdentity(),
	]);
	const categoryLinks = categories.map((category) => ({
		href: `/category/${category.slug}`,
		label: capitalize(category.name),
	}));
	const collectionLinks = collections.data.map((collection) => ({
		href: `/collection/${collection.slug}`,
		label: collection.name,
	}));
	const companyLinks = [
		{ href: "/about", label: "About" },
		{ href: "/faq", label: "FAQ" },
		...(identity.blogEnabled ? [{ href: "/blog", label: "Blog" }] : []),
		...(identity.contactFormEnabled ? [{ href: "/contact", label: "Contact" }] : []),
	];
	// Penny's mega menu splits a section into up to four columns; a long category list wraps
	// into a second column instead of running off the panel.
	const half = Math.ceil(categoryLinks.length / 2);
	const columns = [
		...(categoryLinks.length > 6
			? [
					{ title: "Categories", links: categoryLinks.slice(0, half) },
					{ title: "More categories", links: categoryLinks.slice(half) },
				]
			: categoryLinks.length > 0
				? [{ title: "Categories", links: categoryLinks }]
				: []),
		...(collectionLinks.length > 0 ? [{ title: "Collections", links: collectionLinks }] : []),
		{ title: "Company", links: companyLinks },
	];
	return {
		storeName: identity.storeName,
		message: identity.storeDescription ?? "Secure checkout and order tracking on every purchase",
		accountHref,
		columns,
		categories: categoryLinks,
		links: [...categoryLinks.slice(0, 2), { href: "/about", label: "About" }],
	};
}

async function CartProviderWrapper({ children }: { children: React.ReactNode }) {
	// Only cached reads here. Awaiting anything request-time (cookies, headers) would
	// take the header, nav and footer out of the prerendered shell and leave the page
	// blank until the server responds; CartProvider loads the cart in the browser. The
	// other half of the rule: no <Suspense> around this component either.
	const storeConfig = await getStoreConfig();
	// Static on purpose: reading the session here would pull the header out of the prerendered
	// shell. Guests get the sign-in flow, shoppers land on the dashboard.
	const accountHref = storeConfig.language
		? `/account?lang=${encodeURIComponent(storeConfig.language)}`
		: "/account";
	const menu = await getNavMenu(accountHref);

	return (
		<StoreConfigProvider value={storeConfig}>
			<CartProvider>
				<div className="flex min-h-screen flex-col">
					<header className="relative z-40 bg-white">
						<a
							href="#content"
							className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-white focus:px-3 focus:py-2"
						>
							Skip to content
						</a>
						{/* Top bar: Penny's currency · message · account row on gray-900. */}
						<div className="bg-gray-900">
							<div className="mx-auto flex h-10 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
								<p className="hidden text-sm font-medium text-white lg:block lg:flex-1">
									{storeConfig.currency.toUpperCase()}
								</p>
								<p className="min-w-0 flex-1 truncate text-center text-sm font-medium text-white lg:flex-[2] lg:px-6">
									{menu.message}
								</p>
								{/* Plain <a>: /account is a proxied zone — soft navigation 500s (see AGENTS.md). */}
								<div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
									<a href={accountHref} className="text-sm font-medium text-white hover:text-gray-100">
										Create an account
									</a>
									<span className="h-6 w-px bg-gray-600" aria-hidden="true" />
									<a href={accountHref} className="text-sm font-medium text-white hover:text-gray-100">
										Sign in
									</a>
								</div>
							</div>
						</div>

						<nav aria-label="Top" className="relative border-b border-gray-200 bg-white">
							<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
								<div className="flex h-16 items-center justify-between">
									<div className="hidden lg:flex lg:items-center">
										<Link href="/" className="text-lg font-extrabold tracking-tight text-gray-900">
											{menu.storeName}
										</Link>
									</div>
									<DesktopNav menu={menu} />

									{/* Mobile menu and search (below lg) */}
									<div className="flex flex-1 items-center gap-4 lg:hidden">
										<MobileNav menu={menu} />
										<Suspense>
											<SearchInput />
										</Suspense>
									</div>

									<Link
										href="/"
										className="max-w-[45vw] truncate text-lg font-extrabold tracking-tight text-gray-900 lg:hidden"
									>
										{menu.storeName}
									</Link>

									<div className="flex flex-1 items-center justify-end">
										<div className="flex items-center lg:ml-8">
											<div className="flex items-center space-x-8">
												<div className="hidden lg:flex">
													<Suspense>
														<SearchInput />
													</Suspense>
												</div>
												<a
													href={accountHref}
													className="-m-2 hidden p-2 text-gray-500 hover:text-gray-600 lg:block"
													aria-label="Account"
												>
													<UserRound className="h-6 w-6" aria-hidden="true" />
												</a>
											</div>
											<span
												className="invisible mx-4 h-6 w-px bg-gray-200 lg:visible lg:mx-6"
												aria-hidden="true"
											/>
											<CartButton />
										</div>
									</div>
								</div>
							</div>
						</nav>
					</header>
					<main id="content" className="flex-1">
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
			<body className={`${inter.variable} ${geistMono.variable} antialiased`}>
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
