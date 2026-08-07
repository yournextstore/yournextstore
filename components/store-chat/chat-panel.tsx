"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { ArrowUp, ChevronDown, Maximize2, Minimize2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { StoreChatConfig } from "./chat-launcher";
import { ChatMarkdown } from "./chat-markdown";
import { type ChatProduct, ChatProductCard } from "./chat-product-card";

function isChatProduct(value: unknown): value is ChatProduct {
	return (
		!!value &&
		typeof value === "object" &&
		"productId" in value &&
		"slug" in value &&
		"variants" in value &&
		Array.isArray(value.variants)
	);
}

function productsFromPart(part: UIMessage["parts"][number]): ChatProduct[] {
	if (part.type !== "tool-search_products" || !("state" in part) || part.state !== "output-available") {
		return [];
	}
	const output = "output" in part ? part.output : null;
	if (!output || typeof output !== "object" || !("products" in output)) {
		return [];
	}
	return Array.isArray(output.products) ? output.products.filter(isChatProduct) : [];
}

export function ChatPanel({
	config,
	open,
	onClose,
}: {
	config: StoreChatConfig;
	open: boolean;
	onClose: () => void;
}) {
	const transport = useMemo(() => new DefaultChatTransport({ api: "/api/chat" }), []);
	const { messages, sendMessage, status, error } = useChat({ transport });
	const [input, setInput] = useState("");
	const [expanded, setExpanded] = useState(false);
	const scrollRef = useRef<HTMLDivElement>(null);

	const isBusy = status === "submitted" || status === "streaming";

	useEffect(() => {
		if (messages.length > 0) {
			scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
		}
	}, [messages]);

	const submit = (text: string) => {
		const trimmed = text.trim();
		if (!trimmed || isBusy) return;
		setInput("");
		void sendMessage({ text: trimmed });
	};

	const assistantLabel = config.assistantName ?? config.storeName;
	const greeting = config.greeting ?? `Hi! I'm the ${config.storeName} assistant — what are you looking for?`;

	return (
		<div
			className={cn(
				"fixed inset-0 z-50 flex flex-col bg-background text-foreground shadow-2xl transition-[opacity,transform,visibility] duration-200 sm:inset-auto sm:right-4 sm:rounded-2xl sm:border",
				// Maximized: full height, roughly a third of the screen — clamped so it never
				// drops below the default width or turns into a wall on ultrawides.
				expanded
					? "sm:top-4 sm:bottom-4 sm:w-[clamp(26rem,33.333vw,42rem)]"
					: "sm:bottom-4 sm:h-[min(37.5rem,calc(100dvh-2rem))] sm:w-[25rem]",
				// `invisible` rather than `hidden` so the enter/leave transition actually plays.
				open ? "translate-y-0 opacity-100" : "pointer-events-none invisible translate-y-4 opacity-0",
			)}
			role="dialog"
			aria-label={`Chat with ${assistantLabel}`}
		>
			<header className="flex items-center justify-between gap-2 border-b px-4 py-3">
				<div className="min-w-0">
					<div className="truncate text-sm font-semibold">{assistantLabel}</div>
					<div className="text-xs text-muted-foreground">Usually replies instantly</div>
				</div>
				<div className="flex shrink-0 items-center gap-1">
					{/* Mobile is already full-screen — maximize is a desktop affordance. */}
					<button
						type="button"
						onClick={() => setExpanded((value) => !value)}
						aria-label={expanded ? "Restore chat size" : "Maximize chat"}
						className="hidden h-8 w-8 cursor-pointer items-center justify-center rounded-full text-muted-foreground hover:bg-muted sm:inline-flex"
					>
						{expanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
					</button>
					<button
						type="button"
						onClick={onClose}
						aria-label="Minimize chat"
						className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
					>
						<ChevronDown className="h-5 w-5" />
					</button>
				</div>
			</header>

			<div ref={scrollRef} className="flex-1 overflow-y-auto overscroll-contain px-4 py-4">
				<div className="flex flex-col gap-3">
					<AssistantBubble>{greeting}</AssistantBubble>

					{messages.length === 0 && config.suggestedQuestions.length > 0 && (
						<div className="flex flex-wrap gap-2">
							{config.suggestedQuestions.map((question) => (
								<button
									key={question}
									type="button"
									onClick={() => submit(question)}
									className="cursor-pointer rounded-full border px-3 py-1.5 text-left text-xs transition-colors hover:bg-muted"
								>
									{question}
								</button>
							))}
						</div>
					)}

					{messages.map((message) => (
						<ChatMessage key={message.id} message={message} config={config} />
					))}

					{status === "submitted" && (
						<AssistantBubble>
							<span className="inline-flex gap-1">
								<Dot delay="0ms" />
								<Dot delay="150ms" />
								<Dot delay="300ms" />
							</span>
						</AssistantBubble>
					)}

					{error && (
						<AssistantBubble>
							The assistant is temporarily unavailable. Please try again later.
						</AssistantBubble>
					)}
				</div>
			</div>

			<form
				className="flex items-end gap-2 border-t p-3 pb-[calc(env(safe-area-inset-bottom,0px)+0.75rem)]"
				onSubmit={(e) => {
					e.preventDefault();
					submit(input);
				}}
			>
				<textarea
					value={input}
					rows={1}
					maxLength={2000}
					placeholder="Ask about our products…"
					className="max-h-28 flex-1 resize-none rounded-xl border bg-muted/40 px-3 py-2 text-sm outline-none focus:border-foreground/40"
					onChange={(e) => setInput(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === "Enter" && !e.shiftKey) {
							e.preventDefault();
							submit(input);
						}
					}}
				/>
				<button
					type="submit"
					disabled={isBusy || !input.trim()}
					aria-label="Send message"
					className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-foreground text-background transition-opacity disabled:opacity-40"
				>
					<ArrowUp className="h-4 w-4" />
				</button>
			</form>
		</div>
	);
}

function ChatMessage({ message, config }: { message: UIMessage; config: StoreChatConfig }) {
	if (message.role === "user") {
		const text = message.parts
			.map((part) => (part.type === "text" ? part.text : ""))
			.join("")
			.trim();
		if (!text) return null;
		return (
			<div className="ml-8 self-end rounded-2xl rounded-br-md bg-foreground px-3 py-2 text-sm whitespace-pre-wrap text-background">
				{text}
			</div>
		);
	}

	if (message.role !== "assistant") return null;

	return (
		<>
			{message.parts.map((part, index) => {
				if (part.type === "text" && part.text.trim()) {
					return (
						<AssistantBubble key={index} markdown>
							<ChatMarkdown>{part.text}</ChatMarkdown>
						</AssistantBubble>
					);
				}
				const products = productsFromPart(part);
				if (products.length > 0) {
					return (
						<div key={index} className="-mx-1 flex snap-x gap-2 overflow-x-auto px-1 pb-1">
							{products.map((product) => (
								<ChatProductCard
									key={product.productId}
									product={product}
									messageId={message.id}
									locale={config.locale}
								/>
							))}
						</div>
					);
				}
				return null;
			})}
		</>
	);
}

function AssistantBubble({ children, markdown = false }: { children: React.ReactNode; markdown?: boolean }) {
	return (
		<div
			className={cn(
				"mr-8 self-start rounded-2xl rounded-bl-md border bg-muted/40 px-3 py-2 text-sm",
				// Markdown handles its own line breaks; pre-wrap on top would double them.
				!markdown && "whitespace-pre-wrap",
			)}
		>
			{children}
		</div>
	);
}

function Dot({ delay }: { delay: string }) {
	return (
		<span
			className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground"
			style={{ animationDelay: delay }}
		/>
	);
}
