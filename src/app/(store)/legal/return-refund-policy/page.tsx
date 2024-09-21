import { getTranslations } from "next-intl/server";
import { ReturnRefundPolicy } from "@ui/legal/return-refund-policy";

export default async function ImprintPage() {
	const t = await getTranslations("Global.legal");

	return (
		<article className="pb-12">
			<h1 className="text-3xl font-bold leading-none tracking-tight text-foreground">
				{t("returnRefundPolicyLabel")}
			</h1>
			<ReturnRefundPolicy />
		</article>
	);
}
