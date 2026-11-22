export default {
	poweredByHeader: false,
	devIndicators: false,
	// Give previously cached chunk 404s a fresh production asset URL.
	webpack(config, { dev, isServer }) {
		if (!dev && !isServer) config.output.hashSalt = "encoded-route-chunks-v2";
		return config;
	},
	experimental: { cpus: 2 },
};
