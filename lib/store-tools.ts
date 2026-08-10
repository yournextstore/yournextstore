import { meGetCached } from "@/lib/commerce";

type StoreSettings = NonNullable<Awaited<ReturnType<typeof meGetCached>>["store"]["settings"]>;
type StoreTool = keyof NonNullable<StoreSettings["enabledTools"]>;

/** True when the given store tool is switched on; false when disabled or the settings read fails. */
export async function isStoreToolEnabled(tool: StoreTool): Promise<boolean> {
	try {
		const me = await meGetCached();
		return Boolean(me.store.settings?.enabledTools?.[tool]);
	} catch {
		return false;
	}
}
