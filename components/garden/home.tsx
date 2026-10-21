import { cacheLife } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import {
	IconDelivery,
	IconPottedTree,
	IconSeedling,
	IconSupport,
	LeafGlyph,
	NoteHeart,
	RuleSquiggle,
} from "@/components/garden/icons";
import { ProductCard } from "@/components/product-card";
import { commerce } from "@/lib/commerce";
import { EDITORIAL, getCollectionNotes, getStoreBrand, picturedFirst } from "@/lib/garden";
import { YNSMedia } from "@/lib/yns-media";

export async function Hero() {
	"use cache";
	cacheLife("hours");
	const brand = await getStoreBrand();
	const image = EDITORIAL.hero;

	return (
		<section className="hero" data-hero>
			<div className="hero__bg">
				{image && <YNSMedia src={image} alt="" fill priority sizes="100vw" className="object-cover" />}
				<div className="hero__veil" />
				<div className="hero__sun" aria-hidden="true" />
			</div>
			<div className="hero__body">
				<div className="wrap hero__inner">
					<div className="hero__copy">
						<h1 className="hero__title">
							Little Trees,
							<br />
							Big Patience
							<LeafGlyph className="leafglyph" />
						</h1>
						<p className="hero__lede">
							At {brand.name}, we grow young bonsai on our own benches and pot them up with the soil, tools
							and pots to keep them well, for first-time growers and old hands alike.
						</p>
						<div className="hero__cta">
							<Link className="btn btn-cut" href="/products">
								Shop Now <span className="arw">&rarr;</span>
							</Link>
						</div>
					</div>
					<aside className="hero__aside" aria-hidden="true">
						<p className="hero__note">
							A little
							<br />
							care goes
							<br />a long way
							<NoteHeart width={30} height={30} />
						</p>
					</aside>
				</div>
			</div>
		</section>
	);
}

const BENEFITS = [
	{ first: "Thoughtfully", second: "Grown Trees", icon: IconSeedling },
	{ first: "Shipping Shown", second: "at Checkout", icon: IconDelivery },
	{ first: "Questions?", second: "Just Ask Us", icon: IconSupport },
	{ first: "Care Notes", second: "With Every Tree", icon: IconPottedTree },
];

export function Benefits() {
	return (
		<section className="benefits rip rip--top" aria-label="Why shop with us">
			<div className="wrap">
				<ul className="benefits__list">
					{BENEFITS.map(({ first, second, icon: Icon }) => (
						<li className="benefit" key={second}>
							<Icon />
							<p>
								{first}
								<br />
								{second}
							</p>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}

export async function AboutStrip() {
	"use cache";
	cacheLife("hours");
	const brand = await getStoreBrand();
	const image = EDITORIAL.polaroid;

	return (
		<section className="section about">
			<div className="wrap">
				<div className="about__grid">
					<div className="about__left">
						<figure className="about__photo polaroid polaroid-tape">
							<div className="photo relative">
								{image && (
									<YNSMedia
										src={image}
										alt=""
										fill
										sizes="(max-width: 1080px) 80vw, 420px"
										className="object-cover"
									/>
								)}
							</div>
						</figure>
					</div>

					<div className="about__body">
						<div className="inline-block">
							<span className="eyebrow-script">About Us</span>
							<RuleSquiggle className="hand-rule" width={90} height={9} />
						</div>
						<h2>
							More Than Trees,
							<br />
							It&apos;s a Slow Craft
						</h2>
						<p>
							{brand.name} started on a single potting bench, with a few junipers and a lot of patience. We
							still grow, trim and pot every tree ourselves, and keep only the pots and tools we use on our
							own benches.
						</p>
						<Link className="btn btn-ghost" href="/about">
							Our Story <span className="arw">&rarr;</span>
						</Link>
					</div>

					<figure className="about__sketch">
						<Image
							src="/images/sketch-note.webp"
							alt="A pencil sketch of a potted tree on a table beside a cup and a book, on a taped slip of paper that reads: good things grow slowly"
							width={900}
							height={834}
							sizes="(max-width: 720px) 90vw, (max-width: 1080px) 45vw, 360px"
							className="h-auto w-full"
						/>
					</figure>
				</div>
			</div>
		</section>
	);
}

export async function Featured() {
	"use cache";
	cacheLife("minutes");
	const { data: all } = await commerce.productBrowse({ active: true, limit: 24 });
	const data = picturedFirst(all).slice(0, 4);

	if (data.length === 0) return null;

	return (
		<section className="section featured rip rip--top rip--bottom">
			<div className="wrap">
				<div className="featured__inner">
					<div className="featured__intro">
						<div className="inline-block">
							<span className="eyebrow-script">Featured Collection</span>
							<RuleSquiggle className="hand-rule" width={90} height={9} />
						</div>
						<h2>
							Popular Trees
							<br />
							This Season
						</h2>
						<p>
							A few trees and tools our growers keep recommending, chosen for their character and how well
							they settle into a new home.
						</p>
						<Link className="btn btn-cut" href="/products">
							View All Collection <span className="arw">&rarr;</span>
						</Link>
					</div>
					<div className="featured__row">
						{data.map((product) => (
							<ProductCard key={product.id} product={product} />
						))}
					</div>
				</div>
			</div>
		</section>
	);
}

const STEPS = [
	{
		icon: "/images/how-tree.png",
		title: "Choose Your Tree",
		text: "Pick a tree, a pot and the tools that suit your windowsill or garden.",
	},
	{
		icon: "/images/how-box.png",
		title: "Place Your Order",
		text: "Secure checkout with safe and flexible payment options.",
	},
	{
		icon: "/images/how-truck.png",
		title: "It Sets Off",
		text: "Your order heads to the address you gave at checkout.",
	},
	{
		icon: "/images/how-house.png",
		title: "It Arrives Home",
		text: "Unwrap, find it a bright spot and water when the soil feels dry.",
	},
];

export function HowItWorks() {
	return (
		<section className="how" aria-labelledby="how-it-works-title">
			<div className="wrap">
				<div className="how__sheet">
					<div>
						<h2 id="how-it-works-title" className="how__title">
							How It Works
						</h2>
						<p className="how__sub">Bringing a bonsai home is easier than you think.</p>
						<Image className="how__leaf" src="/images/how-leaf.png" alt="" width={98} height={101} />
					</div>
					<ol className="how__steps">
						{STEPS.map((step, index) => (
							<li className="how__step" key={step.title}>
								<Image className="how__icon" src={step.icon} alt="" width={156} height={140} />
								<span className="how__num" aria-hidden="true">
									{index + 1}
								</span>
								<h3>{step.title}</h3>
								<p>{step.text}</p>
							</li>
						))}
					</ol>
				</div>
			</div>
		</section>
	);
}

// Used when a collection has no description of its own; the original's cards read like handwritten notes.
const NOTE_LINES = [
	"A short list of trees and tools we keep coming back to.",
	"Put together for a windowsill, a balcony or a first bench.",
	"Our quiet favourites: forgiving trees and tools that last.",
];

export async function CollectionNotes() {
	"use cache";
	cacheLife("hours");
	const notes = await getCollectionNotes(3);
	if (notes.length === 0) return null;
	const sidePhoto = EDITORIAL.side;

	return (
		<section className="stories">
			{sidePhoto && (
				<div className="stories__photo" aria-hidden="true">
					<YNSMedia
						src={sidePhoto}
						alt=""
						fill
						sizes="(max-width: 1080px) 1px, 420px"
						className="object-cover"
					/>
				</div>
			)}
			<div className="wrap">
				<div className="stories__inner">
					<div className="stories__intro">
						<span className="eyebrow-script with-line">Browse by Collection</span>
						<h2>
							Real Days,
							<br />
							Real Stories
						</h2>
						<p className="lede">
							Each collection is put together around a place, a season or a first step. Start with the one
							that sounds like you.
						</p>
						<Link className="btn btn-ghost" href="/products">
							See Everything <span className="arw">&rarr;</span>
						</Link>
					</div>
					<div className="notes">
						{notes.map((note, index) => (
							<article className="note-card" key={note.id}>
								<div className="note-card__thumb">
									{note.image && (
										<YNSMedia src={note.image} alt="" fill sizes="52px" className="object-cover" />
									)}
								</div>
								<p className="note-card__text">
									{note.text && note.text.length > 40 ? note.text : NOTE_LINES[index % NOTE_LINES.length]}
								</p>
								<div className="note-card__who">
									<h3 className="note-card__name">
										<Link href={note.href} className="after:absolute after:inset-0 after:content-['']">
											{note.name}
										</Link>
									</h3>
									<span className="note-card__meta">
										{note.count === 1 ? "1 item" : `${note.count} items`}
									</span>
									<span className="note-card__go" aria-hidden="true">
										open it &rarr;
									</span>
								</div>
								<LeafGlyph width={22} height={22} className="note-card__leaf" />
							</article>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
