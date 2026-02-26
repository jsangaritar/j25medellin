import { BookOpen, Calendar, Clock, MapPin } from "lucide-react";
import type { Course, CourseStatus } from "../../../types";
import { Tag } from "../../ui/Tag";

interface CourseCardProps {
	course: Course;
	onRegister?: (course: Course) => void;
}

const statusConfig: Record<
	CourseStatus,
	{ label: string; variant: "accent" | "amber" | "purple" }
> = {
	DRAFT: { label: "Borrador", variant: "purple" },
	COMING_SOON: { label: "Pr\u00f3ximamente", variant: "amber" },
	ACTIVE: { label: "Activo", variant: "accent" },
	COMPLETED: { label: "Completado", variant: "purple" },
	ARCHIVED: { label: "Archivado", variant: "purple" },
};

export function CourseCard({ course, onRegister }: CourseCardProps) {
	const imageUrl = course.image?.url;
	const config = statusConfig[course.status];

	return (
		<div className="flex flex-col overflow-hidden rounded-[14px] border border-border bg-bg-card">
			{imageUrl && (
				<div className="h-[140px] w-full overflow-hidden md:h-[200px]">
					<img
						src={imageUrl}
						alt={course.title}
						className="h-full w-full object-cover"
					/>
				</div>
			)}
			<div className="flex flex-1 flex-col gap-3 p-4 md:p-5">
				<Tag variant={config.variant} icon={BookOpen}>
					{config.label}
				</Tag>
				<h3 className="font-display text-[17px] font-bold text-text-primary md:text-lg">
					{course.title}
				</h3>
				{course.description && (
					<p className="text-[13px] leading-[1.4] text-text-secondary line-clamp-3">
						{course.description}
					</p>
				)}

				{/* Meta info */}
				<div className="mt-auto flex flex-col gap-1.5 text-[11px] text-text-muted">
					{course.schedule && (
						<div className="flex items-center gap-1.5">
							<Clock size={12} />
							<span>{course.schedule}</span>
						</div>
					)}
					{course.location && (
						<div className="flex items-center gap-1.5">
							<MapPin size={12} />
							<span>{course.location}</span>
						</div>
					)}
					{course.startDate && (
						<div className="flex items-center gap-1.5">
							<Calendar size={12} />
							<span>
								Inicia{" "}
								{new Date(course.startDate).toLocaleDateString("es-CO", {
									month: "long",
									day: "numeric",
								})}
							</span>
						</div>
					)}
				</div>

				{/* Register button for active/coming soon courses */}
				{(course.status === "ACTIVE" || course.status === "COMING_SOON") &&
					onRegister && (
						<button
							type="button"
							onClick={() => onRegister(course)}
							className="mt-2 w-full rounded-[10px] bg-accent-bright py-3 text-sm font-semibold text-bg-primary transition-colors hover:bg-accent-muted"
						>
							Inscribirme
						</button>
					)}
			</div>
		</div>
	);
}
