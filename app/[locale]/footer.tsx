import { cacheLife } from "next/cache";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { commerce, getCommerce } from "@/lib/commerce";
import { getCachedTranslations, localePath } from "@/lib/translations";

async function FooterCollections({ locale, currency }: { locale: string; currency: string }) {
	"use cache";
	cacheLife("hours");

	const api = getCommerce({ lang: locale, currency });

	const [collections, t] = await Promise.all([
		api.collectionBrowse({ limit: 5 }),
		getCachedTranslations(locale, "Footer"),
	]);

	if (collections.data.length === 0) {
		return null;
	}

	return (
		<div>
			<h3 className="text-sm font-semibold text-foreground">{t("collections")}</h3>
			<ul className="mt-4 space-y-3">
				{collections.data.map((collection) => (
					<li key={collection.id}>
						<Link
							prefetch={true}
							href={localePath(locale, `/collection/${collection.slug}`)}
							className="text-sm text-muted-foreground hover:text-foreground transition-colors"
						>
							{collection.name}
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}

async function FooterLegalPages({ locale }: { locale: string }) {
	"use cache";
	cacheLife("hours");

	const [pages, t] = await Promise.all([commerce.legalPageBrowse(), getCachedTranslations(locale, "Footer")]);

	if (pages.data.length === 0) {
		return null;
	}

	return (
		<div>
			<h3 className="text-sm font-semibold text-foreground">{t("legal")}</h3>
			<ul className="mt-4 space-y-3">
				{pages.data.map((page) => (
					<li key={page.id}>
						<Link
							prefetch={true}
							href={localePath(locale, `/legal${page.path}`)}
							className="text-sm text-muted-foreground hover:text-foreground transition-colors"
						>
							{page.title}
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}

export async function Footer({ locale, currency }: { locale: string; currency: string }) {
	const t = await getTranslations({ locale, namespace: "Footer" });

	return (
		<footer className="border-t border-border bg-background">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="py-12 sm:py-16 flex flex-col sm:flex-row gap-8 sm:gap-16">
					{/* Brand */}
					<div className="sm:max-w-xs">
						<Link
							prefetch={true}
							href={localePath(locale, "/")}
							className="text-xl font-bold text-foreground"
						>
							{t("storeName")}
						</Link>
						<p className="mt-4 text-sm text-muted-foreground leading-relaxed">{t("storeDescription")}</p>
					</div>

					{/* Collections */}
					<FooterCollections locale={locale} currency={currency} />

					{/* Support */}
					<div>
						<h3 className="text-sm font-semibold text-foreground">{t("support")}</h3>
						<ul className="mt-4 space-y-3">
							<li>
								<Link
									prefetch={true}
									href={localePath(locale, "/faq")}
									className="text-sm text-muted-foreground hover:text-foreground transition-colors"
								>
									{t("faq")}
								</Link>
							</li>
						</ul>
					</div>

					{/* Legal */}
					<FooterLegalPages locale={locale} />
				</div>

				{/* Bottom bar */}
				<div className="py-6 border-t border-border">
					<p className="text-sm text-muted-foreground">
						{t("copyright", { year: new Date().getFullYear() })}
					</p>
				</div>
			</div>
		</footer>
	);
}
