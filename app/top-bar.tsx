import { LayoutGrid, Search } from "lucide-react";
import Link from "next/link";

const linkClass = "flex items-center gap-1 transition-colors hover:text-white";

/** The original's charcoal strip: a welcome line on the left, utility links on the right. */
export function TopBar({
	storeName,
	contactFormEnabled,
}: {
	storeName: string;
	contactFormEnabled: boolean;
}) {
	return (
		<div className="bg-topbar text-[11px] text-topbar-foreground md:text-xs">
			<div className="kara-container flex flex-col items-center gap-1 py-1.5 md:flex-row md:py-2.5">
				<p className="max-w-full truncate">
					Welcome to {storeName}. Thoughtfully chosen pieces for every day.
				</p>
				<ul className="hidden items-center gap-x-4 md:ml-auto md:flex">
					<li>
						<Link href="/about" className={linkClass}>
							About
						</Link>
					</li>
					<li>
						<Link href="/faq" className={linkClass}>
							Help
						</Link>
					</li>
					{contactFormEnabled && (
						<li>
							<Link href="/contact" className={linkClass}>
								Contact
							</Link>
						</li>
					)}
					<li className="lg:ml-6">
						<Link href="/products" className={linkClass}>
							<LayoutGrid className="h-3.5 w-3.5" aria-hidden="true" />
							All products
						</Link>
					</li>
					<li>
						<Link href="/search" className={linkClass}>
							<Search className="h-3.5 w-3.5" aria-hidden="true" />
							Search the shop
						</Link>
					</li>
				</ul>
			</div>
		</div>
	);
}
