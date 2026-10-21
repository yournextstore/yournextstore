import Link from "next/link";
import { PaymentMethods } from "@/components/payment-methods";
import { getFooterData } from "@/lib/catalog";

const linkClass = "transition-colors hover:text-foreground";

/** The original's three-part footer: wordmark and line, small-caps links, socials and copyright. */
export async function Footer() {
	const { storeName, tagline, shipping, links, legal, social, year } = await getFooterData();

	return (
		<footer className="border-t border-hairline bg-[var(--footer)]">
			<div className="mx-auto flex max-w-[1400px] flex-col gap-12 px-6 py-16 md:flex-row md:items-end md:justify-between md:px-12 md:py-20">
				<div className="max-w-xs">
					<Link href="/" className="font-display text-2xl text-ink">
						{storeName}
					</Link>
					<p className="mt-3 text-sm leading-relaxed text-muted-foreground">
						{tagline ?? "Headphones and earphones for listening closely."}
					</p>
				</div>
				<nav
					aria-label="Footer"
					className="flex flex-wrap gap-x-10 gap-y-4 text-[12px] uppercase tracking-[0.18em] text-muted-foreground md:max-w-xl md:justify-center"
				>
					{links.map((link) => (
						<Link key={link.href} href={link.href} className={linkClass}>
							{link.label}
						</Link>
					))}
				</nav>
				<div className="flex flex-col gap-4 md:items-end">
					{social.length > 0 && (
						<ul className="flex flex-wrap gap-x-8 gap-y-2 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
							{social.map((item) => (
								<li key={item.href}>
									<a href={item.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
										{item.label}
									</a>
								</li>
							))}
						</ul>
					)}
					{shipping && (
						<p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{shipping}</p>
					)}
					<p className="text-[11px] text-muted-foreground">
						© {year} {storeName}. All rights reserved.
					</p>
				</div>
			</div>
			<div className="mx-auto flex max-w-[1400px] flex-col gap-4 border-t border-hairline px-6 py-6 sm:flex-row sm:items-center sm:justify-between md:px-12">
				<ul className="flex flex-wrap gap-x-6 gap-y-2 text-[11px] text-muted-foreground">
					{legal.map((page) => (
						<li key={page.href}>
							<Link href={page.href} className={linkClass}>
								{page.label}
							</Link>
						</li>
					))}
				</ul>
				<PaymentMethods />
			</div>
		</footer>
	);
}
