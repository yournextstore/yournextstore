import { Bricolage_Grotesque, Instrument_Sans } from "next/font/google";

const bricolage = Bricolage_Grotesque({
	subsets: ["latin"],
	weight: ["400", "600"],
	variable: "--font-bricolage",
});

const instrument = Instrument_Sans({
	subsets: ["latin"],
	weight: ["400", "500"],
	variable: "--font-instrument",
});

const subheadingAnnouncement = "lowercase text-[11px] font-medium";
const subheadingNav = "lowercase text-[12px] font-medium";

const fontClasses = `${bricolage.variable} ${instrument.variable}`;

export function StretchAnnouncementBar() {
	return (
		<div
			className={`${fontClasses} relative z-30 flex items-center justify-center bg-[#faf4f0] text-[#321e1e]`}
			style={{ height: 44, fontFamily: "var(--font-instrument), sans-serif" }}
		>
			<button
				type="button"
				aria-label="Previous"
				className="absolute left-5 grid h-8 w-8 place-items-center text-[#321e1e]/80 hover:text-[#321e1e]"
			>
				<svg viewBox="0 0 10 10" width="11" height="11" fill="none" aria-hidden="true">
					<path stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" d="M6 1 2 5m0 0 4 4M2 5h8" />
				</svg>
			</button>

			<p className={`${subheadingAnnouncement} text-center`}>
				New: discover the{" "}
				<a href="#" className="underline underline-offset-2 hover:no-underline">
					Super glow set
				</a>{" "}
				to sublime eyes and skin
			</p>

			<button
				type="button"
				aria-label="Next"
				className="absolute right-5 grid h-8 w-8 place-items-center text-[#321e1e]/80 hover:text-[#321e1e]"
			>
				<svg viewBox="0 0 10 10" width="11" height="11" fill="none" aria-hidden="true">
					<path stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" d="m4 1 4 4m0 0L4 9m4-4H0" />
				</svg>
			</button>
		</div>
	);
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
	return (
		<a href={href} className={`${subheadingNav} text-white/90 transition-colors hover:text-white`}>
			{children}
		</a>
	);
}

function IconButton({ label, children }: { label: string; children: React.ReactNode }) {
	return (
		<button
			type="button"
			aria-label={label}
			className="grid h-8 w-8 place-items-center text-white/90 transition-colors hover:text-white"
		>
			{children}
		</button>
	);
}

export function StretchHeader() {
	return (
		<header
			className={`${fontClasses} absolute left-0 right-0 top-0 z-20 grid grid-cols-[1fr_auto_1fr] items-center gap-6 px-6 lg:px-10`}
			style={{ height: 64, fontFamily: "var(--font-instrument), sans-serif" }}
		>
			<a href="/" className="text-white">
				<span className="sr-only">Stretch</span>
				<svg viewBox="0 0 381 49" height="20" width="auto" fill="none" aria-hidden="true" className="block">
					<path
						fill="currentColor"
						d="M331.01 47.199V1.29736H340.322V19.5269H371.207V1.29736H380.518V47.199H371.207V27.3957H340.322V47.199H331.01Z"
					/>
					<path
						fill="currentColor"
						d="M297.329 48.248C280.739 48.248 269.657 38.6743 269.657 24.248C269.657 9.82182 280.739 0.248047 297.329 0.248047C313.919 0.248047 325.001 8.64149 325.001 21.2972H315.558C315.099 12.9038 307.821 8.05133 297.329 8.05133C286.312 8.05133 278.968 14.0841 278.968 24.248C278.968 34.412 286.312 40.3792 297.329 40.3792C307.886 40.3792 315.165 35.5923 315.558 27.1989H325.001C325.001 39.8546 313.919 48.248 297.329 48.248Z"
					/>
					<path
						fill="currentColor"
						d="M238.27 47.199V9.10064H215.975V1.29736H269.942V9.10064H247.582V47.199H238.27Z"
					/>
					<path
						fill="currentColor"
						d="M168.093 47.199V1.29736H211.371V9.10064H177.404V20.2482H210.781V27.5269H177.404V39.3302H211.371V47.199H168.093Z"
					/>
					<path
						fill="currentColor"
						d="M108.984 47.199V1.29736H145.049C154.558 1.29736 159.804 6.41212 159.804 13.4285C159.804 20.7728 153.902 24.9695 145.049 24.9695H140.197C151.017 25.6908 155.279 32.2482 163.148 47.199H152C143.476 31.9203 141.377 27.7236 133.181 27.7236H118.23L118.295 47.199H108.984ZM118.23 20.117H142.754C148.197 20.117 150.492 18.1498 150.492 14.8056C150.492 10.74 148.131 8.9695 142.754 8.9695H118.164L118.23 20.117Z"
					/>
					<path
						fill="currentColor"
						d="M73.3664 47.199V9.10064H51.0713V1.29736H105.039V9.10064H82.6779V47.199H73.3664Z"
					/>
					<path
						fill="currentColor"
						d="M25.8799 48.248C10.2078 48.248 0.0438771 41.8874 0.240599 32.5103H9.94552C9.87994 36.9694 15.3881 40.3792 25.1586 40.3792C35.5849 40.4448 42.2078 38.6087 42.2078 33.8874C42.2078 22.7398 1.15863 34.412 1.15863 14.871C1.15863 5.49395 10.9291 0.248047 25.0931 0.248047C40.1094 0.248047 50.1422 6.41198 50.2734 15.9858H40.5685C40.634 11.4612 35.3226 8.1169 25.7488 8.05133C16.3717 8.05133 10.6013 9.88739 10.6013 14.1497C10.6013 24.3136 51.5849 13.4284 51.5849 33.5595C51.5849 42.9366 41.1586 48.248 25.8799 48.248Z"
					/>
				</svg>
			</a>

			<nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
				<NavLink href="#">Shop</NavLink>
				<NavLink href="#">Learn</NavLink>
				<NavLink href="#">Journal</NavLink>
				<NavLink href="#">Theme</NavLink>
			</nav>

			<div className="flex items-center justify-end gap-3">
				<button
					type="button"
					aria-label="Change country or currency"
					className={`${subheadingNav} hidden items-center gap-2 text-white/90 transition-colors hover:text-white md:inline-flex`}
				>
					<span className="inline-block h-3.5 w-5 overflow-hidden rounded-[1px]">
						<svg viewBox="0 0 3 2" preserveAspectRatio="none" className="h-full w-full">
							<rect width="1" height="2" x="0" fill="#0055A4" />
							<rect width="1" height="2" x="1" fill="#fff" />
							<rect width="1" height="2" x="2" fill="#EF4135" />
						</svg>
					</span>
					EUR €
					<svg viewBox="0 0 10 9" width="9" height="9" fill="none" aria-hidden="true">
						<path stroke="currentColor" strokeWidth="1.5" d="m1 2.5 4 4 4-4" />
					</svg>
				</button>
				<IconButton label="Account">
					<svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true">
						<circle cx="8" cy="6" r="3" stroke="currentColor" strokeWidth="1.4" />
						<path
							d="M2.5 14.5c.8-2.8 3-4 5.5-4s4.7 1.2 5.5 4"
							stroke="currentColor"
							strokeWidth="1.4"
							strokeLinecap="round"
						/>
					</svg>
				</IconButton>
				<IconButton label="Search">
					<svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true">
						<circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.4" />
						<path d="m11 11 3.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
					</svg>
				</IconButton>
				<IconButton label="Cart">
					<svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true">
						<path d="M3 5h10l-1 9H4L3 5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
						<path
							d="M6 5V3.5a2 2 0 0 1 4 0V5"
							stroke="currentColor"
							strokeWidth="1.4"
							strokeLinecap="round"
						/>
					</svg>
				</IconButton>
			</div>
		</header>
	);
}
