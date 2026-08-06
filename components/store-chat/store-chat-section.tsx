import { meGetCached } from "@/lib/commerce";
import { StoreChatLauncher } from "./chat-launcher";

type StoreChatSettings = {
	assistantName: string | null;
	greeting: string | null;
	suggestedQuestions: string[];
};

// Read the block defensively (`in`-narrowing, no casts): the widget ships ahead
// of the commerce-kit release that adds `settings.storeChat` to the types, and
// must stay dormant rather than break when the field is absent.
function readStoreChatSettings(settings: object): StoreChatSettings | null {
	if (!("storeChat" in settings) || !settings.storeChat || typeof settings.storeChat !== "object") {
		return null;
	}
	const chat = settings.storeChat;
	return {
		assistantName:
			"assistantName" in chat && typeof chat.assistantName === "string" ? chat.assistantName : null,
		greeting: "greeting" in chat && typeof chat.greeting === "string" ? chat.greeting : null,
		suggestedQuestions:
			"suggestedQuestions" in chat && Array.isArray(chat.suggestedQuestions)
				? chat.suggestedQuestions.filter((question): question is string => typeof question === "string")
				: [],
	};
}

/**
 * Store Chat mount point — dormant unless the platform says the module is on
 * (`enabledTools.storeChat` plus an active subscription; the platform nulls
 * `settings.storeChat` when the subscription lapses). Renders nothing otherwise,
 * so disabled stores ship zero widget bytes.
 *
 * Must live inside CartProvider: add-to-cart from chat uses the cart context.
 */
export async function StoreChatSection() {
	const me = await meGetCached().catch(() => null);
	const settings = me?.store.settings;
	const enabledTools = settings?.enabledTools;
	const enabled = !!enabledTools && "storeChat" in enabledTools && enabledTools.storeChat === true;
	const chat = enabled && settings ? readStoreChatSettings(settings) : null;
	if (!me || !chat) {
		return null;
	}

	return (
		<StoreChatLauncher
			assistantName={chat.assistantName}
			greeting={chat.greeting}
			suggestedQuestions={chat.suggestedQuestions}
			storeName={me.store.name}
			currency={me.store.currency}
			locale={me.store.locale}
		/>
	);
}
