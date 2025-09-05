"use client";

import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import Image from "next/image";
import { useCart } from "@/context/cart-context";
import { formatMoney } from "@/lib/utils";

interface CartSidebarProps {
	isOpen: boolean;
	onClose: () => void;
}

export function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
	const { cart, itemCount, optimisticUpdate, optimisticRemove } = useCart();

	async function handleUpdateQuantity(variantId: string, quantity: number) {
		try {
			await optimisticUpdate(variantId, quantity);
		} catch (error) {
			// Error is already logged in context, could show toast here
		}
	}

	async function handleRemoveItem(variantId: string) {
		try {
			await optimisticRemove(variantId);
		} catch (error) {
			// Error is already logged in context, could show toast here
		}
	}

	if (!isOpen) return null;

	return (
		<>
			{/* Overlay with blur */}
			<div
				className="fixed inset-0 z-40 h-screen w-screen backdrop-blur-sm bg-black/30 transition-opacity"
				onClick={onClose}
			/>

			{/* Sidebar */}
			<div className="fixed right-0 top-0 z-50 h-screen w-96 max-w-full bg-white shadow-xl transition-transform">
				<div className="flex h-full flex-col">
					{/* Header */}
					<div className="flex items-center justify-between border-b p-4">
						<div className="flex items-center gap-2">
							<ShoppingBag className="h-5 w-5" />
							<h2 className="text-lg font-semibold">Cart ({itemCount})</h2>
						</div>
						<button onClick={onClose} className="rounded-full p-1 hover:bg-gray-100" aria-label="Close cart">
							<X className="h-5 w-5" />
						</button>
					</div>

					{/* Content */}
					<div className="flex-1 overflow-y-auto">
						{!cart || !cart.items || cart.items.length === 0 ? (
							<div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
								<ShoppingBag className="h-12 w-12 text-gray-300" />
								<div>
									<h3 className="font-medium text-gray-900">Your cart is empty</h3>
									<p className="text-sm text-gray-500">Start shopping to add items to your cart</p>
								</div>
							</div>
						) : (
							<div className="p-4 space-y-4">
								{cart.items.map((item) => {
									// Product info is now directly available in item.product
									const product = item.product;
									const price = item.price; // Already in dollars

									return (
										<div key={item.id} className="flex items-start gap-3 border-b pb-4">
											{/* Product Image */}
											<div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
												{product?.images?.[0] ? (
													<Image
														src={product.images[0]}
														alt={product.name || "Product"}
														width={64}
														height={64}
														className="w-full h-full object-cover"
													/>
												) : (
													<div className="w-full h-full flex items-center justify-center">
														<ShoppingBag className="h-6 w-6 text-gray-300" />
													</div>
												)}
											</div>

											{/* Product Info */}
											<div className="flex-1 min-w-0">
												<h3 className="font-medium text-sm text-gray-900 truncate">
													{product?.name || `Product ${item.productId}`}
												</h3>
												<p className="text-sm text-gray-600 mt-1">
													{formatMoney({
														amount: price,
														currency: cart.currency || "USD",
														locale: "en-US",
													})}
												</p>
											</div>

											{/* Quantity Controls */}
											<div className="flex flex-col items-end gap-2">
												<button
													onClick={() => handleRemoveItem(item.variantId || item.productId)}
													className="text-red-500 hover:text-red-700 p-1"
													aria-label="Remove item"
												>
													<X className="h-4 w-4" />
												</button>
												<div className="flex items-center gap-1 bg-gray-50 rounded-full px-2 py-1">
													<button
														onClick={() =>
															handleUpdateQuantity(item.variantId || item.productId, item.quantity - 1)
														}
														className="rounded-full p-1 hover:bg-gray-200"
														disabled={item.quantity <= 1}
													>
														<Minus className="h-3 w-3" />
													</button>
													<span className="min-w-[1.5rem] text-center text-sm font-medium">
														{item.quantity}
													</span>
													<button
														onClick={() =>
															handleUpdateQuantity(item.variantId || item.productId, item.quantity + 1)
														}
														className="rounded-full p-1 hover:bg-gray-200"
													>
														<Plus className="h-3 w-3" />
													</button>
												</div>
											</div>
										</div>
									);
								})}
							</div>
						)}
					</div>

					{/* Footer with Total */}
					{cart && cart.items.length > 0 && (
						<div className="border-t p-4 space-y-4">
							<div className="flex items-center justify-between text-lg font-semibold">
								<span>Total:</span>
								<span>
									{formatMoney({
										amount: cart.total || 0,
										currency: cart.currency || "USD",
										locale: "en-US",
									})}
								</span>
							</div>
							<button className="w-full rounded-lg bg-black px-6 py-3 text-white hover:bg-gray-800">
								Checkout (Demo)
							</button>
						</div>
					)}
				</div>
			</div>
		</>
	);
}
