import "@/app/globals.css";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
<<<<<<< HEAD:app/layout.tsx
import { Suspense } from "react";
import { CartProvider } from "@/app/cart/cart-context";
import { CartSidebar } from "@/app/cart/cart-sidebar";
import { CartButton } from "@/app/cart-button";
import { Footer } from "@/app/footer";
import { Navbar } from "@/app/navbar";
import { SearchInput } from "@/app/search-input";
import { ErrorOverlayRemover, NavigationReporter } from "@/components/devtools";
import { ReferralBadge } from "@/components/referral-badge";
import { YnsLink } from "@/components/yns-link";
import { commerce, getStoreFaviconUrl, meGetCached } from "@/lib/commerce";
import { getCartCookieJson } from "@/lib/cookies";
import { StoreJsonLd } from "@/lib/json-ld";
=======
import { cookies } from "next/headers";
import Link from "next/link";
import { Suspense } from "react";
import { CartProvider } from "@/app/cart/cart-context";
import { CartSidebar } from "@/app/cart/cart-sidebar";
import { CartButton } from "@/app/cart-button";
import { Footer } from "@/app/footer";
import { Navbar } from "@/app/navbar";
import { commerce } from "@/lib/commerce";
import "@/app/globals.css";
import { ShoppingCartIcon } from "lucide-react";
>>>>>>> 74ad60e (feat: optimistic update):src/app/layout.tsx

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
	const me = await meGetCached();
	const storeName = me.store.settings?.storeName || "Your Next Store";
	const faviconUrl = getStoreFaviconUrl(me.store.settings) ?? "/logo.svg";

	return {
		title: storeName,
		description: me.store.settings?.storeDescription || "Your next e-commerce store",
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

async function CartProviderWrapper({ children }: { children: React.ReactNode }) {
	const { cart, cartId } = await getInitialCart();

	return (
		<CartProvider initialCart={cart} initialCartId={cartId}>
			<div className="flex min-h-screen flex-col">
				<header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="flex items-center justify-between h-16">
							<div className="flex items-center gap-8">
								<YnsLink prefetch={"eager"} href="/" className="text-xl font-bold">
									Your Next Store
								</YnsLink>
								<Navbar />
							</div>
							<div className="flex items-center gap-2">
								<Suspense>
									<SearchInput />
								</Suspense>
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

<<<<<<< HEAD:app/layout.tsx
export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const env = process.env.VERCEL_ENV || "development";

	return (
		<html lang="en">
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<Suspense>
					<StoreJsonLd />
				</Suspense>
				<Suspense>
					<CartProviderWrapper>{children}</CartProviderWrapper>
				</Suspense>
				{env === "development" && (
					<>
						<NavigationReporter />
						<ErrorOverlayRemover />
					</>
				)}
=======
async function getInitialCart() {
	const cookieStore = await cookies();
	const cartId = cookieStore.get("cartId")?.value;

	if (!cartId) {
		return { cart: null, cartId: null };
	}

	try {
		const cart = await commerce.cartGet({ cartId });
		return { cart: cart ?? null, cartId };
	} catch {
		return { cart: null, cartId };
	}
}

async function CartProviderWrapper({ children }: { children: React.ReactNode }) {
	const { cart, cartId } = await getInitialCart();

	const isStaging = process.env.YNS_API_KEY?.startsWith("sk-s-");
	const baseUrl =
		process.env.NEXT_PUBLIC_YNS_API_TENANT ?? (isStaging ? "https://yns.cx" : "https://yns.store");

	return (
		<CartProvider initialCart={cart} initialCartId={cartId}>
			<div className="flex min-h-screen flex-col">
				<header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="flex items-center justify-between h-16">
							<div className="flex items-center gap-8">
								<Link href="/" className="text-xl font-bold">
									Your Next Store
								</Link>
								<Navbar />
							</div>
							<Suspense fallback={<CartButtonFallback />}>
								<CartButton />
							</Suspense>
						</div>
					</div>
				</header>
				<div className="flex-1">
					<Suspense>{children}</Suspense>
				</div>
				<Footer />
			</div>
			<CartSidebar baseUrl={baseUrl} />
		</CartProvider>
	);
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<Suspense>
					<CartProviderWrapper>{children}</CartProviderWrapper>
				</Suspense>
>>>>>>> 74ad60e (feat: optimistic update):src/app/layout.tsx
			</body>
		</html>
	);
}
