import "@/app/globals.css";

import type { Metadata } from "next";
import { Jost } from "next/font/google";
import { Suspense } from "react";
import { CartProvider } from "@/app/cart/cart-context";
import { CartSidebar } from "@/app/cart/cart-sidebar";
import { CartButton } from "@/app/cart-button";
import { Footer } from "@/app/footer";
import { Navbar } from "@/app/navbar";
import { ErrorOverlayRemover, NavigationReporter } from "@/components/devtools";
import { MaterialIcon } from "@/components/icons/material-icon";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { ReferralBadge } from "@/components/referral-badge";
import { YnsLink } from "@/components/yns-link";
import { commerce } from "@/lib/commerce";
import { getCartCookieJson } from "@/lib/cookies";

const jost = Jost({
	variable: "--font-jost",
	subsets: ["latin"],
	weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
	title: "Cannabo - Premium CBD Products",
	description:
		"Premium CBD products derived from organic hemp. Lab-tested for purity and potency to support your daily wellness journey.",
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
				<header className="sticky top-0 z-50 bg-background-dark text-white">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="flex items-center justify-between h-20">
							<div className="flex items-center gap-8">
								<YnsLink prefetch={"eager"} href="/" className="flex items-center space-x-2 group">
									<MaterialIcon
										name="spa"
										className="text-primary text-4xl group-hover:rotate-12 transition-transform"
									/>
									<span className="text-2xl font-bold tracking-wide">Cannabo</span>
								</YnsLink>
								<Navbar />
							</div>
							<div className="flex items-center space-x-5">
								<YnsLink href="/search" className="flex items-center hover:text-primary transition-colors">
									<MaterialIcon name="search" />
									<span className="ml-1 hidden md:inline text-sm">Search</span>
								</YnsLink>
								<YnsLink href="/account" className="hover:text-primary transition-colors">
									<MaterialIcon name="person_outline" />
								</YnsLink>
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
		<html lang="en" className="dark">
			<head>
				<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
			</head>
			<body className={`${jost.variable} antialiased`}>
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
