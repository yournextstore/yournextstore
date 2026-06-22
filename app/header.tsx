import Link from "next/link";
import { Suspense } from "react";
import { CartButton } from "@/app/cart-button";
import { Navbar, type NavLink } from "@/app/navbar";
import { SearchInput } from "@/components/search/search-input";
import { ThemeToggle } from "@/components/theme-toggle";

export function Header({ links, auth }: { links: NavLink[]; auth: React.ReactNode }) {
	return (
		<header className="sticky top-0 z-50 bg-flame-bar text-[color:#fff8ec] shadow-[0_2px_0_0_rgba(0,0,0,0.08)]">
			<div className="mx-auto grid h-14 max-w-[1400px] grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 sm:h-16 sm:px-6 lg:px-10">
				{/* Left nav */}
				<div className="flex items-center gap-6">
					<Navbar links={links} />
					<Suspense>
						<SearchInput />
					</Suspense>
				</div>

				{/* Centered serif wordmark */}
				<Link
					href="/"
					className="justify-self-center font-display text-2xl font-bold tracking-[0.35em] text-[color:#fff8ec] sm:text-[28px]"
					aria-label="Your Next Store"
				>
					YOUR&nbsp;NEXT&nbsp;STORE
				</Link>

				{/* Right actions */}
				<div className="flex items-center justify-end gap-3 sm:gap-4">
					<Link
						href="/products"
						className="hidden h-9 items-center rounded-full bg-[color:#fff8ec] px-5 text-sm font-semibold text-[color:#0f2a3f] transition-transform hover:-translate-y-0.5 hover:bg-white sm:inline-flex"
					>
						Shop Now
					</Link>
					<ThemeToggle />
					{auth}
					<CartButton />
				</div>
			</div>
		</header>
	);
}
