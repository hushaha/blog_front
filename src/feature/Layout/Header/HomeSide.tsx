import { FC } from "react";

import SideMenu from "@/components/SideMenu";

import Links from "./Links";

interface Props {
	visabled: boolean;
	onChange: (visabled: boolean) => void;
}

const HomeSide: FC<Props> = ({ visabled, onChange }) => {
	const onClickTag = () => {
		onChange(false);
	};

	return (
		<SideMenu visabled={visabled} onChange={onChange}>
			<Links onClick={onClickTag} />
		</SideMenu>
	);
};

export default HomeSide;
