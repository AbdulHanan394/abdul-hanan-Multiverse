"use client";
import { useEffect, useState } from "react";
type Config = {
	assistant: boolean;
	contact: boolean;
	email: string | null;
	resume: string | null;
};
let pending: Promise<Config> | undefined;
export default function useConfig() {
	const [config, setConfig] = useState<Config | null>(null);
	useEffect(() => {
		let live = true;
		pending ??= fetch("/api/config").then((r) => {
			if (!r.ok) throw Error();
			return r.json();
		});
		pending
			.then((v) => {
				if (live) setConfig(v);
			})
			.catch(() => {
				pending = undefined;
				if (live)
					setConfig({
						assistant: false,
						contact: false,
						email: null,
						resume: null,
					});
			});
		return () => {
			live = false;
		};
	}, []);
	return config;
}
