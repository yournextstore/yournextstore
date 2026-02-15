import "@/app/globals.css";

import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { Suspense } from "react";
import { AnnouncementBar } from "@/app/announcement-bar";
import { CartProvider } from "@/app/cart/cart-context";
import { CartSidebar } from "@/app/cart/cart-sidebar";
import { CartButton } from "@/app/cart-button";
import { Footer } from "@/app/footer";
import { Navbar } from "@/app/navbar";
import { ErrorOverlayRemover, NavigationReporter } from "@/components/devtools";
import { ReferralBadge } from "@/components/referral-badge";
import { YnsLink } from "@/components/yns-link";
import { commerce } from "@/lib/commerce";
import { getCartCookieJson } from "@/lib/cookies";

const inter = Inter({
	variable: "--font-inter",
	subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
	variable: "--font-cormorant",
	subsets: ["latin"],
	weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
	title: "Your Next Store | Beauty & Skincare",
	description:
		"Discover clean, non-irritating beauty and skincare products. Free shipping on all U.S. orders $200+.",
};

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
				<AnnouncementBar />
				<header className="sticky top-0 z-50 border-b border-border/50 bg-background/90 backdrop-blur-lg">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="flex items-center justify-between h-16 sm:h-18">
							<div className="flex items-center gap-10">
								<YnsLink
									prefetch={"eager"}
									href="/"
									className="font-heading text-2xl sm:text-[1.65rem] font-semibold tracking-wide uppercase"
								>
									Your Next Store
								</YnsLink>
								<Navbar />
							</div>
							<div className="flex items-center gap-4">
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

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const env = process.env.VERCEL_ENV || "development";

	return (
		<html lang="en">
			<body className={`${inter.variable} ${cormorant.variable} font-sans antialiased`}>
				<Suspense>
					<CartProviderWrapper>{children}</CartProviderWrapper>
				</Suspense>
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
