import Image from "next/image";
import Link from "next/link";
import { type Department, getStoreIdentity } from "@/lib/catalog";
import { MEGA_PLATE } from "@/lib/editorial";

type MegaLink = { label: string; note: string; href: string };

function Column({ title, links }: { title: string; links: MegaLink[] }) {
	return (
		<div className="flex min-w-0 flex-[1_1_210px] flex-col gap-4">
			<div className="eti text-[10px] text-acc">{title}</div>
			<ul className="flex flex-col gap-4">
				{links.map((link) => (
					<li key={link.href}>
						<Link href={link.href} className="group flex flex-col gap-[3px]">
							<span className="font-sf text-[16px] transition group-hover:text-acc">{link.label}</span>
							<span className="text-[12.5px] leading-[1.55] text-dim">{link.note}</span>
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}

/** The "Collections" mega menu: departments, the house pages and a printed manifesto. */
export async function MegaPanel({
	departments,
	storeName,
}: {
	departments: Department[];
	storeName: string;
}) {
	const identity = await getStoreIdentity();
	const toLink = (department: Department): MegaLink => ({
		label: department.name,
		note: `${department.count} ${department.count === 1 ? "piece" : "pieces"} in the register`,
		href: `/category/${department.slug}`,
	});
	const first = departments.slice(0, 4).map(toLink);
	const rest = departments.slice(4, 8).map(toLink);
	const house: MegaLink[] = [
		{ label: "All pieces", note: "The complete register, newest first", href: "/products" },
		{ label: "About the house", note: "Who keeps the archive and how", href: "/about" },
		{ label: "Questions", note: "Answers to the questions we hear most", href: "/faq" },
		...(identity.contactFormEnabled
			? [{ label: "Write to us", note: "Send the house a message", href: "/contact" }]
			: []),
		...(identity.blogEnabled ? [{ label: "Journal", note: "Notes from the workroom", href: "/blog" }] : []),
	];

	return (
		<div className="relative mx-auto flex max-w-[1240px] flex-wrap gap-10 px-4 pb-[38px] pt-[34px] sm:px-6">
			<div className="flex min-w-0 flex-[3_1_480px] flex-wrap gap-10">
				{first.length > 0 ? <Column title="Departments" links={first} /> : null}
				{rest.length > 0 ? <Column title="Further departments" links={rest} /> : null}
				<Column title="The house" links={house} />
			</div>
			<div className="flex min-w-0 flex-[1_1_260px] flex-col gap-3.5 border-line lg:border-l lg:pl-8">
				<div className="hatch relative flex aspect-video items-end overflow-hidden border border-line p-3">
					<Image
						src={MEGA_PLATE.src}
						alt=""
						fill
						sizes="(max-width: 1024px) 100vw, 330px"
						className="object-cover"
					/>
					<span className="plate-label relative">from the register</span>
				</div>
				<div className="font-sf text-[17px] leading-[1.3]">The {storeName} register</div>
				<p className="text-[13px] leading-[1.7] text-soft">
					Every piece is photographed and described before it enters the register.
				</p>
			</div>
		</div>
	);
}
