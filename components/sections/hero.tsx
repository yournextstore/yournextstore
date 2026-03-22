import { ArrowRightIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function Hero() {
	const t = await getTranslations("Hero");

	return (
		<section className="relative overflow-hidden bg-secondary/30">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="py-16 sm:py-20 lg:py-28">
					<div className="max-w-2xl">
						<h1 className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-foreground">
							{t("title")}
						</h1>
						<p className="mt-6 text-lg sm:text-xl text-muted-foreground leading-relaxed">
							{t("description")}
						</p>
						<div className="mt-10 flex flex-col sm:flex-row gap-4">
							<Link
								prefetch={true}
								href="#products"
								className="inline-flex items-center justify-center gap-2 h-12 px-8 bg-foreground text-primary-foreground rounded-full text-base font-medium hover:bg-foreground/90 transition-colors"
							>
								{t("shopCollection")}
								<ArrowRightIcon className="h-4 w-4" />
							</Link>
							<Link
								prefetch={true}
								href="#about"
								className="inline-flex items-center justify-center gap-2 h-12 px-8 border border-border rounded-full text-base font-medium hover:bg-secondary transition-colors"
							>
								{t("ourStory")}
							</Link>
						</div>
					</div>
				</div>
			</div>
			{/* Subtle decorative element */}
			<div
				aria-hidden="true"
				className="absolute top-1/2 right-0 -translate-y-1/2 w-1/3 h-full bg-linear-to-l from-secondary/50 to-transparent pointer-events-none hidden lg:block"
			/>
		</section>
	);
}
