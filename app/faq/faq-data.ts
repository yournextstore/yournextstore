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
					"Changes are not always possible once an order is submitted. Get in touch as soon as possible with your order number and we'll let you know what we can do.",
			},
			{
				question: "How long does order processing take?",
				answer:
					"Processing times depend on the product and its availability. You'll receive an email confirmation when your order is placed and again once it has shipped.",
			},
			{
				question: "Can I request an invoice for my order?",
				answer:
					"Provide your billing details at checkout. If you need an invoice, get in touch with your order number.",
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
				answer: "The payment methods available for your order are shown at checkout.",
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
				answer: "Your payment is taken when you place your order.",
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
					"The shipping methods available for your address, and their costs, are shown at checkout before you pay.",
			},
			{
				question: "Do you ship internationally?",
				answer:
					"Enter your delivery address at checkout to see whether we ship there and which options apply.",
			},
			{
				question: "How can I track my order?",
				answer:
					"When your order ships, the shipping confirmation email includes tracking details whenever the carrier provides them.",
			},
			{
				question: "What should I do if my package arrives damaged?",
				answer: "Please take photos of the damage and get in touch with us, quoting your order number.",
			},
			{
				question: "Can I combine multiple orders to save on shipping?",
				answer:
					"Each order is shipped on its own, so add everything you'd like to one order before checking out.",
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
					"Our returns policy, including any time limits and conditions, is set out in our terms of sale.",
			},
			{
				question: "How do I initiate a return?",
				answer:
					"Get in touch with your order number and the items you'd like to return, and we'll reply with the next steps.",
			},
			{
				question: "How do exchanges work?",
				answer:
					"Exchanges are handled as a return followed by a new order. Simply return the original item and place a new order for the item you'd like instead.",
			},
			{
				question: "How long does it take to receive a refund?",
				answer:
					"Refunds are issued to your original payment method once the return has been received and checked. How long it takes to appear depends on your bank or card issuer.",
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
					"Current offers, when there are any, are announced on the site and to newsletter subscribers.",
			},
			{
				question: "How do I apply a discount code?",
				answer:
					"During checkout, you'll find a field to enter your discount code. Enter the code and the discount will be automatically applied to your order total.",
			},
			{
				question: "Can I use multiple discount codes on one order?",
				answer: "One discount code can be applied per order.",
			},
		],
	},
];
