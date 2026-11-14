import { cacheTag } from "next/cache";
import { type CacheKind, cacheKindTag } from "@/lib/change-signal";

/**
 * Labels the cached read it is called in with the kinds of data that read shows. The platform's
 * change signal (app/api/revalidate/route.ts) marks a kind stale, and every read carrying it is
 * refreshed on its next use. Call it right after "use cache", once per cached function that
 * fetches from the Store API.
 */
export const tagKinds = (...kinds: CacheKind[]) => cacheTag(...kinds.map(cacheKindTag));
