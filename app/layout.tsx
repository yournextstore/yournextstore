import { ArrowRight, Menu, ShoppingCart } from "lucide-react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { Suspense } from "react";
import { CartProvider } from "@/app/cart/cart-context";
import { CartSidebar } from "@/app/cart/cart-sidebar";
import { CartButton } from "@/app/cart-button";
import { ErrorOverlayRemover, NavigationReporter } from "@/components/devtools";
import { commerce } from "@/lib/commerce";
import "@/app/globals.css";
import { getCartCookieJson } from "@/lib/cookies";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Tech Summit 2024 - Global Developer Conference",
	description:
		"Join 5000+ developers, designers, and creators for three days of future-forward talks. October 24-26, 2024 in San Francisco.",
};

function CartButtonFallback() {
	return (
		<div className="h-full flex items-center justify-center px-6">
			<ShoppingCart className="w-5 h-5 opacity-20" />
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

async function CartProviderWrapper({ children }: { children: React.ReactNode }) {
	const { cart, cartId } = await getInitialCart();

	const isStaging = process.env.YNS_API_KEY?.startsWith("sk-s-");
	const baseUrl = isStaging ? "https://yns.cx" : "https://yns.store";

	return (
		<CartProvider initialCart={cart} initialCartId={cartId}>
			{/* Grain Overlay */}
			<div className="grain-overlay" />

			<div className="min-h-screen flex flex-col border-x border-foreground/10 max-w-[1600px] mx-auto relative z-10">
				{/* Brutalist Navigation */}
				<nav className="grid grid-cols-2 md:grid-cols-12 border-b border-foreground/10 h-20 items-center">
					{/* Status Indicator */}
					<div className="col-span-1 md:col-span-3 h-full flex items-center px-6 border-r border-foreground/10 group cursor-pointer hover:bg-secondary/50 transition-colors">
						<span className="font-mono text-primary text-xs mr-4 tracking-widest">STATUS</span>
						<div className="relative w-8 h-8 border border-primary flex items-center justify-center animate-spin-slow">
							<div className="w-2 h-2 bg-primary" />
						</div>
						<span className="ml-3 font-bold text-sm tracking-widest group-hover:text-primary transition-colors">
							LIVE
						</span>
					</div>

					{/* Location & Date */}
					<div className="hidden md:flex col-span-5 h-full items-center px-6 border-r border-foreground/10 justify-between">
						<div className="flex flex-col">
							<span className="font-mono text-[10px] uppercase opacity-60">Location</span>
							<span className="text-sm font-bold">SAN FRANCISCO, CA</span>
						</div>
						<div className="flex flex-col text-right">
							<span className="font-mono text-[10px] uppercase opacity-60">Date</span>
							<span className="text-sm font-bold text-primary">OCT 24-26, 2024</span>
						</div>
					</div>

					{/* Next Event */}
					<Link
						href="#tickets"
						className="hidden md:flex col-span-2 h-full items-center justify-center border-r border-foreground/10 hover:bg-primary hover:text-white transition-colors cursor-pointer group"
					>
						<span className="font-mono text-xs uppercase tracking-widest">TICKETS</span>
						<ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
					</Link>

					{/* Cart Button */}
					<div className="hidden md:flex col-span-1 h-full items-center justify-center border-r border-foreground/10 hover:bg-secondary/50 transition-colors">
						<Suspense fallback={<CartButtonFallback />}>
							<CartButton />
						</Suspense>
					</div>

					{/* Menu Button */}
					<div className="col-span-1 md:col-span-1 h-full flex items-center justify-center cursor-pointer hover:bg-secondary/50 transition-colors relative overflow-hidden group">
						<Menu className="w-5 h-5 group-hover:scale-110 transition-transform" />
						<span className="ml-2 font-mono font-bold text-sm hidden sm:inline">MENU</span>
					</div>
				</nav>

				{/* Main Content */}
				<div className="flex-1">{children}</div>

				{/* Brutalist Footer */}
				<footer className="grid grid-cols-1 md:grid-cols-12 border-t border-foreground/10 py-8">
					<div className="col-span-1 md:col-span-4 px-6 md:px-12 flex items-center">
						<span className="font-bold text-lg tracking-tight">TECH SUMMIT 24</span>
					</div>
					<div className="col-span-1 md:col-span-8 px-6 md:px-12 flex flex-col md:flex-row justify-between items-center text-sm font-mono opacity-60 mt-4 md:mt-0">
						<div className="flex space-x-6">
							<span className="hover:text-primary transition-colors cursor-pointer">Instagram</span>
							<span className="hover:text-primary transition-colors cursor-pointer">Twitter</span>
							<span className="hover:text-primary transition-colors cursor-pointer">LinkedIn</span>
						</div>
						<div className="mt-4 md:mt-0">© 2024 Tech Summit Series. All rights reserved.</div>
					</div>
				</footer>
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
	const env = process.env.VERCEL_ENV || "development";

	return (
		<html lang="en">
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden`}>
				<Suspense fallback={null}>
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
