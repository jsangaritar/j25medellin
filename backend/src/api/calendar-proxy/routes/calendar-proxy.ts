export default {
	routes: [
		{
			method: "GET",
			path: "/calendar-proxy",
			handler: "calendar-proxy.find",
			config: {
				policies: [],
				middlewares: [],
			},
		},
	],
};
