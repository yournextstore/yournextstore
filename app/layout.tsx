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
import { Archivo, Inter } from "next/font/google";
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

async function getStoreMetadata(): Promise<Metadata> {
	"use cache";
	cacheLife("hours");
	const me = await meGetCached();
	const storeName = me.store.name || "Your Next Store";
	const storeDescription =
		me.store.settings?.storeDescription ||
		"Premium performance apparel engineered for movement, designed for life beyond the gym.";
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
		<YnsLink
			prefetch={"eager"}
			href="/"
			className="flex items-center gap-2 group"
			aria-label="Your Next Store"
		>
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
		</YnsLink>
	);
}

async function CartProviderWrapper({ children }: { children: React.ReactNode }) {
	const [{ cart, cartId }, links] = await Promise.all([getInitialCart(), getNavLinks()]);

	return (
		<CartProvider initialCart={cart} initialCartId={cartId}>
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
									<YnsLink href="/legal/sign-up" className="hover:text-foreground">
										Sign Up
									</YnsLink>
									<YnsLink href="/products" className="hover:text-foreground">
										Find a Store
									</YnsLink>
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
								<button
									type="button"
									aria-label="Account"
									className="p-2 hover:text-foreground transition-colors"
								>
									<UserIcon className="h-5 w-5" />
								</button>
								<button
									type="button"
									aria-label="Wishlist"
									className="hidden md:inline-flex p-2 hover:text-foreground transition-colors"
								>
									<HeartIcon className="h-5 w-5" />
								</button>
								{AUTH_ENABLED && <AuthButton />}
								<CartButton />
							</div>
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
			<body className={`${inter.variable} ${display.variable} antialiased bg-background text-foreground`}>
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
