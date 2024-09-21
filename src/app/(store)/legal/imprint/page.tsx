import { getTranslations } from "next-intl/server";
import { Imprint } from "@ui/legal/imprint";

export default async function ImprintPage() {
	const t = await getTranslations("Global.legal");

	return (
		<article className="pb-12">
			<h1 className="text-3xl font-bold leading-none tracking-tight text-foreground">
				{t("imprintLabel")}
			</h1>
			<Imprint />
		</article>
	);
}
