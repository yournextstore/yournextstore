import { getTranslations } from "next-intl/server";
import { TermsOfService } from "@ui/legal/terms-of-service";

export default async function ImprintPage() {
	const t = await getTranslations("Global.legal");

	return (
		<article className="pb-12">
			<h1 className="text-3xl font-bold leading-none tracking-tight text-foreground">
				{t("termsOfServiceLabel")}
			</h1>
			<TermsOfService />
		</article>
	);
}
