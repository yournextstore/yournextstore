import { notFound } from "next/navigation";
import Image from "next/image";
import { type Metadata } from "next/types";
import { getLocale, getTranslations } from "next-intl/server";
import * as Commerce from "commerce-kit";
import { Markdown } from "@/ui/Markdown";
import { JsonLd, mappedProductToJsonLd } from "@/ui/JsonLd";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/ui/shadcn/breadcrumb";
import { AddToCartButton } from "@/ui/AddToCartButton";
import { cn, deslugify, formatMoney, formatProductName } from "@/lib/utils";
import { publicUrl } from "@/env.mjs";
import { YnsLink } from "@/ui/YnsLink";

export const generateMetadata = async ({
	params,
	searchParams,
}: {
	params: { slug: string };
	searchParams: { variant?: string };
}): Promise<Metadata> => {
	const variants = await Commerce.productGet({ slug: params.slug });

	const selectedVariant = searchParams.variant || variants[0]?.metadata.variant;
	const product = variants.find((variant) => variant.metadata.variant === selectedVariant);
	if (!product) {
		return notFound();
	}
	const t = await getTranslations("/product.metadata");

	const canonical = new URL(`${publicUrl}/product/${product.metadata.slug}`);
	if (selectedVariant) {
		canonical.searchParams.set("variant", selectedVariant);
	}

	const productName = formatProductName(product.name, product.metadata.variant);

	return {
		title: t("title", { productName }),
		description: product.description,
		// https://github.com/vercel/next.js/pull/65366
		alternates: { canonical: canonical.toString() },
	} satisfies Metadata;
};

export default async function SingleProductPage({
	params,
	searchParams,
}: {
	params: { slug: string };
	searchParams: { variant?: string };
}) {
	const variants = await Commerce.productGet({ slug: params.slug });
	const selectedVariant = searchParams.variant || variants[0]?.metadata.variant;
	const product = variants.find((variant) => variant.metadata.variant === selectedVariant);

	if (!product) {
		return notFound();
	}

	const t = await getTranslations("/product.page");
	const locale = await getLocale();

	const category = product.metadata.category;

	return (
		<article className="pb-12">
			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink
							asChild
							className="inline-flex min-h-12 min-w-12 items-center justify-center"
						>
							<YnsLink href="/">{t("allProducts")}</YnsLink>
						</BreadcrumbLink>
					</BreadcrumbItem>
					{category && (
						<>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								<BreadcrumbLink
									className="inline-flex min-h-12 min-w-12 items-center justify-center"
									asChild
								>
									<YnsLink href={`/category/${category}`}>{deslugify(category)}</YnsLink>
								</BreadcrumbLink>
							</BreadcrumbItem>
						</>
					)}
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage>{product.name}</BreadcrumbPage>
					</BreadcrumbItem>
					{selectedVariant && (
						<>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								<BreadcrumbPage>{deslugify(selectedVariant)}</BreadcrumbPage>
							</BreadcrumbItem>
						</>
					)}
				</BreadcrumbList>
			</Breadcrumb>

			<div className="mt-4 grid gap-4 lg:grid-cols-12">
				<div className="lg:col-span-5 lg:col-start-8">
					<h1 className="text-3xl font-bold leading-none tracking-tight text-foreground">
						{product.name}
					</h1>
					{product.default_price.unit_amount && (
						<p className="mt-2 text-2xl font-medium leading-none tracking-tight text-foreground/70">
							{formatMoney({
								amount: product.default_price.unit_amount,
								currency: product.default_price.currency,
								locale,
							})}
						</p>
					)}
				</div>

				<div className="lg:col-span-7 lg:row-span-3 lg:row-start-1">
					<h2 className="sr-only">{t("imagesTitle")}</h2>

					{product.images.map((image) => (
						<Image
							key={image}
							className="w-full rounded-lg bg-neutral-100 object-cover object-center transition-opacity"
							src={image}
							width={700}
							height={700}
							sizes="(max-width: 1024x) 100vw, (max-width: 1280px) 50vw, 700px"
							loading="eager"
							priority
							alt=""
						/>
					))}
				</div>

				<div className="grid gap-8 lg:col-span-5">
					<section>
						<h2 className="sr-only">{t("descriptionTitle")}</h2>
						<div className="prose text-secondary-foreground">
							<Markdown source={product.description || ""} />
						</div>
					</section>

					{variants.length > 1 && (
						<div className="grid gap-2">
							<p className="text-base font-medium" id="variant-label">
								{t("variantTitle")}
							</p>
							<ul role="list" className="grid grid-cols-4 gap-2" aria-labelledby="variant-label">
								{variants.map((variant) => {
									const isSelected = selectedVariant === variant.metadata.variant;
									return (
										variant.metadata.variant && (
											<li key={variant.id}>
												<YnsLink
													scroll={false}
													prefetch={true}
													href={`/product/${variant.metadata.slug}?variant=${variant.metadata.variant}`}
													className={cn(
														"flex cursor-pointer items-center justify-center gap-2 rounded-md border p-2 transition-colors hover:bg-neutral-100",
														isSelected && "border-black bg-neutral-50 font-medium",
													)}
													aria-selected={isSelected}
												>
													{deslugify(variant.metadata.variant)}
												</YnsLink>
											</li>
										)
									);
								})}
							</ul>
						</div>
					)}

					<AddToCartButton productId={product.id} />
				</div>
			</div>
			<JsonLd jsonLd={mappedProductToJsonLd(product)} />
		</article>
	);
}
