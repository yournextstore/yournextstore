import { getTranslations } from "next-intl/server";
import { PrivacyPolicy } from "@ui/legal/privacy-policy";

export default async function ImprintPage() {
	const t = await getTranslations("Global.legal");

	return (
		<article className="pb-12">
			<h1 className="text-3xl font-bold leading-none tracking-tight text-foreground">
				{t("privacyPolicyLabel")}
			</h1>
			<PrivacyPolicy />
		</article>
	);
}
