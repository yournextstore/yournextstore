import "@/app/globals.css";

import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { Fraunces, Inter } from "next/font/google";
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
import { ReferralBadge } from "@/components/referral-badge";
import { Toaster } from "@/components/ui/sonner";
import { YnsLink } from "@/components/yns-link";
import { AUTH_ENABLED } from "@/lib/auth-config";
import { commerce, getCanonicalUrl, getStoreFaviconUrl, meGetCached } from "@/lib/commerce";
import { getCartCookieJson } from "@/lib/cookies";
import { StoreJsonLd } from "@/lib/json-ld";

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

function YnsWordmark() {
	return (
		<YnsLink prefetch={"eager"} href="/" className="group inline-flex flex-col items-center text-foreground">
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
		</YnsLink>
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
				<YnsLink
					prefetch={"eager"}
					href="/newsletter"
					className="underline underline-offset-4 hover:text-[var(--color-blush)]"
				>
					sign up today
				</YnsLink>
				<span aria-hidden="true">✦</span>
			</span>
		</div>
	);
}

async function CartProviderWrapper({ children }: { children: React.ReactNode }) {
	const [{ cart, cartId }, links] = await Promise.all([getInitialCart(), getNavLinks()]);

	return (
		<CartProvider initialCart={cart} initialCartId={cartId}>
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
								<YnsLink
									prefetch={"eager"}
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
								</YnsLink>
								<YnsLink
									prefetch={"eager"}
									href="/products"
									aria-label="Account"
									className="hidden sm:inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground hover:bg-[var(--color-blush-soft)] transition-colors"
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
										<title>Account</title>
										<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
										<circle cx="12" cy="7" r="4" />
									</svg>
								</YnsLink>
								{AUTH_ENABLED && <AuthButton />}
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
				<div className="flex-1">{children}</div>
				<Footer />
				<ReferralBadge />
			</div>
			<CartSidebar />
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
		<html lang={lang}>
			<body className={`${fraunces.variable} ${inter.variable} antialiased`}>
				{/* DO NOT REMOVE / REORDER: required for GDPR + GTM Consent Mode v2. Must stay at top of <body>. */}
				<Suspense>
					<CookieConsent />
				</Suspense>
				<Suspense>
					<StoreJsonLd />
				</Suspense>
				<Suspense>
					<CartProviderWrapper>{children}</CartProviderWrapper>
				</Suspense>
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
