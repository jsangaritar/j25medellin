import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface SectionHeaderProps {
	title: string;
	actionText?: string;
	actionHref?: string;
}

export function SectionHeader({
	title,
	actionText = "Ver todos",
	actionHref,
}: SectionHeaderProps) {
	return (
		<div className="flex items-center justify-between">
			<h2 className="font-display text-lg font-bold tracking-tight text-text-primary md:text-[22px] md:tracking-[-0.3px]">
				{title}
			</h2>
			{actionHref && (
				<Link
					to={actionHref}
					className="flex items-center gap-1 text-xs font-medium text-text-muted transition-colors hover:text-text-secondary md:gap-1.5 md:text-[13px]"
				>
					{actionText}
					<ArrowRight size={12} className="md:h-3.5 md:w-3.5" />
				</Link>
			)}
		</div>
	);
}
