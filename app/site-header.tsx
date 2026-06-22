import { Suspense } from "react";
import { CartButton } from "@/app/cart-button";
import { Navbar } from "@/app/navbar";
import { SearchInput } from "@/app/search-input";
import { YnsLink } from "@/components/yns-link";

function UserIcon() {
	return (
		<svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
			<circle cx="9" cy="6.5" r="3" stroke="currentColor" strokeWidth="1.2" />
			<path d="M3 16c.5-3 3-5 6-5s5.5 2 6 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
		</svg>
	);
}

function HeartIcon() {
	return (
		<svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
			<path
				d="M9 15.5S2.5 11.5 2.5 7.2A3.2 3.2 0 0 1 9 5.5a3.2 3.2 0 0 1 6.5 1.7C15.5 11.5 9 15.5 9 15.5z"
				stroke="currentColor"
				strokeWidth="1.2"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

export function SiteHeader() {
	return (
		<header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
			{/* Announcement bar */}
			<div className="bg-accent text-accent-foreground">
				<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-2 text-center text-[11px] tracking-[0.22em] uppercase font-medium">
					Complimentary shipping on orders over $250 — Returns within 30 days
				</div>
			</div>

			{/* Utility row */}
			<div className="border-b border-border/50">
				<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-9 flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
					<div className="hidden sm:flex items-center gap-5">
						<span>Edit by Your Next Store</span>
						<span className="w-px h-3 bg-border" />
						<span>Spring · 2026</span>
					</div>
					<div className="flex items-center gap-5">
						<button type="button" className="hover:text-foreground transition-colors hidden sm:inline">
							EN · USD
						</button>
						<span className="w-px h-3 bg-border hidden sm:inline-block" />
						<button type="button" className="hover:text-foreground transition-colors hidden sm:inline">
							Stores
						</button>
						<span className="w-px h-3 bg-border hidden sm:inline-block" />
						<button type="button" className="hover:text-foreground transition-colors">
							Help
						</button>
					</div>
				</div>
			</div>

			{/* Main nav row — centered serif logo */}
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-3 items-center h-[68px]">
					{/* Left: Categories */}
					<div className="flex items-center gap-6">
						<Suspense fallback={<div className="h-4" />}>
							<Navbar />
						</Suspense>
					</div>

					{/* Center: Serif logo */}
					<div className="flex justify-center">
						<YnsLink
							prefetch="eager"
							href="/"
							className="font-display text-[28px] sm:text-[32px] leading-none font-light tracking-[0.04em] text-foreground"
						>
							Your Next Store
						</YnsLink>
					</div>

					{/* Right: Icons */}
					<div className="flex items-center justify-end gap-1">
						<Suspense fallback={<div className="w-9 h-9" />}>
							<SearchInput />
						</Suspense>
						<button
							type="button"
							className="hidden sm:flex items-center justify-center w-9 h-9 hover:bg-accent/40 transition-colors"
							aria-label="Account"
						>
							<UserIcon />
						</button>
						<button
							type="button"
							className="hidden sm:flex items-center justify-center w-9 h-9 hover:bg-accent/40 transition-colors"
							aria-label="Wishlist"
						>
							<HeartIcon />
						</button>
						<CartButton />
					</div>
				</div>
			</div>
		</header>
	);
}
