"use client";

import { MessageCircle } from "lucide-react";
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

export function StoreChatLauncher({ badge, ...config }: StoreChatConfig & { badge?: React.ReactNode }) {
	const [open, setOpen] = useState(false);
	const [loaded, setLoaded] = useState(false);

	// `?chat=open` (admin preview link) expands the chat on load.
	useEffect(() => {
		if (new URLSearchParams(window.location.search).get("chat") === "open") {
			setOpen(true);
			setLoaded(true);
		}
	}, []);

	const openChat = () => {
		setLoaded(true);
		setOpen(true);
	};

	return (
		<>
			{loaded && <ChatPanel config={config} open={open} onClose={() => setOpen(false)} />}
			{/* Badge and launcher share one dock so they never overlap. The panel now
			    occupies this corner while open, so the whole dock steps aside. */}
			<div className={cn("fixed bottom-4 right-4 z-50 flex items-center gap-2", open && "hidden")}>
				{badge}
				<button
					type="button"
					onClick={openChat}
					aria-label={`Chat with ${config.assistantName ?? config.storeName}`}
					className="flex h-13 w-13 cursor-pointer items-center justify-center rounded-full bg-foreground text-background shadow-lg transition-transform hover:scale-105 active:scale-95"
				>
					<MessageCircle className="h-5 w-5" />
				</button>
			</div>
		</>
	);
}
