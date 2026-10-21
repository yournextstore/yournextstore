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
					"Processing times depend on the product and its availability. You'll receive a confirmation email after you order, and another one once your order is on its way.",
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
				answer: "Your payment is taken when you place your order at checkout.",
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
					"The delivery methods available for your address, with their costs, are shown at checkout before you pay.",
			},
			{
				question: "Do you ship internationally?",
				answer: "Enter your delivery address at checkout to see whether we deliver there and what it costs.",
			},
			{
				question: "How can I track my order?",
				answer:
					"Once your order has shipped, you'll receive an email with its delivery details, including tracking when the carrier provides it.",
			},
			{
				question: "What should I do if my package arrives damaged?",
				answer:
					"If your order arrives damaged, please document the damage with photos and contact us immediately. We'll work with you to resolve the issue as quickly as possible.",
			},
			{
				question: "Can I combine multiple orders to save on shipping?",
				answer:
					"Each order ships on its own, so add everything you want to a single order before checking out.",
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
					"Our return policy page sets out what can be returned, how and when. Please read it before sending anything back.",
			},
			{
				question: "How do I initiate a return?",
				answer:
					"Contact us with your order number and the item you'd like to return, and we'll send you the next steps. Our return policy page explains the conditions.",
			},
			{
				question: "How do exchanges work?",
				answer:
					"Exchanges are handled as a return followed by a new order. Simply return the original item and place a new order for the item you'd like instead.",
			},
			{
				question: "How long does it take to receive a refund?",
				answer:
					"Refunds go back to your original payment method once your return has been accepted. Our return policy page has the details.",
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
					"Subscribe to our newsletter to hear about new arrivals and offers first. The signup form is at the bottom of every page.",
			},
			{
				question: "How do I apply a discount code?",
				answer:
					"During checkout, you'll find a field to enter your discount code. Enter the code and the discount will be automatically applied to your order total.",
			},
			{
				question: "Can I use multiple discount codes on one order?",
				answer:
					"One discount code can be applied per order. Enter it in the cart or at checkout to see the new total.",
			},
		],
	},
];
