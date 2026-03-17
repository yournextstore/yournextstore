export type FAQCategory = {
	id: string;
	title: string;
	questions: { question: string; answer: string }[];
};

export const faqCategories: FAQCategory[] = [
	{
		id: "orders",
		title: "Orders",
		questions: [
			{
				question: "How do I place an order?",
				answer:
					"Browse our products, add items to your cart, and proceed to checkout. You'll be guided through the payment process step by step.",
			},
			{
				question: "Can I modify or cancel my order after placing it?",
				answer:
					"Once an order has been submitted, modifications are generally not possible. If your order hasn't been processed yet, contact us as soon as possible and we'll do our best to accommodate your request.",
			},
			{
				question: "How long does order processing take?",
				answer:
					"Most orders are processed within 1–3 business days. Processing times may vary depending on product availability and order volume. You'll receive a confirmation email once your order has shipped.",
			},
			{
				question: "Can I request an invoice for my order?",
				answer:
					"Yes. If you need an invoice, please make sure to provide your billing details during checkout. The invoice will be sent to your email along with the order confirmation.",
			},
			{
				question: "Can I add special instructions to my order?",
				answer:
					"If available, you can add notes or special instructions during the checkout process. Look for the order notes field before completing your purchase.",
			},
		],
	},
	{
		id: "payments",
		title: "Payments",
		questions: [
			{
				question: "What payment methods do you accept?",
				answer:
					"We accept all major credit and debit cards, as well as other payment methods available through our secure payment provider. Available options are displayed at checkout.",
			},
			{
				question: "Is my payment information secure?",
				answer:
					"Absolutely. All payments are processed through a PCI-compliant payment provider. We never store your full card details on our servers.",
			},
			{
				question: "My payment failed. What should I do?",
				answer:
					"First, verify that your card details are correct and that you have sufficient funds. If the issue persists, try a different payment method or contact your bank. You can also reach out to us for assistance.",
			},
			{
				question: "When will I be charged?",
				answer:
					"Your payment is processed at the time of purchase. For pre-order items, you may be charged at the time of ordering or when the item ships, depending on the product.",
			},
		],
	},
	{
		id: "shipping",
		title: "Shipping & Delivery",
		questions: [
			{
				question: "What are your shipping options?",
				answer:
					"We offer standard and express shipping options. Available methods and estimated delivery times are displayed at checkout based on your location.",
			},
			{
				question: "Do you ship internationally?",
				answer:
					"Yes, we ship to many countries worldwide. International shipping options and costs are calculated at checkout based on your delivery address.",
			},
			{
				question: "How can I track my order?",
				answer:
					"Once your order has shipped, you'll receive a confirmation email with a tracking number and a link to track your package in real time.",
			},
			{
				question: "What should I do if my package arrives damaged?",
				answer:
					"If your order arrives damaged, please document the damage with photos and contact us immediately. We'll work with you to resolve the issue as quickly as possible.",
			},
			{
				question: "Can I combine multiple orders to save on shipping?",
				answer:
					"Unfortunately, we're unable to combine separate orders into a single shipment. To take advantage of any free shipping thresholds, make sure to add all items to a single order before checking out.",
			},
		],
	},
	{
		id: "returns",
		title: "Returns & Exchanges",
		questions: [
			{
				question: "What is your return policy?",
				answer:
					"We accept returns within 14 days of delivery. Items must be unused, in their original packaging, and in the same condition as received. Please refer to our returns policy page for full details.",
			},
			{
				question: "How do I initiate a return?",
				answer:
					"To start a return, contact our support team with your order number and the reason for the return. We'll provide you with return instructions and, if applicable, a return shipping label.",
			},
			{
				question: "How do exchanges work?",
				answer:
					"Exchanges are handled as a return followed by a new order. Simply return the original item and place a new order for the item you'd like instead.",
			},
			{
				question: "How long does it take to receive a refund?",
				answer:
					"Once we receive and inspect your returned item, refunds are typically processed within 5–10 business days. The refund will be credited to your original payment method.",
			},
		],
	},
	{
		id: "discounts",
		title: "Discounts & Promotions",
		questions: [
			{
				question: "Do you offer discounts for new customers?",
				answer:
					"Yes! New customers can subscribe to our newsletter to receive a welcome discount. Look for the signup form on our homepage.",
			},
			{
				question: "How do I apply a discount code?",
				answer:
					"During checkout, you'll find a field to enter your discount code. Enter the code and the discount will be automatically applied to your order total.",
			},
			{
				question: "Can I use multiple discount codes on one order?",
				answer:
					"Only one discount code can be applied per order. The system will automatically use the code that provides the best value if multiple are entered.",
			},
		],
	},
];
