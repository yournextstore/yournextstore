import { Component_3_1_2_1 } from "./Component_3_1_2_1";
import { Component_3_1_2_2 } from "./Component_3_1_2_2";

export function Component_3_1_2() {
	return (
		<li
			id="menu-item-210"
			className="text-white text-[17px] relative block overflow-x-hidden overflow-y-hidden list-outside caret-white p-[13.6px]"
			data-component-id="Component_3_1_2"
		>
			<span
				role="button"
				tabIndex={0}
				className="bg-[#1b132d] leading-[22.4px] [font-family:Metropolis,system-ui,sans-serif] font-semibold text-[14px] tracking-[1px] uppercase [white-space-collapse:collapse] [text-wrap-mode:nowrap] relative block caret-white hover:text-[#2ebcfc]"
			>
				MORE
			</span>
			<ul className="bg-[#1b132d] h-0 min-w-[200px] absolute z-10 overflow-x-hidden overflow-y-hidden shadow-[rgba(0,0,0,0.11)_1px_1px_4px_2px] opacity-0 caret-white my-0 pl-0 rounded-br-[2px] rounded-t-[2px] rounded-bl-[2px] left-[13.6px] right-auto top-full bottom-auto">
				<li
					id="menu-item-1708"
					className="leading-[16.8px] font-semibold text-[14px] uppercase relative block overflow-x-hidden overflow-y-hidden list-outside caret-white hover:bg-[#f8f8f8] hover:text-black"
				>
					<a
						href="https://www.flickr.com/photos/proideastock/collections/72157721909355753/"
						className='bg-[#1b132d] [font-family:"Open_Sans",Helvetica,Arial,sans-serif,system-ui,sans-serif] [white-space-collapse:collapse] [text-wrap-mode:nowrap] relative block caret-white px-6 py-3 hover:text-[#2ebcfc]'
					>
						PHOTOS
					</a>
				</li>
				<li
					id="menu-item-2825"
					className="leading-[16.8px] font-semibold text-[14px] uppercase relative block overflow-x-hidden overflow-y-hidden list-outside caret-white hover:bg-[#f8f8f8] hover:text-black"
				>
					<a
						href="https://hackyeah.pl/media-kit/"
						className='bg-[#1b132d] [font-family:"Open_Sans",Helvetica,Arial,sans-serif,system-ui,sans-serif] [white-space-collapse:collapse] [text-wrap-mode:nowrap] relative block caret-white px-6 py-3 hover:text-[#2ebcfc]'
					>
						MEDIA KIT
					</a>
				</li>
				<Component_3_1_2_1 />
				<Component_3_1_2_2 />
				<li
					id="menu-item-1709"
					className="leading-[16.8px] font-semibold text-[14px] uppercase relative block overflow-x-hidden overflow-y-hidden list-outside caret-white hover:bg-[#f8f8f8] hover:text-black"
				>
					<a
						href="#contact"
						className='bg-[#1b132d] [font-family:"Open_Sans",Helvetica,Arial,sans-serif,system-ui,sans-serif] [white-space-collapse:collapse] [text-wrap-mode:nowrap] relative block caret-white px-6 py-3 hover:text-[#2ebcfc]'
					>
						CONTACT
					</a>
				</li>
			</ul>
		</li>
	);
}
