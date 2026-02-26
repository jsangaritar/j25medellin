import type { LucideIcon } from "lucide-react";

type TagVariant = "accent" | "amber" | "purple";

interface TagProps {
	variant?: TagVariant;
	icon?: LucideIcon;
	children: React.ReactNode;
	className?: string;
}

const variantStyles: Record<TagVariant, { bg: string; text: string }> = {
	accent: {
		bg: "bg-accent-dim",
		text: "text-accent-bright",
	},
	amber: {
		bg: "bg-[#F59E0B1A]",
		text: "text-[#F59E0B]",
	},
	purple: {
		bg: "bg-[#7C3AED1A]",
		text: "text-[#7C3AED]",
	},
};

export function Tag({
	variant = "accent",
	icon: Icon,
	children,
	className = "",
}: TagProps) {
	const styles = variantStyles[variant];
	return (
		<span
			className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 ${styles.bg} ${className}`}
		>
			{Icon && <Icon size={12} className={styles.text} />}
			<span className={`text-[11px] font-bold tracking-wider ${styles.text}`}>
				{children}
			</span>
		</span>
	);
}
