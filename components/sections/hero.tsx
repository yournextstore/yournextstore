import { ArrowRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import heroPhoto from "@/public/images/pexels/hero-accessories.jpg";

/** Split banner on the muted panel: headline + CTA on one half, a full-bleed photograph on the other. */
export function Hero({ storeName }: { storeName: string }) {
	return (
		<section className="mb-14 flex flex-col items-stretch bg-muted sm:h-[27rem] sm:flex-row">
			<div className="flex flex-col justify-center p-8 sm:basis-1/2 lg:p-16">
				<h1 className="pb-8 text-3xl leading-tight font-medium text-balance lg:text-5xl lg:leading-[1.5]">
					Welcome to {storeName}
				</h1>
				<div>
					<Button asChild>
						<Link href="/products">
							Explore products
							<ArrowRightIcon className="size-4" />
						</Link>
					</Button>
				</div>
			</div>
			<div className="relative order-first h-[22rem] w-full bg-tile sm:order-last sm:h-full sm:basis-1/2">
				<Image
					src={heroPhoto}
					alt=""
					fill
					priority
					placeholder="blur"
					sizes="(max-width: 720px) 100vw, 50vw"
					className="object-cover object-[50%_60%]"
				/>
			</div>
		</section>
	);
}
