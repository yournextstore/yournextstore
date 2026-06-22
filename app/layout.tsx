import "@/app/globals.css";

import { MapPinIcon, MenuIcon, TagIcon, UserRoundIcon } from "lucide-react";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
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

function YnsLogo() {
	return (
		<YnsLink prefetch={"eager"} href="/" className="flex items-center gap-2">
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
		</YnsLink>
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
					<YnsLink prefetch={"eager"} href="/faq" className="hover:text-white transition-colors">
						Help center
					</YnsLink>
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

	return (
		<CartProvider initialCart={cart} initialCartId={cartId}>
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
								{AUTH_ENABLED && <AuthButton />}
							</div>
							<Suspense>
								<Navbar links={links} />
							</Suspense>
							<div className="ml-auto flex items-center gap-1.5 md:ml-0">
								<YnsLink
									href="/products"
									className="hidden h-9 items-center gap-1.5 rounded-full bg-[color:var(--peach)]/60 px-3 text-xs font-semibold text-foreground transition-colors hover:bg-[color:var(--peach)]/80 lg:inline-flex"
								>
									<TagIcon className="h-3.5 w-3.5" />
									Offers
								</YnsLink>
								<CartButton />
								<button
									type="button"
									aria-label="Account"
									className="hidden h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground md:inline-flex"
								>
									<UserRoundIcon className="h-4 w-4" />
								</button>
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
							<Suspense>
								<SearchInput />
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
			<body className={`${inter.variable} ${jakarta.variable} antialiased`}>
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
