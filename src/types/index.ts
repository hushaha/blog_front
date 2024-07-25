export interface BlogItem {
	title: string;
	id: string;
	createTime: string;
	updateTime: string;
	content: string;
	desc: string;
	authors?: string;
	tag?: string;
	isDrafts?: boolean;
	cover?: string;
}

export interface TagItem {
	name: string;
	count: number;
}

export interface TocItem {
	value: string;
	depth: number;
	children?: TocItem[];
}

export type TocTree = TocItem[];
