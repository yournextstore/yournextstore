import { OrderList } from "@/ui/order-list";

export default function OrderPage() {
	return (
		<div className="py-10">
			<h1 className="text-2xl font-bold mb-5">Your Orders</h1>
			<OrderList />
		</div>
	);
}
