import { MainProductImage } from "@/ui/products/main-product-image";
import { Suspense } from "react";

export const ProductModel3D = async ({
	model3d,
	imageSrc,
}: {
	model3d: string;
	imageSrc?: string;
}) => {
	const { default: Spline } = await import("@splinetool/react-spline");

	return (
		<div>
			<Suspense
				fallback={
					imageSrc && (
						<MainProductImage
							className="w-full rounded-lg bg-neutral-100 object-cover object-center transition-opacity"
							src={imageSrc}
							loading="eager"
							priority
							alt=""
						/>
					)
				}
			>
				<Spline className="w-full object-cover object-center aspect-square" scene={model3d}>
					{imageSrc && (
						<MainProductImage
							className="w-full rounded-lg bg-neutral-100 object-cover object-center transition-opacity"
							src={imageSrc}
							loading="eager"
							priority
							alt=""
						/>
					)}
				</Spline>
			</Suspense>
		</div>
	);
};
