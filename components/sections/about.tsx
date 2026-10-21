import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { getLatestProducts, getStoreInfo } from "@/lib/catalog";
import { formatDate } from "@/lib/dates";
import { getStoreConfig } from "@/lib/store-config";

/** The template's closing pair: "About" copy on the left, a dated "Latest News" list on the right,
 *  here fed by the newest products in the catalog. */
export async function About() {
	const [info, latest, { locale }] = await Promise.all([
		getStoreInfo(),
		getLatestProducts(3),
		getStoreConfig(),
	]);
	return (
		<section id="about" className="uk-section bg-card">
			<div className="uk-container grid grid-cols-1 gap-10 lg:grid-cols-2">
				<div>
					<h2 className="mb-5 text-uk-h2 lg:text-[2rem]">About</h2>
					<div className="space-y-5 text-uk-sm leading-relaxed">
						{info.storeDescription && <p>{info.storeDescription}</p>}
						<p>
							{info.storeName} keeps the whole range in one catalog: browse by collection, compare prices at a
							glance and add to your cart straight from the list. Every product page shows what is in stock
							before you buy.
						</p>
						<p>
							Checkout is handled securely and every order can be followed from your account, from payment to
							delivery. If something is unclear, our FAQ answers the common questions.
						</p>
					</div>
					<p className="mt-5">
						<Link href="/about" className="uk-link-all">
							Read more
							<ChevronRightIcon aria-hidden className="size-3" strokeWidth={1.5} />
						</Link>
					</p>
				</div>
				<div>
					<h2 className="mb-5 text-uk-h2 lg:text-[2rem]">Latest arrivals</h2>
					<ul className="divide-y divide-border">
						{latest.map((product) => (
							<li key={product.id} className="py-[15px] first:pt-0">
								<p className="text-uk-xs text-muted-foreground">{formatDate(product.createdAt, locale)}</p>
								<h3 className="mt-[5px] text-uk-md">
									<Link href={`/product/${product.slug}`} className="text-foreground hover:text-primary">
										{product.name}
									</Link>
								</h3>
								{product.summary && <p className="mt-[5px] line-clamp-2 text-uk-sm">{product.summary}</p>}
							</li>
						))}
					</ul>
					<p className="mt-5">
						<Link href="/products" className="uk-link-all">
							See all products
							<ChevronRightIcon aria-hidden className="size-3" strokeWidth={1.5} />
						</Link>
					</p>
				</div>
			</div>
		</section>
	);
}
