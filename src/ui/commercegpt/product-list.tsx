"use client";

import type * as Commerce from "commerce-kit";
import Image from "next/image";
import { formatMoney } from "@/lib/utils";
import { YnsLink } from "@/ui/yns-link";

export const ProductList = ({ products }: { products: Commerce.MappedProduct[] }) => {
	return (
		<>
			<ul className="max-w-(--breakpoint-lg) grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
				{products.map((product, idx) => {
					return (
						<li key={product.id} className="group">
							<YnsLink href={`/product/${product.metadata.slug}`}>
								<article className="overflow-hidden rounded border bg-white">
									{product.images[0] && (
										<div className="aspect-square w-full overflow-hidden bg-neutral-100">
											<Image
												className="group-hover:rotate hover-perspective w-full bg-neutral-100 object-cover object-center transition-opacity group-hover:opacity-75"
												src={product.images[0]}
												width={768}
												height={768}
												loading={idx < 3 ? "eager" : "lazy"}
												priority={idx < 3}
												sizes="(max-width: 1024x) 100vw, (max-width: 1280px) 50vw, 700px"
												alt=""
											/>
										</div>
									)}
									<div className="p-4">
										<h2 className="text-lg font-semibold text-neutral-700">{product.name}</h2>
										<footer className="text-sm font-medium text-neutral-900">
											{product.default_price.unit_amount && (
												<p>
													{formatMoney({
														amount: product.default_price.unit_amount,
														currency: product.default_price.currency,
														locale: "en-US",
													})}
												</p>
											)}
										</footer>
									</div>
								</article>
							</YnsLink>
						</li>
					);
				})}
			</ul>
		</>
	);
};
