const withBundleAnalyzer = require("@next/bundle-analyzer")({
	enabled: process.env.ANALYZE === "true",
});

module.exports = withBundleAnalyzer({
	// react严格模式
	reactStrictMode: true,

	// eslint
	eslint: {
		dirs: ["src"],
	},

	webpack(config) {
		config.resolve.fallback = {
			...config.resolve.fallback,
			fs: false,
		};
		config.module.rules.push({
			test: /\.svg$/,
			use: ["@svgr/webpack"],
		});
		return config;
	},

	// 接口代理
	async rewrites() {
		return [
			{
				source: "/q-blog/:path*",
				destination: `${process.env.NEXT_PUBLIC_API_HOST}/:path*`,
			},
		];
	},

	// 重定向
	async redirects() {
		return [
			{
				source: "/",
				destination: "/blog",
				permanent: true,
			},
		];
	},
});
