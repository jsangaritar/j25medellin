import { Menu, MessageCircle, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

const navItems = [
	{ to: "/", label: "Inicio" },
	{ to: "/discipulados", label: "Discipulados" },
	{ to: "/media", label: "Contenido" },
	{ to: "/eventos", label: "Eventos" },
];

export function Header() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	return (
		<header className="sticky top-0 z-40 border-b border-border bg-bg-primary">
			{/* Desktop */}
			<div className="hidden items-center justify-between px-14 py-[18px] md:flex">
				<Link to="/">
					<img src="/j25-logo.svg" alt="J+" className="h-8" />
				</Link>
				<nav className="flex items-center gap-9">
					{navItems.map((item) => (
						<NavLink
							key={item.to}
							to={item.to}
							end={item.to === "/"}
							className={({ isActive }) =>
								`text-[13px] transition-colors ${
									isActive
										? "font-semibold text-text-primary"
										: "font-medium text-text-muted hover:text-text-secondary"
								}`
							}
						>
							{item.label}
						</NavLink>
					))}
				</nav>
				<a
					href="https://wa.me/"
					target="_blank"
					rel="noopener noreferrer"
					className="inline-flex items-center gap-2 rounded-[10px] bg-accent-bright px-7 py-3.5 text-sm font-semibold text-bg-primary transition-colors hover:bg-accent-muted"
				>
					<MessageCircle size={16} />
					Contáctanos
				</a>
			</div>

			{/* Mobile */}
			<div className="flex items-center justify-between px-5 py-3.5 md:hidden">
				<Link to="/">
					<img src="/j25-logo.svg" alt="J+" className="h-7" />
				</Link>
				<button
					type="button"
					onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
					className="text-text-primary"
				>
					{mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
				</button>
			</div>

			{/* Mobile menu overlay */}
			{mobileMenuOpen && (
				<nav className="flex flex-col border-t border-border bg-bg-primary px-5 py-4 md:hidden">
					{navItems.map((item) => (
						<NavLink
							key={item.to}
							to={item.to}
							end={item.to === "/"}
							onClick={() => setMobileMenuOpen(false)}
							className={({ isActive }) =>
								`py-3 text-sm transition-colors ${
									isActive
										? "font-semibold text-text-primary"
										: "font-medium text-text-muted"
								}`
							}
						>
							{item.label}
						</NavLink>
					))}
					<a
						href="https://wa.me/"
						target="_blank"
						rel="noopener noreferrer"
						className="mt-3 inline-flex items-center justify-center gap-2 rounded-[10px] bg-accent-bright px-7 py-3.5 text-sm font-semibold text-bg-primary"
					>
						<MessageCircle size={16} />
						Contáctanos
					</a>
				</nav>
			)}
		</header>
	);
}
