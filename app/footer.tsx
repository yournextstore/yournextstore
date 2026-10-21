import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { PaymentMethods } from "@/components/payment-methods";
import { getFooterData } from "@/lib/catalog";

export async function Footer() {
	const { storeName, tagline, shipping, links, legal, social, year } = await getFooterData();

	return (
		<footer className="relative z-[1] border-t border-line pb-10 pt-12">
			<div className="hs-wrap flex flex-wrap items-center justify-between gap-4 pb-6">
				<Link href="/" className="hs-display flex items-center gap-2 text-[1.3rem]">
					<BrandMark className="size-6 text-signal" />
					{storeName}
				</Link>
				<nav aria-label="Footer" className="-mx-2 flex flex-wrap gap-1">
					{links.map((link) => (
						<Link
							key={link.href}
							href={link.href}
							className="rounded-lg px-2.5 py-1.5 text-[0.84rem] text-muted-foreground transition-colors hover:bg-line-soft hover:text-foreground"
						>
							{link.label}
						</Link>
					))}
				</nav>
			</div>
			<div className="hs-wrap grid gap-6 border-t border-line pt-6 sm:grid-cols-[1fr_auto]">
				<div className="space-y-2">
					{tagline && <p className="max-w-[52ch] text-[0.92rem] text-muted-foreground">{tagline}</p>}
					{shipping && <p className="hs-kicker">→ {shipping}</p>}
					{(legal.length > 0 || social.length > 0) && (
						<ul className="hs-mono flex flex-wrap gap-x-4 gap-y-1 pt-1 text-[0.72rem] text-muted-foreground">
							{legal.map((page) => (
								<li key={page.href}>
									<Link href={page.href} className="hover:text-foreground hover:underline">
										{page.label}
									</Link>
								</li>
							))}
							{social.map((item) => (
								<li key={item.href}>
									<a href={item.href} className="hover:text-foreground hover:underline" rel="noopener">
										{item.label}
									</a>
								</li>
							))}
						</ul>
					)}
				</div>
				<div className="sm:justify-self-end">
					<PaymentMethods />
				</div>
			</div>
			<p className="hs-wrap hs-mono mt-6 flex flex-wrap justify-between gap-2 text-[0.7rem] text-faint">
				<span>
					© {year} {storeName}. All rights reserved.
				</span>
				<span>Every part, stated plainly.</span>
			</p>
		</footer>
	);
}
