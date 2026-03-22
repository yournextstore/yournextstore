import { getTranslations } from "next-intl/server";

export async function About() {
	const t = await getTranslations("About");

	return (
		<section id="about" className="bg-secondary/30">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
				<div className="max-w-2xl mx-auto text-center">
					<h2 className="text-3xl sm:text-4xl font-medium tracking-tight text-foreground">{t("title")}</h2>
					<p className="mt-6 text-lg text-muted-foreground leading-relaxed">{t("paragraph1")}</p>
					<p className="mt-4 text-lg text-muted-foreground leading-relaxed">{t("paragraph2")}</p>
				</div>
			</div>
		</section>
	);
}
