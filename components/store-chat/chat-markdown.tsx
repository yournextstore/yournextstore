"use client";

import { memo, useCallback } from "react";
import { defaultUrlTransform, Streamdown, type UrlTransform } from "streamdown";
import { cn } from "@/lib/utils";

/**
 * Assistant-bubble markdown. The text comes from a model whose context includes
 * merchant-authored "store knowledge" — semi-untrusted input — so rendering is
 * deliberately restrictive:
 *
 * - `defaultUrlTransform` first: it is what rejects `javascript:` and other
 *   unsafe schemes. Everything composes on top of it, never around it.
 * - Links: same-origin or relative only. A prompt-injected external URL (the
 *   classic exfiltration vector) renders as plain text, not a link.
 * - Images: dropped entirely. Product imagery reaches the shopper through the
 *   typed search-tool cards, never through model-emitted markdown.
 *
 * Streamdown's incomplete-markdown parsing matters here: replies stream and can
 * be cut off mid-`**` by the output-token cap without flashing raw markers.
 */
const useStorefrontUrlTransform = (): UrlTransform =>
	useCallback<UrlTransform>((url, key, node) => {
		const safe = defaultUrlTransform(url, key, node);
		if (safe == null) return safe;
		if (key !== "href") return null;
		if (safe.startsWith("/") || safe.startsWith("#")) return safe;
		try {
			return new URL(safe).origin === window.location.origin ? safe : null;
		} catch {
			return null;
		}
	}, []);

export const ChatMarkdown = memo(
	({ children, className }: { children: string; className?: string }) => {
		const urlTransform = useStorefrontUrlTransform();
		return (
			<Streamdown className={cn("chat-markdown", className)} urlTransform={urlTransform}>
				{children}
			</Streamdown>
		);
	},
	(prev, next) => prev.children === next.children && prev.className === next.className,
);
ChatMarkdown.displayName = "ChatMarkdown";
