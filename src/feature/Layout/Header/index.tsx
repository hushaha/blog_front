import Link from "next/link";
import React, { useState } from "react";

import { Logo } from "@/components";

import HomeSide from "./HomeSide";
import Links from "./Links";

const Header = () => {
	const [visabled, setVisabled] = useState(false);

	const onChangeMenuVis = (e) => {
		setVisabled(e);
	};

	return (
		<nav className="q-bg-cpt px-6 py-3 shadow">
			<div className="container mx-auto flex items-center justify-between">
				<Link href="/" passHref>
					<a className="text-xl font-bold sm:text-2xl">
						<Logo />
					</a>
				</Link>
				<div className="flex items-center sm:hidden">
					<button
						className="icon-[ep--menu]"
						style={{ width: "1.5rem", height: "1.5rem" }}
						onClick={() => onChangeMenuVis(true)}
					/>
				</div>
				<div className="hidden flex-shrink-0 sm:block">
					<Links onClick={() => onChangeMenuVis(false)} />
				</div>
			</div>
			<HomeSide visabled={visabled} onChange={onChangeMenuVis} />
		</nav>
	);
};

export default Header;
