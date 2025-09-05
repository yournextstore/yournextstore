import Image from "next/image";
import type { Metadata } from "next/types";
import { publicUrl } from "@/env.mjs";
import { getTranslations } from "@/i18n/server";
import { commerce } from "@/lib/commerce";
import StoreConfig from "@/store.config";
import { CategoryBox } from "@/ui/category-box";
import { ProductList } from "@/ui/products/product-list";
import { YnsLink } from "@/ui/yns-link";

export const metadata: Metadata = {
	alternates: { canonical: publicUrl },
};

export default async function Home() {
	try {
		// Load products from YNS using REST API (default behavior)
		const result = await commerce.product.browse({ first: 6 });
		const t = await getTranslations("/");

		const products = result.data || [];

		return (
			<main>
				<section className="rounded bg-neutral-100 py-8 sm:py-12">
					<div className="mx-auto grid grid-cols-1 items-center justify-items-center gap-8 px-8 sm:px-16 md:grid-cols-2">
						<div className="max-w-md space-y-4">
							<h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
								{t("hero.title")}
							</h2>
							<p className="text-pretty text-neutral-600">{t("hero.description")}</p>
							<YnsLink
								className="inline-flex h-10 items-center justify-center rounded-full bg-neutral-900 px-6 font-medium text-neutral-50 transition-colors hover:bg-neutral-900/90 focus:outline-hidden focus:ring-1 focus:ring-neutral-950"
								href={t("hero.link")}
							>
								{t("hero.action")}
							</YnsLink>
						</div>
						<Image
							alt="Cup of Coffee"
							loading="eager"
							priority={true}
							className="rounded"
							height={450}
							width={450}
							src="https://files.stripe.com/links/MDB8YWNjdF8xT3BaeG5GSmNWbVh6bURsfGZsX3Rlc3RfaDVvWXowdU9ZbWlobUIyaHpNc1hCeDM200NBzvUjqP"
							style={{
								objectFit: "cover",
							}}
							sizes="(max-width: 640px) 70vw, 450px"
						/>
					</div>
				</section>

				<ProductList products={products} />

				<section className="w-full py-8">
					<div className="grid gap-8 lg:grid-cols-2">
						{StoreConfig.categories.map(({ slug, image: src }) => (
							<CategoryBox key={slug} categorySlug={slug} src={src} />
						))}
					</div>
				</section>
			</main>
		);
	} catch (error) {
		console.error("Error in Home component:", error);
		const t = await getTranslations("/");

		// Fallback to empty products if YNS fails
		const products: never[] = [];

		return (
			<main>
				<section className="rounded bg-neutral-100 py-8 sm:py-12">
					<div className="mx-auto grid grid-cols-1 items-center justify-items-center gap-8 px-8 sm:px-16 md:grid-cols-2">
						<div className="max-w-md space-y-4">
							<h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
								{t("hero.title")}
							</h2>
							<p className="text-pretty text-neutral-600">{t("hero.description")}</p>
							<YnsLink
								className="inline-flex h-10 items-center justify-center rounded-full bg-neutral-900 px-6 font-medium text-neutral-50 transition-colors hover:bg-neutral-900/90 focus:outline-hidden focus:ring-1 focus:ring-neutral-950"
								href={t("hero.link")}
							>
								{t("hero.action")}
							</YnsLink>
						</div>
						<Image
							alt="Cup of Coffee"
							loading="eager"
							priority={true}
							className="rounded"
							height={450}
							width={450}
							src="https://files.stripe.com/links/MDB8YWNjdF8xT3BaeG5GSmNWbVh6bURsfGZsX3Rlc3RfaDVvWXowdU9ZbWlobUIyaHpNc1hCeDM200CBzvUjqP"
							style={{
								objectFit: "cover",
							}}
							sizes="(max-width: 640px) 70vw, 450px"
						/>
					</div>
				</section>

				<ProductList products={products} />

				<section className="w-full py-8">
					<div className="grid gap-8 lg:grid-cols-2">
						{StoreConfig.categories.map(({ slug, image: src }) => (
							<CategoryBox key={slug} categorySlug={slug} src={src} />
						))}
					</div>
				</section>
				<div className="text-center text-red-500 p-4">
					Error loading products: {error instanceof Error ? error.message : "Unknown error"}
					<br />
					<small>Check server logs for more details</small>
				</div>
			</main>
		);
	}
}
