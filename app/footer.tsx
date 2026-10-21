import { cacheLife } from "next/cache";
import Link from "next/link";
import { PaymentMethods } from "@/components/payment-methods";
import { getStoreIdentity } from "@/lib/catalog";
import { commerce } from "@/lib/commerce";
import { fitDisplaySize } from "@/lib/display-type";

async function getFooterData() {
	"use cache";
	cacheLife("hours");
	const [identity, legal] = await Promise.all([
		getStoreIdentity(),
		commerce.legalPageBrowse().catch(() => ({ data: [] })),
	]);
	return { identity, legal: legal.data };
}

const link = "py-1 hover:underline hover:underline-offset-[3px]";

/** Help and account links on one hairline row, then the store's name as a giant wordmark. */
export async function Footer({ accountHref }: { accountHref: string }) {
	const { identity, legal } = await getFooterData();
	const wordmark = fitDisplaySize(identity.storeName, { maxPx: 420, budgetPx: 1376, vwBudget: 92 });

	return (
		<footer className="flex flex-col gap-6 overflow-clip border-t border-line px-4 pb-6 lg:px-8">
			<div className="flex flex-wrap items-start justify-between gap-4 pt-6 text-sm">
				<nav aria-label="Help" className="flex flex-wrap gap-x-6 gap-y-1">
					<Link href="/about" className={link}>
						About
					</Link>
					<Link href="/faq" className={link}>
						FAQ
					</Link>
					{identity.contactFormEnabled ? (
						<Link href="/contact" className={link}>
							Contact
						</Link>
					) : null}
					{identity.blogEnabled ? (
						<Link href="/blog" className={link}>
							Journal
						</Link>
					) : null}
					{legal.map((page) => (
						<Link key={page.id} href={`/legal${page.href}`} className={link}>
							{page.label}
						</Link>
					))}
				</nav>
				<nav aria-label="Shop" className="flex flex-wrap gap-x-6 gap-y-1">
					<Link href="/products" className={link}>
						Everything
					</Link>
					<Link href="/search" className={link}>
						Search
					</Link>
					{/* Plain <a>: /account is a proxied zone. */}
					<a href={accountHref} className={link}>
						Account
					</a>
				</nav>
			</div>
			<PaymentMethods className="opacity-90" />
			<p
				aria-hidden="true"
				style={{ fontSize: wordmark }}
				className="select-none whitespace-nowrap text-center font-display leading-[0.76]"
			>
				{identity.storeName}
			</p>
		</footer>
	);
}
