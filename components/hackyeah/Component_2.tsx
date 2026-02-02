import { Component_2_1 } from "./Component_2_1";
import { Component_2_2 } from "./Component_2_2";
import { Component_2_3 } from "./Component_2_3";
import { Component_2_4 } from "./Component_2_4";
import { Component_2_5 } from "./Component_2_5";

export function Component_2() {
	return (
		<div
			tabIndex={0}
			className="bg-white text-[#212121] max-w-full fixed invisible shadow-[rgba(0,0,0,0.3)_0px_32px_68px_0px] -translate-x-2/4 translate-y-full caret-[#212121] mx-auto rounded-br-[6px] rounded-t-[6px] rounded-bl-[6px] top-2/4 bottom-auto inset-x-auto"
			data-component-id="Component_2"
		>
			<div
				role="dialog"
				aria-label="Customise Consent Preferences"
				className="bg-white w-[845px] max-h-[856.791px] flex overflow-x-hidden overflow-y-hidden flex-col grow basis-0 caret-[#212121] rounded-br-[6px] rounded-t-[6px] rounded-bl-[6px]"
			>
				<div className="flex justify-between items-center caret-[#212121] px-6 py-[22px] border-b-[0.909091px] border-[#f4f4f4]">
					<span role="heading" className="text-[#212121] font-bold text-[18px] block caret-[#212121]">
						Customize Consent Preferences
					</span>
					<button
						type="button"
						aria-label="[cky_preference_close_label]"
						className="bg-[rgba(0,0,0,0)] leading-[0] [font-family:Arial,system-ui,sans-serif] align-middle min-h-0 block p-0"
					>
						<img
							src="https://hackyeah.pl/wp-content/plugins/cookie-law-info/lite/frontend/images/close.svg"
							alt="Close"
							className="text-[13.3333px] text-center w-2.5 h-2.5 max-w-full basis-0"
						/>
					</button>
				</div>
				<div className="grow basis-[0%] caret-[#212121] px-6">
					<div className="text-[#212121] text-[14px] caret-[#212121] py-3 border-b-[0.909091px] border-[#f4f4f4]">
						<p className="caret-[#212121] mt-0">
							We use cookies to help you navigate efficiently and perform certain functions. You will find
							detailed information about all cookies under each consent category below.
						</p>
						<p className="caret-[#212121] my-0">
							The cookies that are categorized as "Necessary" are stored on your browser as they are essential
							for enabling the basic functionalities of the site. ...
							<button
								type="button"
								aria-label="Show more"
								className="bg-[rgba(0,0,0,0)] text-[#1863dc] [white-space-collapse:collapse] [text-wrap-mode:nowrap] min-h-0 caret-[#1863dc] p-0"
							>
								Show more
							</button>
						</p>
					</div>
					<div className="caret-[#212121] mb-2.5">
						<Component_2_1 />
						<Component_2_2 />
						<Component_2_3 />
						<Component_2_4 />
						<Component_2_5 />
					</div>
				</div>
				<div className="relative caret-[#212121]">
					<div className="flex flex-wrap justify-center items-center caret-[#212121] px-6 py-[22px] border-t-[0.909091px] border-[#f4f4f4]">
						<button
							type="button"
							aria-label="Reject All"
							className="bg-[rgba(0,0,0,0)] text-[#e6007e] font-medium text-[14px] min-h-0 max-w-full block grow caret-[#e6007e] mr-2 p-2 rounded-br-[2px] rounded-t-[2px] rounded-bl-[2px] focus:[outline-style:initial] focus:outline-0 focus:outline-[initial] hover:opacity-80"
						>
							Reject All
						</button>
						<button
							type="button"
							aria-label="Save My Preferences"
							className="bg-[rgba(0,0,0,0)] text-[#1863dc] font-medium text-[14px] min-h-0 max-w-full block grow caret-[#1863dc] mr-2 p-2 rounded-br-[2px] rounded-t-[2px] rounded-bl-[2px] focus:[outline-style:initial] focus:outline-0 focus:outline-[initial] hover:opacity-80"
						>
							Save My Preferences
						</button>
						<button
							type="button"
							aria-label="Accept All"
							className="bg-[#e6007e] text-white font-medium text-[14px] min-h-0 max-w-full block grow caret-white p-2 rounded-br-[2px] rounded-t-[2px] rounded-bl-[2px] focus:[outline-style:initial] focus:outline-0 focus:outline-[initial] hover:opacity-80"
						>
							Accept All
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
