import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { cacheLife } from "next/cache";
import { notFound } from "next/navigation";
import { ImageResponse } from "next/og";
import { try_ } from "safe-try";
import { commerce, getStoreSeo } from "@/lib/commerce";
import { CURRENCY, LOCALE } from "@/lib/constants";
import { formatMoney } from "@/lib/money";
import { isVideoUrl } from "@/lib/utils";

export const size = {
	width: 1200,
	height: 630,
};

export const contentType = "image/png";
export const alt = "";

const productGetCached = async (slug: string) => {
	"use cache";
	cacheLife("minutes");
	const [error, product] = await try_(commerce.productGet({ idOrSlug: slug }));
	return error ? null : product;
};

export default async function Image(props: { params: Promise<{ slug: string }> }) {
	const { slug } = await props.params;
	const geistRegular = readFile(join(process.cwd(), "app/product/[slug]/Geist-Regular.ttf"));

	const product = await productGetCached(slug);
	if (!product) {
		notFound();
	}

	const { storeName } = await getStoreSeo();
	const image = product.images.find((url) => !isVideoUrl(url));
	const minPrice = product.variants
		.map((v) => BigInt(v.price))
		.reduce<bigint | null>((min, price) => (min === null || price < min ? price : min), null);

	return new ImageResponse(
		<div
			style={{ fontFamily: "Geist" }}
			tw="bg-neutral-100 w-full h-full flex flex-row items-stretch justify-center"
		>
			{image && (
				<div tw="flex-1 flex justify-center items-center">
					<div
						style={{
							backgroundImage: `url(${image})`,
							backgroundSize: "600px 630px",
							backgroundPosition: "center center",
							width: "600px",
							height: "630px",
							display: "flex",
						}}
					/>
				</div>
			)}
			<div tw="flex-1 flex flex-col items-center justify-center border-l border-neutral-200">
				<div tw="w-full mt-8 text-left px-16 font-normal text-4xl">{storeName}</div>
				<div tw="flex-1 -mt-8 flex flex-col items-start justify-center px-16">
					<p tw="font-black text-5xl mb-0">{product.name}</p>
					{minPrice !== null && (
						<p tw="font-normal text-neutral-800 mt-0 text-3xl">
							{formatMoney({ amount: minPrice, currency: CURRENCY, locale: LOCALE })}
						</p>
					)}
					<p tw="font-normal text-xl max-h-28">{product.summary || ""}</p>
				</div>
			</div>
		</div>,
		{
			...size,
			fonts: [
				{
					name: "Geist",
					data: await geistRegular,
					style: "normal",
					weight: 400,
				},
			],
		},
	);
}
