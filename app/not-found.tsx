import type { Metadata } from "next";
import Link from "next/link";
import { Divider } from "@/components/sections/home";

export const metadata: Metadata = {
	title: "Page Not Found",
	description:
		"This page doesn't exist or has been moved. Continue shopping to find what you're looking for.",
	robots: { index: false, follow: true },
};

/** The original's 404: a glowing brass numeral, the ◇ ornament, two buttons and a row of quiet links. */
export default function NotFound() {
	return (
		<div className="bar-masthead relative flex min-h-[70dvh] flex-1 flex-col items-center justify-center px-4 py-16 text-center">
			<div className="relative z-[1]">
				<p className="serif text-[3.5rem] font-bold leading-none text-gold [text-shadow:0_0_30px_rgba(201,162,39,0.3)]">
					404
				</p>
				<Divider className="my-6" />
				<h1 className="serif mb-4 text-[2rem] font-bold text-cream">Page Not Found</h1>
				<p className="mb-8 text-[1.0625rem] text-ink">
					The page you're looking for doesn't exist or has been moved.
				</p>
				<div className="flex flex-wrap justify-center gap-4">
					<Link href="/" className="btn btn-primary">
						Go home
					</Link>
					<Link href="/products" className="btn">
						Browse the shelf
					</Link>
				</div>
				<nav
					aria-label="Elsewhere"
					className="mx-auto mt-10 flex max-w-[300px] flex-wrap justify-center gap-6 border-t border-line-2 pt-6 sm:max-w-[400px]"
				>
					{[
						{ href: "/#shelf", label: "Shelf" },
						{ href: "/#space", label: "Gallery" },
						{ href: "/about", label: "About" },
						{ href: "/search", label: "Search" },
					].map((link) => (
						<Link
							key={link.href}
							href={link.href}
							className="caps text-[0.875rem] text-dim transition-colors hover:text-gold"
						>
							{link.label}
						</Link>
					))}
				</nav>
			</div>
		</div>
	);
}
