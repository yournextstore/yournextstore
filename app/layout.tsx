import "@/app/globals.css";

import { Heart, ShoppingBag } from "lucide-react";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { Inter, Space_Grotesk } from "next/font/google";
import Link from "next/link";
import { ThemeProvider } from "next-themes";
import { Suspense } from "react";
import { CartProvider } from "@/app/cart/cart-context";
import { CartSidebar } from "@/app/cart/cart-sidebar";
import { CartButton } from "@/app/cart-button";
import { Footer } from "@/app/footer";
import { Navbar, type NavLink } from "@/app/navbar";
import { SearchInput } from "@/app/search-input";
import { AuthButton } from "@/components/auth-button";
import { CookieConsent } from "@/components/cookie-consent";
import { ErrorOverlayRemover, NavigationReporter } from "@/components/devtools";
import { NewsletterDialog } from "@/components/newsletter-dialog";
import { ThemeToggle } from "@/components/theme-toggle";
import { Toaster } from "@/components/ui/sonner";
import { AUTH_ENABLED } from "@/lib/auth-config";
import { commerce, getCanonicalUrl, getStoreFaviconUrl, meGetCached } from "@/lib/commerce";
import { getCartCookieJson } from "@/lib/cookies";
import { StoreJsonLd } from "@/lib/json-ld";

const inter = Inter({
	variable: "--font-display",
	subsets: ["latin"],
	weight: ["300", "400", "500", "600", "700", "900"],
});

const spaceGrotesk = Space_Grotesk({
	variable: "--font-body",
	subsets: ["latin"],
	weight: ["300", "400", "500", "600", "700"],
});

async function getStoreMetadata(): Promise<Metadata> {
	"use cache";
	cacheLife("hours");
	const me = await meGetCached();
	const storeName = me.store.name || "Your Next Store";
	const storeDescription = me.store.settings?.storeDescription || "Your next e-commerce store";
	const faviconUrl = getStoreFaviconUrl(me.store.settings) ?? "/logo.svg";
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
		alternates: {
			canonical: "/",
		},
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
			icon: [
				{ url: faviconUrl, sizes: "any", type: "image/svg+xml" },
				{ url: faviconUrl, sizes: "192x192", type: "image/png" },
			],
			apple: [{ url: faviconUrl, sizes: "180x180" }],
			shortcut: faviconUrl,
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

function CartButtonFallback() {
	return (
		<div className="w-5 h-5 opacity-20">
			<ShoppingBag className="w-5 h-5" />
		</div>
	);
}

async function getInitialCart() {
	const cartCookie = await getCartCookieJson();

	if (!cartCookie?.id) {
		return { cart: null, cartId: null };
	}

	try {
		const cart = await commerce.cartGet({ cartId: cartCookie.id });
		return { cart: cart ?? null, cartId: cartCookie.id };
	} catch {
		return { cart: null, cartId: cartCookie.id };
	}
}

async function getNavLinks(): Promise<NavLink[]> {
	"use cache";
	cacheLife("hours");
	const [collections, me] = await Promise.all([
		commerce.collectionBrowse({ limit: 5 }),
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
	const [{ cart, cartId }, links] = await Promise.all([getInitialCart(), getNavLinks()]);

	const isStaging = process.env.YNS_API_KEY?.startsWith("sk-s-");
	const baseUrl = isStaging ? "https://yns.cx" : "https://yns.store";

	return (
		<CartProvider initialCart={cart} initialCartId={cartId}>
			<div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 paper-bg transition-colors duration-300">
				<main className="w-full max-w-[1400px] border border-border relative overflow-hidden shadow-2xl bg-card backdrop-blur-sm">
					{/* Brutalist Grid Header */}
					<header className="grid grid-cols-12 grid-border-b h-16 md:h-20 items-center">
						{/* Logo */}
						<div className="col-span-4 md:col-span-3 h-full flex items-center px-6 grid-border-r">
							<Link href="/">
								<h1 className="font-display font-bold text-lg tracking-tighter uppercase">Sneakers</h1>
							</Link>
						</div>

						{/* Navigation - Hidden on mobile */}
						<nav className="hidden md:col-span-6 md:flex h-full items-center justify-center space-x-12 grid-border-r font-medium text-sm tracking-wide">
							<Navbar links={links} />
						</nav>

						{/* Empty space on mobile */}
						<div className="col-span-4 md:hidden h-full grid-border-r" />

						{/* Icons */}
						<div className="col-span-4 md:col-span-3 h-full flex items-center justify-end px-6 space-x-6">
							<Suspense>
								<SearchInput />
							</Suspense>
							{AUTH_ENABLED && <AuthButton />}
							<button type="button" aria-label="Favorites" className="hover:text-primary transition-colors">
								<Heart className="w-5 h-5" />
							</button>
							<Suspense fallback={<CartButtonFallback />}>
								<CartButton />
							</Suspense>
						</div>
					</header>

					{/* Page Content */}
					<div className="flex-1">{children}</div>

					{/* Footer */}
					<Footer />
				</main>
			</div>
			<CartSidebar baseUrl={baseUrl} />
			<ThemeToggle />
		</CartProvider>
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
	const env = process.env.VERCEL_ENV || "development";
	const lang = await getHtmlLang();

	return (
		<html lang={lang} className="scroll-smooth" suppressHydrationWarning>
			<body className={`${inter.variable} ${spaceGrotesk.variable} font-body antialiased`}>
				{/* DO NOT REMOVE / REORDER: required for GDPR + GTM Consent Mode v2. Must stay at top of <body>. */}
				<Suspense>
					<CookieConsent />
				</Suspense>
				<Suspense>
					<StoreJsonLd />
				</Suspense>
				<ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
					<Suspense fallback={null}>
						<CartProviderWrapper>{children}</CartProviderWrapper>
					</Suspense>
				</ThemeProvider>
				<Suspense>
					<NewsletterPopupSection />
				</Suspense>
				<Toaster richColors position="top-center" />
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
