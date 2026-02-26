import { Outlet } from "react-router-dom";

export function RootLayout() {
	return (
		<div className="min-h-screen bg-bg-primary text-text-primary">
			<Outlet />
		</div>
	);
}
