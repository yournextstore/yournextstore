import { Suspense } from "react";
import { CartButton } from "@/app/cart-button";
import { Navbar, type NavLink } from "@/app/navbar";
import { SearchInput } from "@/app/search-input";
import { AuthButton } from "@/components/auth-button";
import { YnsLink } from "@/components/yns-link";
import { AUTH_ENABLED } from "@/lib/auth-config";

export function SiteHeader({ links }: { links: NavLink[] }) {
	return (
		<header className="sticky top-0 z-50 border-b border-[#1F2A33]/10 bg-[#F5EFE6]/85 backdrop-blur-xl">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-3 items-center h-16">
					<div className="flex justify-start">
						<Navbar links={links} />
					</div>
					<div className="flex justify-center">
						<YnsLink
							prefetch={"eager"}
							href="/"
							className="headline-display text-[#1F2A33] text-base sm:text-lg tracking-[0.18em] leading-none flex items-center gap-2"
							aria-label="Your Next Store"
						>
							<span className="hidden sm:inline">YOUR NEXT STORE</span>
							<span className="sm:hidden">YNS</span>
						</YnsLink>
					</div>
					<div className="flex items-center justify-end gap-1">
						<Suspense>
							<SearchInput />
						</Suspense>
						{AUTH_ENABLED && <AuthButton />}
						<CartButton />
					</div>
				</div>
			</div>
		</header>
	);
}
