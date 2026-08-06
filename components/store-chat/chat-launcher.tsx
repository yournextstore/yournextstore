"use client";

import { MessageCircle, X } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

// The panel (and the AI SDK with it) loads on first open — never in the initial bundle.
const ChatPanel = dynamic(() => import("./chat-panel").then((mod) => mod.ChatPanel));

export type StoreChatConfig = {
	assistantName: string | null;
	greeting: string | null;
	suggestedQuestions: string[];
	storeName: string;
	currency: string;
	locale: string;
};

export function StoreChatLauncher(config: StoreChatConfig) {
	const [open, setOpen] = useState(false);
	const [loaded, setLoaded] = useState(false);

	// `?chat=open` (admin preview link) expands the chat on load.
	useEffect(() => {
		if (new URLSearchParams(window.location.search).get("chat") === "open") {
			setOpen(true);
			setLoaded(true);
		}
	}, []);

	const toggle = () => {
		setLoaded(true);
		setOpen((value) => !value);
	};

	return (
		<>
			{loaded && <ChatPanel config={config} open={open} onClose={() => setOpen(false)} />}
			<button
				type="button"
				onClick={toggle}
				aria-label={open ? "Close chat" : `Chat with ${config.assistantName ?? config.storeName}`}
				className={cn(
					"fixed bottom-4 right-4 z-50 flex h-13 w-13 cursor-pointer items-center justify-center rounded-full bg-foreground text-background shadow-lg transition-transform hover:scale-105 active:scale-95",
					// On mobile the panel is full-screen and has its own Close button — the
					// launcher would sit right on top of the composer's send button.
					open && "hidden sm:flex",
				)}
			>
				{open ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
			</button>
		</>
	);
}
