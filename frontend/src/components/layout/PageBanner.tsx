import type { LucideIcon } from "lucide-react";
import { Tag } from "../ui/Tag";

interface PageBannerProps {
	tag: string;
	tagIcon?: LucideIcon;
	title: string;
	subtitle: string;
}

export function PageBanner({ tag, tagIcon, title, subtitle }: PageBannerProps) {
	return (
		<section className="border-b border-border bg-bg-surface px-5 py-8 md:px-14 md:py-14">
			<Tag icon={tagIcon}>{tag}</Tag>
			<h1 className="mt-2.5 font-display text-[28px] font-extrabold tracking-tight text-text-primary md:mt-3 md:text-[40px] md:tracking-[-1px]">
				{title}
			</h1>
			<p className="mt-2.5 text-sm text-text-secondary md:mt-3 md:text-base">
				{subtitle}
			</p>
		</section>
	);
}
