import { meGetCached } from "@/lib/commerce";
import { StoreChatLauncher } from "./chat-launcher";

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
	const chat = settings?.enabledTools?.storeChat ? settings.storeChat : null;
	if (!me || !chat) {
		return null;
	}

	return (
		<StoreChatLauncher
			assistantName={chat.assistantName}
			greeting={chat.greeting}
			suggestedQuestions={chat.suggestedQuestions ?? []}
			storeName={me.store.name}
			currency={me.store.currency}
			locale={me.store.locale}
		/>
	);
}
