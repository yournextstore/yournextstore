import Image from "next/image";
import { YnsLink } from "../yns-link";

export function Hero() {
	return (
		<section className="relative isolate overflow-hidden">
			<div className="relative h-[78vh] min-h-[560px] w-full yns-hero-wash">
				<Image
					src="/scraped-0.jpg"
					alt=""
					fill
					priority
					sizes="100vw"
					className="object-cover object-center mix-blend-multiply opacity-90"
				/>
				<div
					aria-hidden="true"
					className="absolute inset-0"
					style={{
						background:
							"radial-gradient(ellipse at 50% 35%, rgba(245,241,235,0) 0%, rgba(168,156,140,0.25) 60%, rgba(59,58,51,0.35) 100%)",
					}}
				/>

				<div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col items-center justify-center px-4 text-center text-[#F5F1EB] sm:px-6 lg:px-8">
					<h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-light tracking-tight drop-shadow-[0_2px_24px_rgba(59,58,51,0.45)]">
						Dry Shampoo <em className="italic font-light">for Dogs</em>
					</h1>
					<p className="mt-5 max-w-md font-sans text-sm sm:text-base font-light tracking-wide text-[#F5F1EB]/95">
						The reason your dog doesn&apos;t smell like… dog.
					</p>
					<YnsLink
						prefetch={"eager"}
						href="/products"
						className="mt-9 inline-flex items-center justify-center border border-[#F5F1EB]/90 px-10 py-3 text-[11px] font-medium yns-letter-spacing-mid uppercase text-[#F5F1EB] transition-all hover:bg-[#F5F1EB] hover:text-[#3B3A33]"
					>
						Shop Now
					</YnsLink>
				</div>
			</div>
		</section>
	);
}
