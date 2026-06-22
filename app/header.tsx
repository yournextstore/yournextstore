import { YnsLink } from "@/components/yns-link";

function CrestLogo() {
	return (
		<svg
			viewBox="0 0 64 64"
			xmlns="http://www.w3.org/2000/svg"
			aria-label="Your Next Store"
			className="h-10 w-10 text-[var(--brand-ink)]"
			role="img"
		>
			<title>Your Next Store crest</title>
			<g fill="currentColor">
				<ellipse cx="32" cy="9" rx="2" ry="3" />
				<ellipse cx="26" cy="11" rx="2" ry="3" transform="rotate(-15 26 11)" />
				<ellipse cx="38" cy="11" rx="2" ry="3" transform="rotate(15 38 11)" />
				<ellipse cx="22" cy="14" rx="2" ry="3" transform="rotate(-30 22 14)" />
				<ellipse cx="42" cy="14" rx="2" ry="3" transform="rotate(30 42 14)" />
				<path d="M16 22 Q32 14 48 22 L46 26 L18 26 Z" />
				<path d="M16 26 L48 26 L48 28 L16 28 Z" />
				<path d="M18 28 L46 28 L42 50 Q32 56 22 50 Z" />
				<rect x="20" y="32" width="2" height="14" rx="1" fill="var(--brand-cream)" />
				<rect x="25" y="32" width="2" height="14" rx="1" fill="var(--brand-cream)" />
				<rect x="30" y="32" width="2" height="14" rx="1" fill="var(--brand-cream)" />
				<rect x="35" y="32" width="2" height="14" rx="1" fill="var(--brand-cream)" />
				<rect x="40" y="32" width="2" height="14" rx="1" fill="var(--brand-cream)" />
				<path d="M14 54 L50 54 L48 58 L16 58 Z" />
			</g>
		</svg>
	);
}

type HeaderProps = {
	navbar: React.ReactNode;
	search: React.ReactNode;
	auth: React.ReactNode;
	cart: React.ReactNode;
};

export function Header({ navbar, search, auth, cart }: HeaderProps) {
	return (
		<header className="sticky top-0 z-40 border-b border-[var(--brand-ink)]/10 bg-[var(--brand-cream)]/95 backdrop-blur-md">
			<div className="mx-auto grid h-[68px] max-w-[1400px] grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 sm:px-6 lg:px-10">
				{/* Left nav */}
				<div className="flex items-center gap-7">
					<YnsLink
						href="/"
						prefetch={"eager"}
						className="font-mono-ed text-[11px] uppercase tracking-[0.22em] text-[var(--brand-ink)] underline decoration-[var(--brand-ink)] decoration-1 underline-offset-[6px]"
					>
						Home
					</YnsLink>
					<YnsLink
						href="/products"
						prefetch={"eager"}
						className="font-mono-ed text-[11px] uppercase tracking-[0.22em] text-[var(--brand-ink)]/80 transition-colors hover:text-[var(--brand-ember)]"
					>
						Shop
					</YnsLink>
					<div className="hidden md:block">{navbar}</div>
				</div>

				{/* Center logo */}
				<YnsLink
					href="/"
					prefetch={"eager"}
					className="flex flex-col items-center gap-0.5 text-[var(--brand-ink)]"
					aria-label="Your Next Store — Home"
				>
					<CrestLogo />
					<span className="font-wordmark text-[10px] uppercase tracking-[0.28em] leading-none">YNS</span>
				</YnsLink>

				{/* Right nav */}
				<div className="flex items-center justify-end gap-5">
					<YnsLink
						href="#about"
						prefetch={"eager"}
						className="hidden font-mono-ed text-[11px] uppercase tracking-[0.22em] text-[var(--brand-ink)]/80 transition-colors hover:text-[var(--brand-ember)] sm:inline-block"
					>
						About
					</YnsLink>
					<YnsLink
						href="#recipes"
						prefetch={"eager"}
						className="hidden font-mono-ed text-[11px] uppercase tracking-[0.22em] text-[var(--brand-ink)]/80 transition-colors hover:text-[var(--brand-ember)] sm:inline-block"
					>
						Recipes
					</YnsLink>
					<div className="ml-1 hidden md:block">{search}</div>
					{auth}
					{cart}
				</div>
			</div>
		</header>
	);
}
