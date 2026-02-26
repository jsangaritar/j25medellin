import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "./components/layout/RootLayout";
import { AudioDetailPage } from "./pages/AudioDetailPage";
import { DiscipuladosPage } from "./pages/DiscipuladosPage";
import { DocumentDetailPage } from "./pages/DocumentDetailPage";
import { EventosPage } from "./pages/EventosPage";
import { HomePage } from "./pages/HomePage";
import { MediaPage } from "./pages/MediaPage";
import { VideoDetailPage } from "./pages/VideoDetailPage";

export const router = createBrowserRouter([
	{
		element: <RootLayout />,
		children: [
			{ index: true, element: <HomePage /> },
			{ path: "discipulados", element: <DiscipuladosPage /> },
			{ path: "media", element: <MediaPage /> },
			{ path: "media/video/:slug", element: <VideoDetailPage /> },
			{ path: "media/audio/:slug", element: <AudioDetailPage /> },
			{ path: "media/documento/:slug", element: <DocumentDetailPage /> },
			{ path: "eventos", element: <EventosPage /> },
		],
	},
]);
