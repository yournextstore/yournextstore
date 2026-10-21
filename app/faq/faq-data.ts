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
					"Processing times depend on the product and on demand. You'll receive a confirmation email when you order and another one once your order has shipped.",
			},
			{
				question: "Can I request an invoice for my order?",
				answer:
					"If you need an invoice, provide your billing details during checkout, or contact us with your order number.",
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
					"Yes. Payments are processed by a PCI-compliant payment provider, and your full card details are never stored by the store.",
			},
			{
				question: "My payment failed. What should I do?",
				answer:
					"First, verify that your card details are correct and that you have sufficient funds. If the issue persists, try a different payment method or contact your bank. You can also reach out to us for assistance.",
			},
			{
				question: "When will I be charged?",
				answer:
					"Your payment is taken when you complete checkout. The total, including any shipping and taxes, is shown before you pay.",
			},
		],
	},
	{
		id: "shipping",
		title: "Shipping & Delivery",
		questions: [
			{
				question: "What are your shipping options?",
				answer: "The shipping methods available for your address, with their costs, are shown at checkout.",
			},
			{
				question: "Do you ship internationally?",
				answer: "Enter your delivery address at checkout to see whether we ship there and what it costs.",
			},
			{
				question: "How can I track my order?",
				answer:
					"Once your order has shipped, you'll receive an email with the shipping details, including tracking information when the carrier provides it.",
			},
			{
				question: "What should I do if my package arrives damaged?",
				answer:
					"If your order arrives damaged, take photos of the damage and the packaging and contact us with your order number. Our policy pages explain what happens next.",
			},
			{
				question: "Can I combine multiple orders to save on shipping?",
				answer:
					"Each order ships on its own. To make the most of any shipping offer shown in the store, add everything you need to a single order before checking out.",
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
					"Our return conditions are set out on the store's policy pages, linked in the footer. Please read them before sending anything back.",
			},
			{
				question: "How do I initiate a return?",
				answer:
					"Contact us with your order number and the reason for the return, and we'll explain the next steps under our returns policy.",
			},
			{
				question: "How do exchanges work?",
				answer:
					"An exchange is handled as a return followed by a new order: return the original item under our returns policy and order the one you'd like instead.",
			},
			{
				question: "How long does it take to receive a refund?",
				answer:
					"Refunds are handled as described in our returns policy and go back to your original payment method. How long it takes to appear also depends on your bank.",
			},
		],
	},
	{
		id: "discounts",
		title: "Discounts & Promotions",
		questions: [
			{
				question: "Do you run discounts or offers?",
				answer: "Any current offers are announced in the store and, if you subscribe, in our newsletter.",
			},
			{
				question: "How do I apply a discount code?",
				answer:
					"During checkout, you'll find a field to enter your discount code. Enter the code and the discount will be automatically applied to your order total.",
			},
			{
				question: "Can I use multiple discount codes on one order?",
				answer:
					"Enter your code at checkout; the checkout shows whether it applies to your order and how codes can be combined.",
			},
		],
	},
];
