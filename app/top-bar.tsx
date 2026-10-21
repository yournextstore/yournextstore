import Link from "next/link";
import { getStoreInfo } from "@/lib/catalog";

/** The original's navy announcement strip: a store fact (free-shipping threshold) or a plain invitation, socials on the right. */
export async function TopBar() {
	const { freeShipping, socialLinks, storeName } = await getStoreInfo();
	return (
		<div className="bg-navy text-page">
			<div className="mx-auto flex h-12 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
				<span className="hidden w-40 lg:block" aria-hidden="true" />
				<p className="min-w-0 truncate text-sm lg:flex-1 lg:text-center">
					{freeShipping ? (
						<>
							Free shipping on orders over{" "}
							<span className="underline decoration-alert decoration-wavy decoration-1 underline-offset-4">
								{freeShipping}
							</span>
						</>
					) : (
						<>
							Discover the{" "}
							<Link
								href="/products"
								className="underline decoration-[#ff4a50] decoration-wavy decoration-1 underline-offset-4"
							>
								full {storeName} range
							</Link>
						</>
					)}
				</p>
				{socialLinks.length > 0 ? (
					<ul className="flex w-40 shrink-0 items-center justify-end gap-4 text-xs font-medium uppercase tracking-wider">
						{socialLinks.slice(0, 4).map((social) => (
							<li key={social.href}>
								<a href={social.href} target="_blank" rel="noreferrer" className="hover:text-sky">
									{social.label}
								</a>
							</li>
						))}
					</ul>
				) : (
					<span className="hidden w-40 lg:block" aria-hidden="true" />
				)}
			</div>
		</div>
	);
}
