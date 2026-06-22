"use client";

import { Menu, ShoppingBag, User, X } from "lucide-react";
import Link from "next/link";
import { Suspense, useState } from "react";
import { useCart } from "@/app/cart/cart-context";
import { MobileSearchInput } from "@/components/search/mobile-search-input";
import { SearchInput } from "@/components/search/search-input";
import { useStoreConfig } from "@/components/store-config-provider";

function AnnouncementBar() {
	return (
		<div className="bg-[#8b7355] text-white text-xs tracking-[0.15em] uppercase">
			<div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-8 h-10">
				<span className="flex items-center gap-2">
					<span>Free shipping</span>
					<span className="font-normal normal-case tracking-normal text-white/70">
						On all orders over $100
					</span>
				</span>
				<span className="hidden sm:inline text-white/40">|</span>
				<span className="hidden sm:flex items-center gap-2">
					<span>Hassle-free returns</span>
					<span className="font-normal normal-case tracking-normal text-white/70">
						30-day postage paid returns
					</span>
				</span>
			</div>
		</div>
	);
}

function MobileMenu({
	isOpen,
	onClose,
	collections,
}: {
	isOpen: boolean;
	onClose: () => void;
	collections: { id: string; name: string; slug: string }[];
}) {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-[60]">
			<button
				type="button"
				tabIndex={-1}
				aria-label="Close menu"
				className="absolute inset-0 bg-black/40"
				onClick={onClose}
			/>
			<div className="absolute left-0 top-0 bottom-0 w-80 bg-white shadow-xl">
				<div className="flex items-center justify-between p-4 border-b border-border">
					<span className="font-heading text-xl">Menu</span>
					<button type="button" onClick={onClose} className="p-1">
						<X className="w-5 h-5" />
					</button>
				</div>
				<div className="p-4 pb-0">
					<MobileSearchInput onNavigate={onClose} />
				</div>
				<nav className="p-4 space-y-1">
					<Link
						href="/"
						className="block py-3 text-sm tracking-wide uppercase text-foreground hover:text-accent transition-colors"
						onClick={onClose}
					>
						Home
					</Link>
					{collections.map((c) => (
						<Link
							key={c.id}
							href={`/collection/${c.slug}`}
							className="block py-3 text-sm tracking-wide uppercase text-foreground hover:text-accent transition-colors border-t border-border/50"
							onClick={onClose}
						>
							{c.name}
						</Link>
					))}
				</nav>
			</div>
		</div>
	);
}

export function SiteHeaderClient({
	collections,
}: {
	collections: { id: string; name: string; slug: string }[];
}) {
	const { itemCount, openCart } = useCart();
	const { language } = useStoreConfig();
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	return (
		<>
			<AnnouncementBar />
			<header className="sticky top-0 z-50 bg-white border-b border-border">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between h-16 lg:h-20">
						{/* Left: hamburger + search (mobile) / nav links (desktop) */}
						<div className="flex items-center gap-4 lg:gap-8 flex-1">
							<button
								type="button"
								className="lg:hidden p-1"
								onClick={() => setMobileMenuOpen(true)}
								aria-label="Open menu"
							>
								<Menu className="w-5 h-5" />
							</button>

							<nav className="hidden lg:flex items-center gap-6">
								<Link
									href="/"
									className="text-[11px] font-medium tracking-[0.15em] uppercase text-foreground hover:text-accent transition-colors"
								>
									Home
								</Link>
								{collections.map((collection) => (
									<Link
										key={collection.id}
										href={`/collection/${collection.slug}`}
										className="text-[11px] font-medium tracking-[0.15em] uppercase text-foreground hover:text-accent transition-colors"
									>
										{collection.name}
									</Link>
								))}
							</nav>
						</div>

						{/* Center: Logo */}
						<Link href="/" className="absolute left-1/2 -translate-x-1/2">
							<span className="font-heading text-2xl lg:text-3xl font-light tracking-wide text-foreground">
								Your Next Store
							</span>
						</Link>

						{/* Right: icons */}
						<div className="flex items-center gap-3 flex-1 justify-end">
							<Suspense>
								<SearchInput />
							</Suspense>
							{/* Plain <a>: /account is a proxied zone — soft navigation 500s (see AGENTS.md). */}
							<a
								href={language ? `/account?lang=${encodeURIComponent(language)}` : "/account"}
								className="hidden sm:block p-2 hover:text-accent transition-colors"
								aria-label="Account"
							>
								<User className="w-[18px] h-[18px]" />
							</a>
							<button
								type="button"
								onClick={openCart}
								className="p-2 hover:text-accent transition-colors relative"
								aria-label="Shopping cart"
							>
								<ShoppingBag className="w-[18px] h-[18px]" />
								{itemCount > 0 ? (
									<span className="absolute -top-0.5 -right-0.5 bg-accent text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-medium">
										{itemCount}
									</span>
								) : null}
							</button>
						</div>
					</div>
				</div>
			</header>

			<MobileMenu
				isOpen={mobileMenuOpen}
				onClose={() => setMobileMenuOpen(false)}
				collections={collections}
			/>
		</>
	);
}
