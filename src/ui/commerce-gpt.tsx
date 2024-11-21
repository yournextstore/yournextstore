"use client";

import { commerceGPTRevalidateAction } from "@/actions/cart-actions";
import { Button } from "@/ui/shadcn/button";
import { Card, CardContent } from "@/ui/shadcn/card";
import { Input } from "@/ui/shadcn/input";
import { useChat } from "ai/react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ProductList } from "./commercegpt/product-list";

export function CommerceGPT() {
	const { messages, input, handleInputChange, handleSubmit, append } = useChat({
		onFinish: async (message) => {
			const tools = message.toolInvocations?.map((ti) => ti.toolName) || [];

			if (tools.includes("cartAdd")) {
				await commerceGPTRevalidateAction();
			}
		},
	});
	const [isOpen, setIsOpen] = useState(false);

	const pathname = usePathname();

	const ref = useRef<HTMLInputElement>(null);

	useEffect(() => {
		setIsOpen(false);
	}, [pathname]);

	useEffect(() => {
		const handleEsc = (event: KeyboardEvent) => {
			if (event.key === "Escape") setIsOpen(false);
		};
		window.addEventListener("keydown", handleEsc);
		return () => window.removeEventListener("keydown", handleEsc);
	}, []);

	return (
		<div className="flex flex-col">
			<div className="bg-gradient-to-r from-orange-100 via-orange-200 to-red-300 px-4 py-3 text-indigo-900">
				<div className="flex items-center justify-between gap-x-4">
					<div className="mx-auto flex max-w-7xl items-center justify-between gap-x-4">
						<div className="flex items-center gap-x-4">
							<p className="text-center text-sm font-medium">
								🎉 You can use powerful OpenAI models to search and buy products
							</p>
							<Button
								size="sm"
								className="flex-none rounded-full bg-orange-600 px-3 py-1 text-sm font-semibold text-white shadow-sm hover:bg-orange-700 focus-visible:ring-0"
								onClick={() => {
									ref.current?.focus();
									setIsOpen(!isOpen);
								}}
							>
								CommerceGPT
							</Button>
						</div>
					</div>
				</div>
			</div>
			<div
				className={`z-[100] overflow-clip fixed top-0 left-0 right-0 bg-neutral-50 transition-all duration-300 ease-in-out shadow-lg ${
					isOpen ? "h-2/3" : "h-0"
				}`}
			>
				<Card className="w-full h-full rounded-none max-w-screen-lg mx-auto border-transparent">
					<CardContent className="p-4 h-full flex flex-col">
						<div className="flex-grow overflow-auto space-y-4 mb-4">
							{messages.length === 0 && (
								<div className="flex-1 overflow-y-auto p-4 flex flex-col items-center justify-center space-y-6 h-full">
									<h3 className="text-xl font-bold text-center">
										Welcome to Commerce GPT in Your Next Store
									</h3>
									<div className="flex flex-wrap justify-center gap-2">
										<Button
											variant="outline"
											size="lg"
											onClick={() => append({ role: "user", content: "Show me some bags" })}
										>
											Show me some bags
										</Button>
										<Button
											variant="outline"
											size="lg"
											onClick={() => append({ role: "user", content: "Add the first bag to the cart" })}
										>
											Add the first bag to the cart
										</Button>
										<Button
											variant="outline"
											size="lg"
											onClick={() => append({ role: "user", content: "Show me some glasses" })}
										>
											Show me some glasses
										</Button>
									</div>
								</div>
							)}
							{messages.map((m) => (
								<div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
									<div
										className={`rounded-lg p-2 max-w-[80%] ${m.role === "user" ? "bg-blue-500 text-white" : "bg-neutral-100"}`}
									>
										{m.content}
										{m.toolInvocations?.map((ti) => {
											console.log(ti);
											return (
												ti.state === "result" && (
													<div key={ti.toolCallId}>
														{(() => {
															switch (ti.toolName) {
																case "productSearch":
																	if (ti.result.length === 0) return <>No results</>;
																	return <ProductList products={ti.result} />;
																default:
																	return null;
															}
														})()}
													</div>
												)
											);
										})}
									</div>
								</div>
							))}
						</div>
						<form onSubmit={handleSubmit} className="flex space-x-2 items-center">
							<Input
								value={input}
								onChange={handleInputChange}
								placeholder="What do you want to buy today?"
								className="flex-grow h-12 md:text-xl"
								ref={ref}
							/>
							<Button type="submit" size="lg" className="rounded-full text-lg">
								Send
							</Button>
						</form>
					</CardContent>
				</Card>
			</div>
			{isOpen && (
				<div
					className="fixed inset-0 bg-black bg-opacity-50 transition-opacity ease-in-out duration-300"
					onClick={() => setIsOpen(false)}
				/>
			)}
		</div>
	);
}
